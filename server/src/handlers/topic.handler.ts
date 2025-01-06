import { Collection } from "mongodb";
import { Topic } from "../data/models/topic";
import { Message } from "../data/models/message";

export class TopicHandler {
  private topicsCollection: Collection<Topic>;

  constructor(topicsCollection: Collection<Topic>) {
    this.topicsCollection = topicsCollection;
  }

  public async createTopic(data: Topic): Promise<Topic> {
    const topic = new Topic(data.userId, data.name, data.photo, data.messages);
    await this.topicsCollection.insertOne(topic);
    return topic;
  }

  public async getTopicsByUserId(userId: string): Promise<Topic[]> {
    return await this.topicsCollection.find({ userId }).toArray();
  }

  public async addMessageToTopic(topicId: string, message: Message): Promise<void> {
    const newMessage = {
      ...message,
      messageId: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    };
  }
}
