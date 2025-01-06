import { Server, Socket } from "socket.io";
import { Collection } from "mongodb";
import { ListEvent } from "../common/enums/enums";

abstract class SocketHandler {
  protected collection: Collection;
  protected io: Server;

  public constructor(io: Server, collection: Collection) {
    this.io = io;
    this.collection = collection;
  }

  public abstract handleConnection(socket: Socket): void;

  protected async updateLists(): Promise<void> {
    const data = await this.collection.find().toArray();
    this.io.emit(ListEvent.UPDATE, data);
  }
}

export { SocketHandler };
