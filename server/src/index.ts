import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Collection, MongoClient } from "mongodb";
import { GptService } from "./services/gpt.service";
import { MongoHandler } from "./handlers/mongo.handler";
import { GptHandler } from "./handlers/gpt.handler";
import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3005;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = "chat_app";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let usersCollection: Collection;
let chatsCollection: Collection;

const mongoClient = new MongoClient(MONGO_URI);

const initializeServer = async () => {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");

    const db = mongoClient.db(DB_NAME);

    usersCollection = db.collection("users");
    chatsCollection = db.collection("chats");

    const gptService = GptService.Instance;

    const onConnection = (socket: Socket): void => {
      new MongoHandler(io, usersCollection, chatsCollection).handleConnection(socket);
      new GptHandler(io, gptService).handleConnection(socket);
    };

    io.on("connection", onConnection);

    httpServer.listen(PORT, () =>
      console.log(`Server is running at http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Failed to initialize server:", error);
  }
};

initializeServer();
