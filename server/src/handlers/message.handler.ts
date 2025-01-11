import { randomUUID } from "crypto";
import { Collection, EnhancedOmit, InferIdType, ObjectId } from "mongodb";
import { Message } from "../data/models/message";
import { Topic } from "../data/models/topic";

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
      {_id: new ObjectId(topicId)},
      {
        $push: {messages: newMessage},
        $set: {updatedAt: new Date().toISOString()},
      },
      {returnDocument: "after"}
    );

    if (!result) {
      throw new Error("Topic not found or update failed.");
    }

    return result;
  }

  public async editMessage(topicId: string, messageId: string, newText: string): Promise<Topic> {
    if (!topicId || !messageId || !newText) {
      throw new Error("Invalid message data.");
    }

    const result: EnhancedOmit<Topic, "_id"> & {
      _id: InferIdType<Topic>;
    } = await this.topicsCollection.findOneAndUpdate(
      {
        _id: new ObjectId(topicId),
        "messages.messageId": messageId,
      },
      {
        $set: {
          "messages.$.text": newText,
          "messages.$.timestamp": new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      {returnDocument: "after"}
    );

    if (!result) {
      throw new Error("Message not found or update failed.");
    }

    return result;
  }

  public async deleteMessage(topicId: string, messageId: string): Promise<Topic> {
    if (!topicId || !messageId) {
      throw new Error("Invalid message data.");
    }

    const result: EnhancedOmit<Topic, "_id"> & {
      _id: InferIdType<Topic>;
    } = await this.topicsCollection.findOneAndUpdate(
      {_id: new ObjectId(topicId)},
      {
        $pull: {messages: {messageId}},
        $set: {updatedAt: new Date().toISOString()},
      },
      {returnDocument: "after"}
    );

    if (!result) {
      throw new Error("Message not found or delete failed.");
    }

    return result;
  }
}
