import { Collection, MongoClient } from "mongodb";
import { logger } from "./config";

export class Database {
  private static instance: Database;
  private client: MongoClient;

  private constructor() {
    this.client = new MongoClient(process.env.MONGO_URI || "mongodb://localhost:27017");
  }

  public static get Instance(): Database {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      logger.info("Connected to MongoDB");
    } catch (error) {
      logger.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  public getCollection<T>(collectionName: string): Collection<T> {
    return this.client.db("chat_app").collection<T>(collectionName);
  }
}