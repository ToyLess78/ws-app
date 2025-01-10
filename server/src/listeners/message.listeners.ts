import { Socket } from "socket.io";
import { GptService, RandomMessageService } from "../services/services";
import { MessageHandler, TopicHandler } from "../handlers/handlers";
import { Message } from "../data/models/message";

export const registerMessageListeners = (
  socket: Socket,
  messageHandler: MessageHandler,
  topicHandler: TopicHandler,
  randomMessageService: RandomMessageService
): void => {
  socket.on("sendMessage", async (data) => {
    const {topicId, message} = data;

    if (!topicId || !message) {
      socket.emit("error", {success: false, message: "Invalid message data."});
      return;
    }

    try {
      const updatedTopic = await messageHandler.addMessage(topicId, message);
      socket.emit("topicUpdated", {success: true, topic: updatedTopic});

      setTimeout(async () => {
        try {
          const gptService = GptService.Instance;
          const aiResponseText = await gptService.generateResponse(message.text);

          const botMessage = new Message("bot", aiResponseText);
          const updatedTopicWithResponse = await messageHandler.addMessage(topicId, botMessage);

          socket.emit("topicUpdated", {success: true, topic: updatedTopicWithResponse});
        } catch (error) {
          console.error("Failed to generate AI response:", error.message);
          socket.emit("error", {success: false, message: "Failed to generate AI response."});
        }
      }, 3000);
    } catch (error) {
      console.error("Failed to add message to topic:", error.message);
      socket.emit("error", {success: false, message: error.message});
    }
  });

  socket.on("startRandomMessages", async (data) => {
    const {userId} = data;

    if (!userId) {
      socket.emit("error", {success: false, message: "User ID is required."});
      return;
    }

    await randomMessageService.sendRandomMessages(userId, topicHandler, messageHandler, socket);
  });
};
