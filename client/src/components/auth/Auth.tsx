import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useFacebookAuth, useGoogleAuth } from "../../hooks";
import FacebookLogin from "@greatsumini/react-facebook-login";
import "./Auth.scss";
import { SocketContext } from "../../context/socket";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";

const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;

export const Auth: React.FC = () => {
  const socket = useContext(SocketContext);

  const {saveGoogleUserToSession, googleUser} = useGoogleAuth();
  const {saveFacebookUserToSession, facebookUser} = useFacebookAuth();

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;

    if (!token) {
      toast.error("Google Login Failed: Token is missing");
      return;
    }

    saveGoogleUserToSession(token);
  };

  useEffect(() => {
    const userData = facebookUser || googleUser;
    if (userData) {
      socket.emit("addUser", userData);
    }
  }, [googleUser, facebookUser]);

  socket.on("userAdded", (response) => {
    if (!response.success) {
      toast.error(`Failed to add user: ${response.message}`);
    }
  });

  socket.on("error", (response) => {
    toast.error(`Error: ${response.message}`);
  });

  const handleError = () => {
    toast.error("Login Failed");
  };

  return (
    <div>
      <p className="auth__title">Login to continue</p>

      <GoogleLogin
        locale="en"
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
      />

      <FacebookLogin
        appId={facebookAppId}
        scope={"public_profile"}
        onFail={handleError}
        onProfileSuccess={(response) => {
          saveFacebookUserToSession(response);
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
