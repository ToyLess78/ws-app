import { useState } from "react";
import "./Chat.scss";
import { Sidebar } from "./sidebar/Sidebar";
import { Messenger } from "./messenger/Messenger";
import { Topic, User } from "../../interfaces/interfaces";

interface ChatProps {
  user: User;
  chat: Topic[];
  sendMessage: (topic: Topic, message: string) => void;
}

export const Chat: React.FC<ChatProps> = ({user, chat, sendMessage,}) => {
  const [activeTopic, setActiveTopic] = useState({});

  const onActiveTopic = (topic: Topic) => {
    setActiveTopic(topic);
  };

  return (
    <div className="chat">
      <Sidebar user={user} chat={chat} setActiveTopic={onActiveTopic} activeTopic={activeTopic as Topic}/>
      <Messenger topic={activeTopic as Topic} sendMessage={sendMessage}/>
    </div>
  );
};
