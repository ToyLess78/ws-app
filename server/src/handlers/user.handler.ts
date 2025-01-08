import { Collection } from "mongodb";
import { User } from "../data/models/user";

export class UserHandler {
    private usersCollection: Collection<User>;

    constructor(usersCollection: Collection<User>) {
        this.usersCollection = usersCollection;
    }

    public async addUser(user: User): Promise<User> {
        await this.usersCollection.insertOne(user);
        return user;
    }

    public async getUserById(userId: string): Promise<User | null> {
        return await this.usersCollection.findOne({_id: userId});
    }
}
