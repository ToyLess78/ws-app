import "./Topics.scss";
import dayjs from "dayjs";
import { Topic } from "../../../../interfaces/interfaces";

const formattedDate = (date: Date | string) => dayjs(date).format("MMM DD, YYYY");

interface ChatsProps {
  chat: Topic[];
  setActiveTopic: (topic: Topic) => void;
  activeTopic: Topic;
}

export const Topics: React.FC<ChatsProps> = ({chat, setActiveTopic, activeTopic}) => {

  return (
    <>
      {chat.length > 0 && chat.map((topic) => (
        <div onClick={() => setActiveTopic(topic)}
             className={`sidebar__chats-item ${activeTopic._id === topic._id ? "active" : ""}`} key={topic?._id}>
          <div className="sidebar__chats-item-infoRow">
            <img src={topic?.photo} alt="userPhoto" className="sidebar__chats-item-photo"/>

            <div className="sidebar__chats-item-block">
              <span className="sidebar__chats-item-date">
  {formattedDate(topic?.messages?.at(-1)?.timestamp || new Date())}
</span>
              <h4 className="sidebar__chats-item-name">{topic?.name}</h4>
              <p
                className="sidebar__chats-item-message">{topic?.messages?.length ? topic?.messages[topic?.messages?.length - 1].text : ""}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
