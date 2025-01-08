import { ChangeEvent, useEffect, useState } from "react";
import "./Sidebar.scss";
import { Logout } from "../../auth/Logout";
import { Topics } from "./topics/Topics.tsx";
import { Topic, User } from "../../../interfaces/interfaces";

interface SidebarProps {
  user?: User;
  setActiveTopic: (topic: Topic) => void;
  chat: Topic[];
  activeTopic: Topic;
}

export const Sidebar: React.FC<SidebarProps> = (
  {
    user,
    setActiveTopic,
    chat,
    activeTopic,
  }) => {
  const [searchValue, setSearchValue] = useState<string>("");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
    console.log("activeTopic", activeTopic);
  };

  const handleAddTopic = () => {
    console.log("searchValue", searchValue, user?.userId);
    setSearchValue("");
  };

  const filteredTopics = chat.filter(({name}) =>
    name.toLowerCase().startsWith(searchValue.toLowerCase())
  );

  const [chatLength, setChatLength] = useState(chat.length);

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
        <Logout/>
      </header>

      <section className="sidebar__search">
        <div className="sidebar__search-input-row">
          <input
            type="text"
            className="sidebar__search-input"
            placeholder="Search or start new chat ..."
            value={searchValue}
            onChange={handleSearchChange}
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
              searchValue={searchValue}
              chat={filteredTopics}
              setActiveTopic={setActiveTopic}
              activeTopic={activeTopic}
            />
          ) : (
            <h5 className="sidebar__no-results">No chats found</h5>
          )}

        </div>
      </section>
    </aside>
  );
};
