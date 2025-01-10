import { Server, Socket } from "socket.io";
import { GptService } from "../services/services";

export class GptHandler {
  private io: Server;
  private gptService: GptService;

  public constructor(io: Server, gptService: GptService) {
    this.io = io;
    this.gptService = gptService;
  }

  public async handleConnection(socket: Socket): Promise<void> {
    socket.on("ask", async (prompt) => {
      const response = await this.gptService.generateResponse(prompt);
      socket.emit("response", response);
    });
  }
}
