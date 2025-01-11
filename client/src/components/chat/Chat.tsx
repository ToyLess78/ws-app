import { useEffect, useRef } from "react";
import { socket } from "../../context/socket";
import { useChatHandler } from "../../hooks/hooks";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import { Topic, User } from "../../interfaces/interfaces";
import "./Chat.scss";
import { Messenger } from "./messenger/Messenger";
import { Sidebar } from "./sidebar/Sidebar";

interface ChatProps {
  user: User;
}

export const Chat: React.FC<ChatProps> = ({user}) => {
  const {
    activeTopic,
    topicsList,
    unreadMessages,
    onActiveTopic,
    handleTopicCreated,
    handleTopicDeleted,
    handleTopicUpdated,
  } = useChatHandler();
  const {
    saveChatToSession,
    saveUnreadMessagesToSession,
  } = useSessionStorage();

  const isInitialLoad = useRef(true);

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
    socket.on("topicCreated", handleTopicCreated);
    socket.on("topicDeleted", handleTopicDeleted);
    socket.on("topicUpdated", handleTopicUpdated);

    return () => {
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
