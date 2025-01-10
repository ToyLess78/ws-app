import { Socket } from "socket.io";
import { FacebookAuthService, GoogleAuthService } from "../services/services";

export const registerAuthListeners = (
  socket: Socket,
  facebookAuthService: FacebookAuthService,
  googleAuthService: GoogleAuthService
): void => {
  socket.on("authenticateFacebook", async (data) => {
    try {
      const {user, chat} = await facebookAuthService.authenticate(data);
      socket.emit("authenticationSuccess", {success: true, user, chat});
    } catch (error) {
      console.error("Failed to authenticate user:", error);
      socket.emit("error", {success: false, message: error.message});
    }
  });

  socket.on("authenticateGoogle", async (data) => {
    try {
      const {user, chat} = await googleAuthService.authenticate(data);
      socket.emit("authenticationSuccess", {success: true, user, chat});
    } catch (error) {
      console.error("Failed to authenticate Google user:", error);
      socket.emit("error", {success: false, message: error.message});
    }
  });
};
