import { useEffect, useState } from "react";
import "./Chat.scss";
import { Sidebar } from "./sidebar/Sidebar";
import { Messenger } from "./messenger/Messenger";
import { Topic, User } from "../../interfaces/interfaces";
import { useSessionStorage } from "../../hooks/useSessionStorage.ts";
import { toast } from "react-toastify";
import { socket } from "../../context/socket.ts";
import axios from "axios";

interface ChatProps {
  user: User;
}

export const Chat: React.FC<ChatProps> = ({user}) => {
  const {
    saveChatToSession,
    getChatFromSession,
  } = useSessionStorage();
  const [activeTopic, setActiveTopic] = useState({});

  const [topicsList, setTopicsList] = useState<Topic[]>(getChatFromSession() || []);

  const onActiveTopic = (topic: Topic) => {
    setActiveTopic(topic);
  };

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
  useEffect(() => {
    const handleTopicCreated = (response: { success: boolean; topic: Topic }) => {
      if (response.success) {
        const newTopicsList = [response.topic, ...topicsList];
        setTopicsList(newTopicsList);

        saveChatToSession(newTopicsList);

        toast.success(`New topic "${response.topic.name}" created successfully!`);
      }
    };

    socket.on("topicCreated", handleTopicCreated);

    return () => {
      socket.off("topicCreated", handleTopicCreated);
    };
  }, [topicsList, saveChatToSession]);

  return (
    <div className="chat">
      <Sidebar user={user} chat={topicsList} setActiveTopic={onActiveTopic} activeTopic={activeTopic as Topic}/>
      <Messenger topic={activeTopic as Topic} sendMessage={sendMessage}/>
    </div>
  );
};
