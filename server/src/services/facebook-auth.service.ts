import { UserHandler, TopicHandler } from "../handlers/handlers";
import { FacebookResponse } from "../common/interfaces";
import { User, Topic } from "../data/models/models";

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
      return { user: existingUser, chat };
    } else {
      const user = await this.userHandler.addUserFromFacebook(data);
      const testChat = await this.topicHandler.createTestTopicForUser(user._id);
      return { user, chat: [testChat] };
    }
  }
}
