import { Collection } from "mongodb";
import { Topic } from "../data/models/topic";
import { Message } from "../data/models/message";
import { randomUUID } from "crypto";

export class TopicHandler {
  private topicsCollection: Collection<Topic>;

  constructor(topicsCollection: Collection<Topic>) {
    this.topicsCollection = topicsCollection;
  }

  public async createTestTopicForUser(userId: string): Promise<Topic> {
    const testTopic: Topic = {
      userId: userId,
      name: "Welcome Topic",
      photo: "https://example.com/default-topic.png",
      messages: [
        {
          messageId: randomUUID(),
          role: "bot",
          text: "Welcome to the platform! Let me know how I can assist you.",
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.topicsCollection.insertOne(testTopic);
    return testTopic;
  }

  public async createTopic(data: Topic): Promise<Topic> {
    const topic = new Topic(data.userId, data.name, data.photo, data.messages);
    await this.topicsCollection.insertOne(topic);
    return topic;
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
  }
}
