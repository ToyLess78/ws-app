import { useCallback } from "react";
import { toast } from "react-toastify";
import { Topic, User } from "../interfaces/interfaces";

export const useSessionStorage = () => {

  const saveUnreadMessagesToSession = useCallback((messages: string[]) => {
    try {
      sessionStorage.setItem("unreadMessages", JSON.stringify(messages));
    } catch (error) {
      toast.error(`Failed to save unread messages: ${error}`);
    }
  }, []);

  const saveUserToSession = useCallback((user: User) => {
    try {
      const {unreadMessages: userUnreadMessages = [], ...userWithoutUnread} = user;
      sessionStorage.setItem("user", JSON.stringify(userWithoutUnread));

      saveUnreadMessagesToSession(userUnreadMessages);
    } catch (error) {
      toast.error(`Failed to save user: ${error}`);
    }
  }, [saveUnreadMessagesToSession]);

  const saveChatToSession = useCallback((chat: Topic[]) => {
    try {
      sessionStorage.setItem("chat", JSON.stringify(chat));
    } catch (error) {
      toast.error(`Failed to save chat: ${error}`);
    }
  }, []);

  const getUserFromSession = useCallback((): User | null => {
    try {
      const storedUser = sessionStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      toast.error(`Failed to get user: ${error}`);
      return null;
    }
  }, []);

  const getUnreadMessagesFromSession = useCallback((): string[] => {
    try {
      const storedUnreadMessages = sessionStorage.getItem("unreadMessages");
      return storedUnreadMessages ? JSON.parse(storedUnreadMessages) : [];
    } catch (error) {
      toast.error(`Failed to get unread messages: ${error}`);
      return [];
    }
  }, []);

  const getChatFromSession = useCallback((): Topic[] => {
    try {
      const storedChat = sessionStorage.getItem("chat");
      return storedChat ? JSON.parse(storedChat) : [];
    } catch (error) {
      toast.error(`Failed to get chat: ${error}`);
      return [];
    }
  }, []);

  const clearSession = useCallback(() => {
    try {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("chat");
      sessionStorage.removeItem("unreadMessages");
    } catch (error) {
      toast.error(`Failed to clear session: ${error}`);
    }
  }, []);

  return {
    saveUserToSession,
    saveChatToSession,
    saveUnreadMessagesToSession,
    getUserFromSession,
    getChatFromSession,
    getUnreadMessagesFromSession,
    clearSession,
  };
};
