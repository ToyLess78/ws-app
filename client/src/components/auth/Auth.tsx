import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import "./Auth.scss";
import { SocketContext } from "../../context/socket";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";

const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;

export const Auth: React.FC = () => {
  const socket = useContext(SocketContext);

  const handleGoogleAuth = (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;

    console.log("Google token:", token, "Google credentialResponse:", credentialResponse)

    if (!token) {
      toast.error("Google Login Failed: Token is missing");
      return;
    }

  };

  socket.on("error", (response) => {
    toast.error(`Error: ${response.message}`);
  });

  const handleGoogleError = () => {
    toast.error("Login Failed");
  };

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
        onProfileSuccess={(response) => {
          console.log("Facebook response:", response);
        }}
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
