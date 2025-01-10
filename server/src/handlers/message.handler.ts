import { Collection, EnhancedOmit, InferIdType, ObjectId } from "mongodb";
import { Topic } from "../data/models/topic";
import { Message } from "../data/models/message";
import { randomUUID } from "crypto";

export class MessageHandler {
  private topicsCollection: Collection<Topic>;

  constructor(topicsCollection: Collection<Topic>) {
    this.topicsCollection = topicsCollection;
  }

  public async addMessage(topicId: string, message: Message): Promise<Topic> {
    if (!topicId || !message) {
      throw new Error("Invalid topic data.");
    }

    const newMessage = {
      ...message,
      messageId: randomUUID(),
      timestamp: new Date().toISOString(),
    };

    const result: EnhancedOmit<Topic, "_id"> & {
      _id: InferIdType<Topic>;
    } = await this.topicsCollection.findOneAndUpdate(
      { _id: new ObjectId(topicId) },
      {
        $push: { messages: newMessage },
        $set: { updatedAt: new Date().toISOString() },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      throw new Error("Topic not found or update failed.");
    }

    return result;
  }

}
