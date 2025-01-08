import { ChangeEvent, KeyboardEvent, useContext, useState } from "react";
import "./Messenger.scss";
import { Messages } from "./Messages";
import { Topic } from "../../../interfaces/interfaces";
import { confirmAlert } from "react-confirm-alert";
import { SocketContext } from "../../../context/socket.ts";
import { toast } from "react-toastify";

interface MessengerProps {
  topic?: Topic;
  sendMessage: (topic: Topic, message: string) => void;
}

export const Messenger: React.FC<MessengerProps> = ({topic, sendMessage}) => {
  const [messageValue, setMessageValue] = useState<string>("");
  const socket = useContext(SocketContext);

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

  const HandlerTopicDelete = () => {
    confirmAlert({
      message: "Do you want to Delete?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            if (!topic?._id) {
              toast.error("Invalid topic ID");
              return;
            }
            socket.emit("deleteTopic", {topicId: topic._id});
          },
        },
        {
          label: "No",
          onClick: () => {
            return;
          },
        },
      ],
    });
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
        <input type="text" className="messenger__user-name" value={topic.name} disabled/>
        <div className="messenger__action">
          <button
            className="action-button icon-edit"/>
          <button
            className="action-button icon-del"
            onClick={HandlerTopicDelete}/>
        </div>

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
