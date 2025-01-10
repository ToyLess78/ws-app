import { Socket } from "socket.io";
import { TopicHandler } from "../handlers/handlers";

export const registerTopicListeners = (socket: Socket, topicHandler: TopicHandler): void => {
  socket.on("createTopic", async (data) => {
    const {userId, name} = data;

    try {
      const newTopic = await topicHandler.createTopic(userId, name);
      socket.emit("topicCreated", {success: true, topic: newTopic});
    } catch (error) {
      console.error("Failed to create topic:", error.message);
      socket.emit("error", {success: false, message: error.message});
    }
  });

  socket.on("deleteTopic", async (data) => {
    const {topicId} = data;

    if (!topicId) {
      socket.emit("error", {success: false, message: "Topic ID is required."});
      return;
    }

    try {
      await topicHandler.deleteTopicById(topicId);
      socket.emit("topicDeleted", {success: true, topicId});
    } catch (error) {
      console.error("Failed to delete topic:", error.message);
      socket.emit("error", {success: false, message: error.message});
    }
  });

  socket.on("updateTopicName", async (data) => {
    const {topicId, name} = data;

    if (!topicId || !name) {
      socket.emit("error", {success: false, message: "Invalid topic data."});
      return;
    }

    try {
      const updatedTopic = await topicHandler.updateTopicName(topicId, name);
      socket.emit("topicUpdated", {success: true, topic: updatedTopic});
    } catch (error) {
      console.error("Failed to update topic name:", error.message);
      socket.emit("error", {success: false, message: error.message});
    }
  });
};
