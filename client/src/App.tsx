import "./App.css";
import { Auth } from "./components/components";
import { toast, ToastContainer } from "react-toastify";
import { socket, SocketContext } from "./context/socket";

const App: React.FC = () => {

    socket.on("error", (response) => {
        toast.error(`Error: ${response.message}`);
    });

    return (
        <SocketContext.Provider value={socket}>
            <Auth/>
            <ToastContainer/>
        </SocketContext.Provider>
    );
};

export default App;
