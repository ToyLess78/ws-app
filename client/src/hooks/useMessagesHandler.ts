import React, { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";

interface UseMessagesHandlerProps {
  topicId?: string;
  socket: Socket;
}

export const useMessagesHandler = ({topicId, socket}: UseMessagesHandlerProps) => {
  const [textareaStyles, setTextareaStyles] = useState<React.CSSProperties>({width: "0px", height: "0px"});
  const [isEditing, setIsEditing] = useState<string>("");
  const [editMessage, setEditMessage] = useState<string>("");
  const messageRefs = useRef<Record<string, React.RefObject<HTMLParagraphElement>>>({});

  const getRefForMessage = (messageId: string): React.RefObject<HTMLParagraphElement> => {
    if (!messageRefs.current[messageId]) {
      messageRefs.current[messageId] = React.createRef<HTMLParagraphElement>();
    }
    return messageRefs.current[messageId];
  };

  const handleEditMessageChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setEditMessage(e.target.value);
  };

  const handlerMessageEdit = (messageId: string) => {
    const element = messageRefs.current[messageId]?.current;

    if (!element) return;

    setIsEditing(messageId);
    const {width, height} = element.getBoundingClientRect();
    setTextareaStyles({
      width: `${width}px`,
      height: `${height}px`,
    });
  };

  const handleSaveMessage = (messageId: string) => {
    if (editMessage) {
      socket.emit("editMessage", {topicId, messageId, newText: editMessage});
    }
    setIsEditing("");
    setTextareaStyles({width: "0px", height: "0px"});
    setEditMessage("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, messageId: string): void => {
    if (e.key === "Enter") {
      handleSaveMessage(messageId);
    }
  };

  const handlerMessageDelete = (messageId: string) => {
    confirmAlert({
      message: "Do you want to Delete?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            if (!topicId || !messageId) {
              toast.error("Invalid topic ID or message ID");
              return;
            }
            socket.emit("deleteMessage", {topicId, messageId});
          },
        },
        {
          label: "No", onClick: () => {
          }
        },
      ],
    });
  };

  return {
    textareaStyles,
    isEditing,
    editMessage,
    handleKeyDown,
    getRefForMessage,
    handleEditMessageChange,
    handlerMessageEdit,
    handleSaveMessage,
    handlerMessageDelete,
  };
};
