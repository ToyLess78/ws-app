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

  const saveActiveTopicToSession = useCallback((activeTopic: Topic | {}) => {
    try {
      sessionStorage.setItem("activeTopic", JSON.stringify(activeTopic));
    } catch (error) {
      toast.error(`Failed to save active topic: ${error}`);
    }
  }, []);

  const getActiveTopicFromSession = useCallback((): Topic | {} => {
    try {
      const storedActiveTopic = sessionStorage.getItem("activeTopic");
      return storedActiveTopic ? JSON.parse(storedActiveTopic) : {};
    } catch (error) {
      toast.error(`Failed to get active topic: ${error}`);
      return {};
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
      sessionStorage.removeItem("activeTopic");
    } catch (error) {
      toast.error(`Failed to clear session: ${error}`);
    }
  }, []);

  return {
    saveUserToSession,
    saveChatToSession,
    saveUnreadMessagesToSession,
    saveActiveTopicToSession,
    getUserFromSession,
    getChatFromSession,
    getUnreadMessagesFromSession,
    getActiveTopicFromSession,
    clearSession,
  };
};
