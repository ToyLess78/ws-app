import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { TopicHandler, UserHandler } from "./handlers/handlers";
import { Topic, User } from "./data/models/models";
import { FacebookAuthService, GoogleAuthService } from "./services/services";
import { authListeners, topicListeners } from "./listeners/listeners";
import { config, Database, logger } from "./config/config";


const PORT = config.PORT;

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

    const facebookAuthService = new FacebookAuthService(userHandler, topicHandler);
    const googleAuthService = new GoogleAuthService(userHandler, topicHandler);

    io.on("connection", async (socket: Socket) => {
      logger.info("Client connected");

      authListeners(socket, facebookAuthService, googleAuthService);

      topicListeners(socket, topicHandler);

    });

    httpServer.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to initialize server:", error);
  }
};

initializeServer();
