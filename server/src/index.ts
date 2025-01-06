import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { UserHandler } from "./handlers/user.handler";
import { TopicHandler } from "./handlers/topic.handler";
import * as dotenv from "dotenv";
import { Database } from "./data/database";
import { Topic } from "./data/models/topic";
import { User } from "./data/models/user";

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

    io.on("connection", async (socket: Socket) => {
      console.log("Client connected");

      socket.on("authenticateFacebook", async (data) => {
        try {
          const user = await userHandler.authUserFromFacebook(data);
          socket.emit("authenticationSuccess", { success: true, user });
        } catch (error) {
          console.error("Failed to authenticate user:", error);
          socket.emit("error", { success: false, message: error.message });
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
