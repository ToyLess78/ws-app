import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { Chat, User } from "../interfaces/interfaces";

export const useSessionStorage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);

  const saveUserToSession = useCallback((user: User) => {
    try {
      sessionStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (error) {
      toast.error(`Failed to save user: ${error}`);
    }
  }, []);

  const saveChatToSession = useCallback((chat: Chat) => {
    try {
      sessionStorage.setItem("chat", JSON.stringify(chat));
      setChat(chat);
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

  const getChatFromSession = useCallback((): Chat | null => {
    try {
      const storedChat = sessionStorage.getItem("chat");
      return storedChat ? JSON.parse(storedChat) : null;
    } catch (error) {
      toast.error(`Failed to get chat: ${error}`);
      return null;
    }
  }, []);

  const clearSession = useCallback(() => {
    try {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("chat");
      setUser(null);
      setChat(null);
    } catch (error) {
      toast.error(`Failed to clear session: ${error}`);
    }
  }, []);

  return {
    saveUserToSession,
    saveChatToSession,
    getUserFromSession,
    getChatFromSession,
    clearSession,
    user,
    chat,
  };
};
