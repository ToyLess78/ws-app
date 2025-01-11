import { ChangeEvent, KeyboardEvent, useContext, useEffect, useState } from "react";

import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { SocketContext } from "../context/socket";
import { Topic } from "../interfaces/interfaces";
import { validateTopicName } from "../utils/validateTopicName";

interface UseMessengerProps {
  topic?: Topic;
}

export const useMessengerHandler = ({topic}: UseMessengerProps) => {
  const socket = useContext(SocketContext);

  const [messageValue, setMessageValue] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(topic?.name || "");

  useEffect(() => {
    if (topic?.name && !isEditing) {
      setEditedName(topic.name);
    }
  }, [topic?.name, isEditing]);

  const handleSendMessage = (): void => {
    if (messageValue.trim() && topic?._id) {
      const newMessage = {
        text: messageValue.trim(),
        role: "user",
      };

      socket.emit("sendMessage", {topicId: topic._id, message: newMessage});
      setMessageValue("");
    } else {
      toast.error("Cannot send empty message or invalid topic.");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      isEditing ? handleSaveName() : handleSendMessage();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setMessageValue(e.target.value);
  };

  const handleTopicDelete = (): void => {
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

  const handleEditNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEditedName(e.target.value);
  };

  const handleEditToggle = (): void => {
    setIsEditing(true);
  };

  const handleSaveName = (): void => {
    const validationError = validateTopicName(editedName);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (topic?._id) {
      socket.emit("updateTopicName", {topicId: topic._id, name: editedName});
    }

    setIsEditing(false);
  };

  return {
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
  };
};
