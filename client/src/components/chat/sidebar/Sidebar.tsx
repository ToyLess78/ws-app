import React from "react";
import { SocketContext } from "../../../context/socket";
import { useSidebarHandler } from "../../../hooks/hooks";
import { Topic, User } from "../../../interfaces/interfaces";
import "./Sidebar.scss";
import { SidebarActions } from "./SidebarActions";
import { Topics } from "./topics/Topics";

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
    unreadMessages,
  }) => {
  const socket = React.useContext(SocketContext);

  const {
    searchValue,
    chatLength,
    filteredTopics,
    handleSearchChange,
    handleAddTopic,
    handleKeyDown,
  } = useSidebarHandler({
    socket,
    user,
    chat,
    activeTopic,
    setActiveTopic,
  });

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
          {chatLength ? (
            <i className="sidebar__search-icon icon-search"/>
          ) : (
            <button className="sidebar__add-button icon-add" onClick={handleAddTopic}/>
          )}
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
