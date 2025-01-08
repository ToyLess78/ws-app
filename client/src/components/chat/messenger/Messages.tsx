import dayjs from "dayjs";
import { Message } from "../../../interfaces/interfaces";

interface MessagesProps {
  messages: Message[];
  photo?: string;
}

const formattedDate = (date: Date | string): string =>
  dayjs(date).format("M/D/YYYY h:mm A");

export const Messages: React.FC<MessagesProps> = ({messages, photo}) => {
  // if (!messages.length) {
  //   return <p className="messenger__empty">No messages to display</p>;
  // }

  return (
    <div className="messenger__messages">
      {messages.length ? messages.map((message) => (
          <article
            key={message.messageId}
            className={`messenger__message ${message.role}`}
          >
            <div className="messenger__row">
              {message.role === "bot" && photo && (
                <img
                  className="messenger__photo"
                  src={photo}
                  alt="user photo"
                />
              )}
              <div className="messenger__text-row">
                <p
                  className={`messenger__message-text ${
                    message.text.length > 10 ? "align-left" : ""
                  }`}
                >
                  {message.text}
                </p>
                {message.timestamp && (
                  <span className="messenger__message-date">
                  {formattedDate(message.timestamp)}
                </span>
                )}
              </div>
            </div>
          </article>
        ))
        : <h4 className="messenger__empty">No messages to display</h4>}
    </div>
  );
};
