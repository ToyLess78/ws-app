import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";
import { Topic, User } from "../interfaces/interfaces";
import { validateTopicName } from "../utils/validateTopicName";

interface UseSidebarHandlerProps {
  socket: Socket;
  user?: User;
  chat: Topic[];
  activeTopic: Topic;
  setActiveTopic: (topic: Topic) => void;
}

export const useSidebarHandler = (
  {
    socket,
    user,
    chat,
    activeTopic,
  }: UseSidebarHandlerProps) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [chatLength, setChatLength] = useState<number>(chat.length);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  }, []);

  const handleAddTopic = useCallback((): void => {
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
  }, [searchValue, socket, user?._id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === "Enter" && !chatLength) {
        handleAddTopic();
      }
    },
    [chatLength, handleAddTopic]
  );

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
  }, [filteredTopics, activeTopic]);

  return {
    searchValue,
    chatLength,
    filteredTopics,
    handleSearchChange,
    handleAddTopic,
    handleKeyDown,
  };
};
