import { TopicHandler, UserHandler } from "../handlers/handlers";
import { FacebookResponse } from "../common/interfaces";
import { Topic, User } from "../data/models/models";

export class FacebookAuthService {
    private userHandler: UserHandler;
    private topicHandler: TopicHandler;

    constructor(userHandler: UserHandler, topicHandler: TopicHandler) {
        this.userHandler = userHandler;
        this.topicHandler = topicHandler;
    }

    public async authenticate(data: FacebookResponse): Promise<{
        user: User;
        chat: Topic[];
    }> {
        const existingUser = await this.userHandler.getUserById(data.id);

        if (existingUser) {
            const chat = await this.topicHandler.getTopicsByUserId(existingUser._id);
            return {user: existingUser, chat};
        } else {
            const newUser: User = {
                _id: data.id,
                name: data.name || "Unknown",
                picture: data.picture?.data?.url || "",
                email: data.email || undefined,
                createdAt: new Date().toISOString(),
            };

            await this.userHandler.addUser(newUser);
            const testChats = await this.topicHandler.createTestTopicsForUser(newUser._id);
            return {user: newUser, chat: testChats};
        }
    }
}
