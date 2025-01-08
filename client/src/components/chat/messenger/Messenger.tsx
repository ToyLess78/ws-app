import { ChangeEvent, KeyboardEvent, useState } from "react";
import "./Messenger.scss";
import { Messages } from "./Messages";
import { Topic } from "../../../interfaces/interfaces";

interface MessengerProps {
  topic?: Topic;
  sendMessage: (topic: Topic, message: string) => void;
}

export const Messenger: React.FC<MessengerProps> = ({topic, sendMessage}) => {
  const [messageValue, setMessageValue] = useState<string>("");

  const handleSendMessage = (): void => {
    if (messageValue.trim()) {
      sendMessage(topic as Topic, messageValue);
      setMessageValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setMessageValue(e.target.value);
  };

  return topic?.name ? (
    <div className="messenger">
      <header className="messenger__user">
        {topic.photo && (
          <img
            className="messenger__user-photo"
            src={topic.photo}
            alt={`${topic.name}'s photo`}
          />
        )}
        <p className="messenger__user-name">{topic.name}</p>
      </header>

      <Messages photo={topic.photo} messages={topic.messages}/>

      <footer className="messenger__input">
        <div className="messenger__input-row">
          <input
            type="text"
            className="messenger__textfield"
            placeholder="Type your message"
            value={messageValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="messenger__input-button icon-send"
            onClick={handleSendMessage}
            aria-label="Send message"
          />
        </div>
      </footer>
    </div>
  ) : (
    <div className="choose">
      <h3 className="choose__chat">Choose or star new chat</h3>
    </div>
  );
};
