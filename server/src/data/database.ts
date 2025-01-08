import { Collection, MongoClient } from "mongodb";

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
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Failed to connect to MongoDB:", error);
            throw error;
        }
    }

    public getCollection<T>(collectionName: string): Collection<T> {
        return this.client.db("chat_app").collection<T>(collectionName);
    }
}
