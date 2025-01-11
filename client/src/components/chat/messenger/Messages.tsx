import dayjs from "dayjs";
import React, { useContext, useEffect, useRef } from "react";
import { SocketContext } from "../../../context/socket";
import { useMessagesHandler } from "../../../hooks/hooks";
import { Topic } from '../../../interfaces/interfaces';
import { TopicActions } from "./TopicActions";

interface MessagesProps {
  topic?: Topic;
}

const formattedDate = (date: Date | string): string =>
  dayjs(date).format("M/D/YYYY h:mm A");

export const Messages: React.FC<MessagesProps> = ({topic}) => {
  const socket = useContext(SocketContext);
  const {
    isEditing,
    editMessage,
    textareaStyles,
    handleKeyDown,
    getRefForMessage,
    handleEditMessageChange,
    handlerMessageEdit,
    handleSaveMessage,
    handlerMessageDelete,
  } = useMessagesHandler({topicId: topic?._id, socket});
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [topic?.messages]);

  return (
    <div className="messenger__messages" ref={scrollRef}>
      {topic?.messages.length ? (
        topic?.messages.map((message) => (
          <article
            key={message.messageId}
            className={`messenger__message ${message.role}`}
          >
            <div className="messenger__row">
              {message.role === "bot" && topic?.photo && (
                <img
                  className="messenger__photo"
                  src={topic?.photo}
                  alt="user photo"
                />
              )}
              <div className="messenger__text-row">
                {isEditing !== message.messageId ? (
                  <p
                    ref={getRefForMessage(message.messageId)}
                    className={`messenger__message-text ${
                      message.text.length > 10 ? "align-left" : ""
                    }`}
                  >
                    {message.text}
                  </p>
                ) : (
                  <textarea
                    className="messenger__message-textarea align-left"
                    style={textareaStyles}
                    value={editMessage || message.text}
                    onChange={handleEditMessageChange}
                    onKeyDown={(event) => handleKeyDown(event, message.messageId)}
                  />
                )}
                {message.role === "user" && (
                  <TopicActions
                    isEditing={isEditing === message.messageId}
                    handleSave={() => handleSaveMessage(message.messageId)}
                    handleEdit={() => handlerMessageEdit(message.messageId)}
                    handleDelete={() => handlerMessageDelete(message.messageId)}
                  />
                )}
                {message.timestamp && (
                  <span className="messenger__message-date">
                    {formattedDate(message.timestamp)}
                  </span>
                )}
              </div>
            </div>
          </article>
        ))
      ) : (
        <h4 className="messenger__empty">No messages to display</h4>
      )}
    </div>
  );
};

