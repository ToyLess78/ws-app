import { TopicHandler, UserHandler } from "../handlers/handlers";
import { Topic, User } from "../data/models/models";
import { DecodedToken, TokenDecoder } from "../utils/token-decoder";

export class GoogleAuthService {
    private userHandler: UserHandler;
    private topicHandler: TopicHandler;

    constructor(userHandler: UserHandler, topicHandler: TopicHandler) {
        this.userHandler = userHandler;
        this.topicHandler = topicHandler;
    }

    public async authenticate(data: { credential: string }): Promise<{
        user: User;
        chat: Topic[];
    }> {
        const decoded: DecodedToken = TokenDecoder.decodeGoogleToken(data.credential);

        const userId = decoded.sub;
        const existingUser = await this.userHandler.getUserById(userId);

        if (existingUser) {
            const chat = await this.topicHandler.getTopicsByUserId(existingUser._id);
            return {user: existingUser, chat};
        } else {
            const newUser: User = {
                _id: userId,
                name: decoded.name || "Unknown",
                picture: decoded.picture || "",
                email: decoded.email || undefined,
                createdAt: new Date().toISOString(),
            };

            await this.userHandler.addUser(newUser);
            const testChats = await this.topicHandler.createTestTopicsForUser(newUser._id);
            return {user: newUser, chat: testChats};
        }
    }
}
