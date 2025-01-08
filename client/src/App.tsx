import "./App.css";
import { Auth, Chat } from "./components/components";
import { toast, ToastContainer } from "react-toastify";
import { socket, SocketContext } from "./context/socket";
import { useEffect } from "react";
import { useSessionStorage } from "./hooks/hooks.ts";

const App: React.FC = () => {
  const {
    getUserFromSession,
    getChatFromSession
  } = useSessionStorage();

  useEffect(() => {
    const handleSocketError = (response: { message: string }) => {
      toast.error(`Error: ${response.message}`);
    };
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
