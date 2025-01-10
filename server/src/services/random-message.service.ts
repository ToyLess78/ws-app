import { Message } from "../data/models/message";
import { Socket } from "socket.io";
import { getRandomPhrase } from "../utils/utils";
import { MessageHandler, TopicHandler } from "../handlers/handlers";

export class RandomMessageService {
  private static instance: RandomMessageService;

  private constructor() {
  }

  public static get Instance(): RandomMessageService {
    if (!this.instance) {
      this.instance = new RandomMessageService();
    }
    return this.instance;
  }

  public async sendRandomMessages(
    userId: string,
    topicHandler: TopicHandler,
    messageHandler: MessageHandler,
    socket: Socket
  ): Promise<void> {
    try {
      const topics = await topicHandler.getTopicsByUserId(userId);

      if (!topics || topics.length === 0) {
        console.warn(`No topics found for userId: ${userId}`);
        return;
      }

      for (let i = 0; i < 5; i++) {
        setTimeout(async () => {
          try {
            const randomTopic = topics[Math.floor(Math.random() * topics.length)];
            const randomMessageText = getRandomPhrase();

            const randomMessage = new Message("bot", randomMessageText);

            const updatedTopic = await messageHandler.addMessage(randomTopic._id.toString(), randomMessage);

            socket.emit("topicUpdated", {success: true, topic: updatedTopic});
          } catch (error) {
            console.error("Failed to send random message:", error.message);
          }
        }, i * 3000);
      }
    } catch (error) {
      console.error("Failed to send random messages:", error.message);
    }
  }
}
