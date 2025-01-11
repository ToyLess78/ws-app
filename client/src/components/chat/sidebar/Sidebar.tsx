import { ChangeEvent, KeyboardEvent, useContext, useEffect, useState } from "react";
import "./Sidebar.scss";
import { SidebarActions } from "./SidebarActions.tsx";
import { Topics } from "./topics/Topics.tsx";
import { Topic, User } from "../../../interfaces/interfaces";
import { SocketContext } from "../../../context/socket.ts";
import { toast } from "react-toastify";
import { validateTopicName } from "../../../utils/validateTopicName.ts";

interface SidebarProps {
  user?: User;
  setActiveTopic: (topic: Topic) => void;
  chat: Topic[];
  activeTopic: Topic;
  unreadMessages: string[];

}

export const Sidebar: React.FC<SidebarProps> = (
  {
    user,
    setActiveTopic,
    chat,
    activeTopic,
    unreadMessages
  }) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [chatLength, setChatLength] = useState(chat.length);
  const socket = useContext(SocketContext);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  };

  const handleAddTopic = () => {
    const validationError = validateTopicName(searchValue);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    const trimmedValue = searchValue.trim();

    socket.emit("createTopic", {
      userId: user?._id,
      name: trimmedValue,
    });

    setSearchValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !chatLength) {
      handleAddTopic();
    }
  };

  const filteredTopics = chat.filter(({name}) =>
    name.toLowerCase().startsWith(searchValue.toLowerCase())
  );

  useEffect(() => {
    setChatLength(filteredTopics.length);
  }, [filteredTopics.length]);

  useEffect(() => {

    if (filteredTopics.length && filteredTopics[0]._id === activeTopic?._id) {
      setSearchValue("");
    }

  }, [activeTopic]);

  return (
    <aside className="sidebar">
      <header className="sidebar__user">
        <img
          src={user?.picture || "./avatars/u-0.webp"}
          alt={`${user?.name || "Default"}'s photo`}
          className="sidebar__user-img"
        />
        <p className="sidebar__user-name">{user?.name || "User not found"}</p>
        <SidebarActions user={user}/>
      </header>

      <section className="sidebar__search">
        <div className="sidebar__search-input-row">
          <input
            type="text"
            className="sidebar__search-input"
            placeholder="Search or start new chat ..."
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            aria-label="Search for chats"
          />

          {chatLength ? <i className="sidebar__search-icon icon-search"/>
            : <button
              className="sidebar__add-button icon-add"
              onClick={handleAddTopic}/>}

        </div>
      </section>

      <section className="sidebar__chats">
        <h2 className="sidebar__chats-title">Chats</h2>
        <div className="sidebar__chats-row">

          {chatLength ? (
            <Topics
              chat={filteredTopics}
              setActiveTopic={setActiveTopic}
              activeTopic={activeTopic}
              unreadMessages={unreadMessages}
            />
          ) : (
            <h5 className="sidebar__no-results">No chats found</h5>
          )}
        </div>
      </section>
    </aside>
  );
};
