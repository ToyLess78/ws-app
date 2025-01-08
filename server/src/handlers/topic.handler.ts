import { Collection, InsertManyResult, ObjectId } from "mongodb";
import { Topic } from "../data/models/topic";
import { Message } from "../data/models/message";
import { getTestTopicsForUser } from "../fixtures/test-topics";
import { randomUUID } from "crypto";
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

  public async addMessageToTopic(topicId: string, message: Message): Promise<void> {
    const newMessage = {
      ...message,
      messageId: randomUUID(),
      timestamp: new Date().toISOString(),
    };

    await this.topicsCollection.updateOne(
      {_id: new ObjectId(topicId)},
      {$push: {messages: newMessage}, $set: {updatedAt: new Date().toISOString()}}
    );
  }
}
