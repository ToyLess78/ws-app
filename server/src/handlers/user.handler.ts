import { Collection } from "mongodb";
import { User } from "../data/models/user";
import { FacebookResponse } from "../common/interfaces";

export class UserHandler {
  private usersCollection: Collection<User>;

  constructor(usersCollection: Collection<User>) {
    this.usersCollection = usersCollection;
  }

  public async authUserFromFacebook(data: FacebookResponse): Promise<User> {
    const userId = data.id;
    const existingUser = await this.usersCollection.findOne({ _id: userId });

    if (existingUser) {
      return existingUser;
    }

    const newUser: User = {
      _id: userId,
      name: data.name || "Unknown",
      picture: data.picture?.data?.url || "",
      email: data.email || undefined,
      createdAt: new Date().toISOString(),
    };

    await this.usersCollection.insertOne(newUser);
    return newUser;
  }

  public async getUserById(userId: string): Promise<User | null> {
    return await this.usersCollection.findOne({ _id: userId });
  }
}
