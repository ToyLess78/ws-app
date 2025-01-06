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

      const testUserId = "test-user-id";
      const testUser: User = {
        _id: testUserId,
        name: "Test User",
        picture: "https://example.com/avatar.png",
        email: "testuser@example.com",
        createdAt: new Date().toISOString(),
      };

      try {
        // Перевіряємо, чи користувач вже існує
        const existingUser = await userHandler.getUserById(testUserId);
        if (!existingUser) {
          await userHandler.createUser(testUser);
          console.log("Test user created:", testUser);
        } else {
          console.log("Test user already exists:", existingUser);
        }
      } catch (error) {
        console.error("Failed to create test user:", error);
      }

      const testTopic: Topic = {
        userId: testUserId,
        name: "Test Topic",
        photo: "https://example.com/topic.png",
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        const existingTopics = await topicHandler.getTopicsByUserId(testUserId);
        if (!existingTopics.some((topic) => topic.name === "Test Topic")) {
          await topicHandler.createTopic(testTopic);
          console.log("Test topic created:", testTopic);
        } else {
          console.log("Test topic already exists for user:", testUserId);
        }
      } catch (error) {
        console.error("Failed to create test topic:", error);
      }

    });

    httpServer.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize server:", error);
  }
};

initializeServer();
