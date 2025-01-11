import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { TopicHandler, UserHandler } from "./handlers/handlers";
import * as dotenv from "dotenv";
import { Database } from "./data/database";
import { Topic, User } from "./data/models/models";
import { FacebookAuthService, GoogleAuthService, RandomMessageService } from "./services/services";
import { registerAuthListeners, registerMessageListeners, registerTopicListeners } from "./listeners/listeners";
import { MessageHandler } from "./handlers/message.handler";

dotenv.config();

const PORT = process.env.PORT || 3005;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const initializeServer = async () => {
  try {
    const db = Database.Instance;
    await db.connect();

    const usersCollection = db.getCollection<User>("users");
    const topicsCollection = db.getCollection<Topic>("chat");

    const userHandler = new UserHandler(usersCollection);
    const topicHandler = new TopicHandler(topicsCollection);
    const messageHandler = new MessageHandler(topicsCollection);

    const facebookAuthService = new FacebookAuthService(userHandler, topicHandler);
    const googleAuthService = new GoogleAuthService(userHandler, topicHandler);
    const randomMessageService = RandomMessageService.Instance;

    io.on("connection", async (socket: Socket) => {
      console.info("Client connected");

      registerAuthListeners(socket, facebookAuthService, googleAuthService);

      registerTopicListeners(socket, topicHandler, userHandler);

      registerMessageListeners(socket, messageHandler, topicHandler, randomMessageService);

    });

    httpServer.listen(PORT, () => {
      console.info(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize server:", error);
  }
};

initializeServer();
