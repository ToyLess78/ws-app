import { Collection } from "mongodb";
import { Socket, Server } from "socket.io";

export class MongoHandler {
  private io: Server;
  private usersCollection: Collection;
  private chatsCollection: Collection;

  public constructor(
    io: Server,
    usersCollection: Collection,
    chatsCollection: Collection
  ) {
    this.io = io;
    this.usersCollection = usersCollection;
    this.chatsCollection = chatsCollection;
  }

  public handleConnection(socket: Socket): void {
    socket.on("createUser", async (data) => {
      const existingUser = await this.usersCollection.findOne({ userId: data.userId });
      if (existingUser) {
        socket.emit("userExists", { success: false, message: "User already exists" });
        return;
      }

      await this.usersCollection.insertOne(data);
      socket.emit("userCreated", { success: true, user: data });
    });

    socket.on("createChat", async (data) => {
      const chat = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await this.chatsCollection.insertOne(chat);
      socket.emit("chatCreated", { success: true, chat });
    });

    socket.on("fetchChats", async (userId) => {
      const chats = await this.chatsCollection.find({ userId }).toArray();
      socket.emit("chatsFetched", { success: true, chats });
    });
  }
}
