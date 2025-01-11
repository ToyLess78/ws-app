import React from "react";
import { useMessengerHandler } from "../../../hooks/hooks";
import { Topic } from "../../../interfaces/interfaces";
import { Messages } from "./Messages";
import "./Messenger.scss";
import { TopicActions } from "./TopicActions";

interface MessengerProps {
  topic?: Topic;
}

export const Messenger: React.FC<MessengerProps> = ({topic}) => {
  const {
    messageValue,
    isEditing,
    editedName,
    handleSendMessage,
    handleKeyDown,
    handleChange,
    handleTopicDelete,
    handleEditNameChange,
    handleEditToggle,
    handleSaveName,
  } = useMessengerHandler({topic});

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
        <input
          type="text"
          className="messenger__user-name"
          value={editedName}
          onChange={handleEditNameChange}
          onKeyDown={handleKeyDown}
          disabled={!isEditing}
        />
        <TopicActions
          isEditing={isEditing}
          handleSave={handleSaveName}
          handleEdit={handleEditToggle}
          handleDelete={handleTopicDelete}
        />
      </header>

      <Messages topic={topic}/>

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
      <h3 className="choose__chat">Choose or start a new chat</h3>
    </div>
  );
};
