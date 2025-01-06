import { Collection } from "mongodb";
import { User } from "../data/models/user";

export class UserHandler {
  private usersCollection: Collection<User>;

  constructor(usersCollection: Collection<User>) {
    this.usersCollection = usersCollection;
  }

  public async createUser(data: User): Promise<User> {
    const existingUser = await this.usersCollection.findOne({ _id: data._id });
    if (existingUser) {
      return;
    }

    const user = new User(data._id, data.name, data.picture, data.email);
    await this.usersCollection.insertOne(user);
    return user;
  }

  public async getUserById(userId: string): Promise<User | null> {
    return await this.usersCollection.findOne({ _id: userId });
  }
}
