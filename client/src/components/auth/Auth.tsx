import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import "./Auth.scss";
import { SocketContext } from "../../context/socket";
import { useContext } from "react";
import { toast } from "react-toastify";
import { ProfileSuccessResponse } from "@greatsumini/react-facebook-login/dist/types/response.type";
import { useSessionStorage } from "../../hooks";

const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;

export const Auth: React.FC = () => {
  const socket = useContext(SocketContext);

  const {saveUserToSession, saveChatToSession} = useSessionStorage();

  const handleGoogleAuth = (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;

    console.log("Google token:", token, "Google credentialResponse:", credentialResponse);

    if (!token) {
      toast.error("Google Login Failed: Token is missing");
      return;
    }

  };

  const handleFacebookAuth = (response: ProfileSuccessResponse) => {
    socket.emit("authenticateFacebook", response);
  };

  const handleGoogleError = () => {
    toast.error("Login Failed");
  };

  socket.on("authenticationSuccess", (response) => {
    saveUserToSession(response.user);
    saveChatToSession(response.chat);
    console.log("response:", response);
  });

  return (
    <div>
      <p className="auth__title">Login to continue</p>

      <GoogleLogin
        locale="en"
        onSuccess={handleGoogleAuth}
        onError={handleGoogleError}
        useOneTap
      />

      <FacebookLogin
        appId={facebookAppId}
        scope={"public_profile"}
        onFail={handleGoogleError}
        onProfileSuccess={handleFacebookAuth}
        style={{
          backgroundColor: "#4267b2",
          color: "#fff",
          fontSize: "16px",
          padding: "12px 24px",
          marginTop: "14px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      />
    </div>
  );
};
