import "./App.css";
import { Auth } from "./components";
import { toast } from "react-toastify";
import { socket } from "./context/socket";

const App: React.FC = () => {

  socket.on("error", (response) => {
    toast.error(`Error: ${response.message}`);
  });

  return (
    <Auth/>
  );
};

export default App;
