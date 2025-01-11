import { useEffect, useRef, useState } from "react";
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
    getUnreadMessagesFromSession,
    saveUnreadMessagesToSession
  } = useSessionStorage();
  const [activeTopic, setActiveTopic] = useState({});

  const [topicsList, setTopicsList] = useState<Topic[]>(getChatFromSession() || []);

  const [unreadMessages, setUnreadMessages] = useState<string[]>(getUnreadMessagesFromSession() || []);
  const isInitialLoad = useRef(true);

  const onActiveTopic = (topic: Topic) => {
    setActiveTopic(topic);

    setUnreadMessages((prevUnread) => prevUnread.filter((id) => id !== topic._id));
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

      setActiveTopic((prevState) => {
        if ("_id" in prevState && prevState._id === response.topic._id) {
          return response.topic;
        }

        setUnreadMessages((prevUnread) => [...prevUnread, response.topic._id]);

        return prevState;
      });

      setTopicsList(sortedTopics);
      saveChatToSession(sortedTopics);
    }
  };

  const handleSocketError = (response: { message: string }) => {
    toast.error(`Error: ${response.message}`);
  };

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    const userId = user._id;
    socket.emit("updateUnread", {userId, unreadMessages});
    saveUnreadMessagesToSession(unreadMessages);
  }, [unreadMessages]);

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
        activeTopic={activeTopic as Topic}
        unreadMessages={unreadMessages}/>
      <Messenger topic={activeTopic as Topic}/>
    </div>
  );
};
