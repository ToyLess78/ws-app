import "./App.css";
import { Auth, Chat } from "./components/components";
import { toast, ToastContainer } from "react-toastify";
import { socket, SocketContext } from "./context/socket";
import { useEffect, useState } from "react";
import { useSessionStorage } from "./hooks/hooks.ts";
import { Topic, User } from "./interfaces/interfaces.ts";
import axios from "axios";

const App: React.FC = () => {
  const {
    saveChatToSession,
    getChatFromSession,
    getUserFromSession
  } = useSessionStorage();

  const [user, setUser] = useState<null | User>(null);
  const [topicsList, setTopicsList] = useState<Topic[]>(getChatFromSession() || []);

  useEffect(() => {
    setUser(getUserFromSession());
  }, [topicsList]);

  useEffect(() => {
    const handleSocketError = (response: { message: string }) => {
      toast.error(`Error: ${response.message}`);
    };
    socket.on("error", handleSocketError);

    return () => {
      socket.off("error", handleSocketError);
    };
  }, []);

  const sortTopics = (item: Topic): void => {
    const updatedTopics = topicsList.filter((topic) => topic._id !== item._id);
    setTopicsList([item, ...updatedTopics]);
  };
  const getApi = async (item: Topic) => {
    try {
      let request = await axios.get("https://api.chucknorris.io/jokes/random");

      let newAnswer = {
        text: request.data.value,
        role: "bot",
        timestamp: new Date(),
        messageId: new Date().getTime().toString(),
      };

      const newTopicsList = topicsList.map(topic => {
        if (topic._id === item._id) {
          topic.messages = [...topic.messages, newAnswer];
          return topic;
        }
        return topic;
      });
      saveChatToSession(newTopicsList);
      const savedTopics = getChatFromSession();

      setTopicsList(savedTopics);
      sortTopics(item);

    } catch (error) {
      console.log("Something went wrong", error);
      alert("Something went wrong !");
    }
  };

  const sendMessage = (item: Topic, message: string): void => {
    const newMessage = {
      text: message,
      role: "user",
      timestamp: new Date().toISOString(),
      messageId: new Date().getTime().toString(),
    };

    const newTopicsList = topicsList.map((topic) => {
      if (topic._id === item._id) {
        return {
          ...topic,
          messages: [...topic.messages, newMessage],
        };
      }
      return topic;
    });

    saveChatToSession(newTopicsList);
    setTopicsList(newTopicsList);
    getApi(item);
  };
  return (
    <SocketContext.Provider value={socket}>
      <>
        <ToastContainer/>
        {user && topicsList ? (
          <Chat user={user} chat={topicsList} sendMessage={sendMessage}/>
        ) : (
          <Auth/>
        )}
      </>
    </SocketContext.Provider>
  );
};

export default App;
