import { useCallback, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "./App.css";
import { Auth, Chat } from "./components/components";
import { socket, SocketContext } from "./context/socket";
import { useSessionStorage } from "./hooks/hooks";

const App: React.FC = () => {
  const {
    getUserFromSession,
    getChatFromSession
  } = useSessionStorage();

  const handleSocketError = useCallback((response: { message: string }) => {
    toast.error(`Error: ${response.message}`);
  }, []);

  useEffect(() => {
    socket.on("error", handleSocketError);
    return () => {
      socket.off("error", handleSocketError);
    };
  }, []);

  const user = getUserFromSession();
  const chat = getChatFromSession();

  return (
    <SocketContext.Provider value={socket}>
      <>
        <ToastContainer/>
        {user && chat ? (
          <Chat user={user}/>
        ) : (
          <Auth/>
        )}
      </>
    </SocketContext.Provider>
  );
};

export default App;
