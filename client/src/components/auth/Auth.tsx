import FacebookLogin from "@greatsumini/react-facebook-login";
import { ProfileSuccessResponse } from "@greatsumini/react-facebook-login/dist/types/response.type";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useContext } from "react";
import { toast } from "react-toastify";
import { SocketContext } from "../../context/socket";
import { useSessionStorage } from "../../hooks/hooks";
import "./Auth.scss";

const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;

export const Auth: React.FC = () => {
  const socket = useContext(SocketContext);

  const {saveUserToSession, saveChatToSession} = useSessionStorage();

  const handleGoogleAuth = (response: CredentialResponse) => {
    socket.emit("authenticateGoogle", response);
  };

  const handleFacebookAuth = (response: ProfileSuccessResponse) => {
    socket.emit("authenticateFacebook", response);
  };

  const handleAuthError = () => {
    toast.error("Login Failed");
  };

  socket.on("authenticationSuccess", (response) => {
    saveUserToSession(response.user);
    saveChatToSession(response.chat);
    window.location.reload();
  });

  return (
    <div>
      <p className="auth__title">Login to continue</p>

      <GoogleLogin
        locale="en"
        onSuccess={handleGoogleAuth}
        onError={handleAuthError}
        useOneTap
      />

      <FacebookLogin
        className="facebook-button"
        appId={facebookAppId}
        scope="public_profile"
        onFail={handleAuthError}
        onProfileSuccess={handleFacebookAuth}
      />
    </div>
  );
};
