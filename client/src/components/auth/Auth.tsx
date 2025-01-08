import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import "./Auth.scss";
import { SocketContext } from "../../context/socket";
import { useContext } from "react";
import { toast } from "react-toastify";
import { ProfileSuccessResponse } from "@greatsumini/react-facebook-login/dist/types/response.type";
import { useSessionStorage } from "../../hooks/hooks";

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
