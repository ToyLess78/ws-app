import { Collection, EnhancedOmit, InferIdType, InsertManyResult, ObjectId } from "mongodb";
import { Topic } from "../data/models/topic";
import { getTestTopicsForUser } from "../fixtures/test-topics";
import { getRandomAvatar } from "../utils/utils";

export class TopicHandler {
  private topicsCollection: Collection<Topic>;

  constructor(topicsCollection: Collection<Topic>) {
    this.topicsCollection = topicsCollection;
  }

  public async createTestTopicsForUser(userId: string): Promise<Topic[]> {
    const testTopics = getTestTopicsForUser(userId);

    const result: InsertManyResult<Topic> = await this.topicsCollection.insertMany(testTopics);

    const insertedIds = Object.values(result.insertedIds);
    return await this.topicsCollection.find({_id: {$in: insertedIds}}).toArray();
  }

  public async createTopic(userId: string, name: string): Promise<Topic> {
    if (!userId || !name) {
      throw new Error("Invalid topic data.");
    }

    const topic: Topic = {
      userId,
      name,
      photo: getRandomAvatar(),
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await this.topicsCollection.insertOne(topic);

    if (!result.acknowledged) {
      throw new Error("Failed to insert topic into the database.");
    }

    return await this.topicsCollection.findOne({_id: result.insertedId});
  }

  public async getTopicsByUserId(userId: string): Promise<Topic[]> {
    return await this.topicsCollection.find({userId}).toArray();
  }

  public async updateTopicName(topicId: string, name: string): Promise<Topic> {
    if (!topicId || !name) {
      throw new Error("Invalid topic data.");
    }

    const result: EnhancedOmit<Topic, "_id"> & {
      _id: InferIdType<Topic>
    } = await this.topicsCollection.findOneAndUpdate(
      {_id: new ObjectId(topicId)},
      {$set: {name, updatedAt: new Date().toISOString()}},
      {returnDocument: "after"}
    );

    if (!result) {
      throw new Error("Topic not found or update failed.");
    }
    return result;
  }

  public async deleteTopicById(topicId: string): Promise<boolean> {
    if (!topicId) {
      throw new Error("Topic ID is required.");
    }

    const result = await this.topicsCollection.deleteOne({_id: new ObjectId(topicId)});

    if (result.deletedCount === 0) {
      throw new Error("Failed to delete topic or topic not found.");
    }

    return true;
  }
}
