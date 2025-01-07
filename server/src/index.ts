import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { TopicHandler, UserHandler } from "./handlers/handlers";
import * as dotenv from "dotenv";
import { Database } from "./data/database";
import { Topic, User } from "./data/models/models";
import { FacebookAuthService, GoogleAuthService } from "./services/services";

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
    const topicsCollection = db.getCollection<Topic>("topics");

    const userHandler = new UserHandler(usersCollection);
    const topicHandler = new TopicHandler(topicsCollection);

    const facebookAuthService = new FacebookAuthService(userHandler, topicHandler);
    const googleAuthService = new GoogleAuthService(userHandler, topicHandler);

    io.on("connection", async (socket: Socket) => {
      console.log("Client connected");

      socket.on("authenticateFacebook", async (data) => {
        try {
          const {user, chat} = await facebookAuthService.authenticate(data);
          socket.emit("authenticationSuccess", {success: true, user, chat});
        } catch (error) {
          console.error("Failed to authenticate user:", error);
          socket.emit("error", {success: false, message: error.message});
        }
      });

      socket.on("authenticateGoogle", async (data) => {
        try {
          const {user, chat} = await googleAuthService.authenticate(data);
          socket.emit("authenticationSuccess", {success: true, user, chat});
        } catch (error) {
          console.error("Failed to authenticate Google user:", error);
          socket.emit("error", {success: false, message: error.message});
        }
      });

    });

    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize server:", error);
  }
};

initializeServer();
