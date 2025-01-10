import { useEffect, useState } from "react";
import "./Chat.scss";
import { Sidebar } from "./sidebar/Sidebar";
import { Messenger } from "./messenger/Messenger";
import { Topic, User } from "../../interfaces/interfaces";
import { useSessionStorage } from "../../hooks/useSessionStorage.ts";
import { toast } from "react-toastify";
import { socket } from "../../context/socket.ts";

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

  const sortTopicsByUpdatedAt = (topics: Topic[]): Topic[] => {
    return [...topics].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  };

  const handleTopicDeleted = (response: { success: boolean; topicId: string }) => {
    if (response.success) {
      const updatedTopics = topicsList.filter((topic) => topic._id !== response.topicId);
      setTopicsList(updatedTopics);
      setActiveTopic({});
      saveChatToSession(updatedTopics);
    }
  };

  const handleTopicCreated = (response: { success: boolean; topic: Topic }) => {
    if (response.success) {
      const newTopicsList = [response.topic, ...topicsList];
      setTopicsList(newTopicsList);
      setActiveTopic(response.topic);
      saveChatToSession(newTopicsList);
    }
  };
  const handleTopicUpdated = (response: { success: boolean; topic: Topic }) => {
    if (response.success) {
      const updatedTopics = topicsList.map((topic) =>
        topic._id === response.topic._id ? response.topic : topic
      );

      const sortedTopics = sortTopicsByUpdatedAt(updatedTopics);
      let shouldShowToast = false;

      setActiveTopic((prevState) => {
        if ("_id" in prevState && prevState._id === response.topic._id) {
          return response.topic;
        }
        shouldShowToast = true;
        return prevState;
      });

      setTopicsList(sortedTopics);
      saveChatToSession(sortedTopics);

      if (shouldShowToast) {
        setTimeout(() => {
          toast.info(`New message in "${response.topic.name}"`);
        }, 0);
      }
    }
  };

  const handleSocketError = (response: { message: string }) => {
    toast.error(`Error: ${response.message}`);
  };

  useEffect(() => {
    socket.on("error", handleSocketError);
    socket.on("topicCreated", handleTopicCreated);
    socket.on("topicDeleted", handleTopicDeleted);
    socket.on("topicUpdated", handleTopicUpdated);

    return () => {
      socket.off("error", handleSocketError);
      socket.off("topicCreated", handleTopicCreated);
      socket.off("topicDeleted", handleTopicDeleted);
      socket.off("topicUpdated", handleTopicUpdated);
    };

  }, [topicsList, saveChatToSession]);

  return (
    <div className="chat">
      <Sidebar
        user={user}
        chat={topicsList}
        setActiveTopic={onActiveTopic}
        activeTopic={activeTopic as Topic}/>
      <Messenger topic={activeTopic as Topic}/>
    </div>
  );
};
