import { useCallback, useState } from "react";
import { Topic } from "../interfaces/interfaces";
import { useSessionStorage } from "./useSessionStorage";

export const useChatHandler = () => {
  const {
    saveChatToSession,
    getChatFromSession,
    getUnreadMessagesFromSession,
    getActiveTopicFromSession,
    saveActiveTopicToSession,
  } = useSessionStorage();

  const [activeTopic, setActiveTopic] = useState(getActiveTopicFromSession() || {});
  const [topicsList, setTopicsList] = useState<Topic[]>(getChatFromSession() || []);
  const [unreadMessages, setUnreadMessages] = useState<string[]>(getUnreadMessagesFromSession() || []);

  const onActiveTopic = useCallback((topic: Topic) => {
    setActiveTopic(topic);
    saveActiveTopicToSession(topic);

    setUnreadMessages((prevUnread) => prevUnread.filter((id) => id !== topic._id));
  }, [saveActiveTopicToSession]);

  const sortTopicsByUpdatedAt = (topics: Topic[]): Topic[] =>
    [...topics].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleTopicDeleted = useCallback(
    (response: { success: boolean; topicId: string }) => {
      if (response.success) {
        const updatedTopics = topicsList.filter((topic) => topic._id !== response.topicId);
        setTopicsList(updatedTopics);
        setActiveTopic({});
        saveChatToSession(updatedTopics);
      }
    },
    [topicsList, saveChatToSession]
  );

  const handleTopicCreated = useCallback(
    (response: { success: boolean; topic: Topic }) => {
      if (response.success) {
        const newTopicsList = [response.topic, ...topicsList];
        setTopicsList(newTopicsList);
        setActiveTopic(response.topic);
        saveChatToSession(newTopicsList);
      }
    },
    [topicsList, saveChatToSession]
  );

  const handleTopicUpdated = useCallback(
    (response: { success: boolean; topic: Topic }) => {
      if (response.success) {
        const updatedTopics = topicsList.map((topic) =>
          topic._id === response.topic._id ? response.topic : topic
        );

        const sortedTopics = sortTopicsByUpdatedAt(updatedTopics);

        setActiveTopic((prevState) => {
          if ("_id" in prevState && prevState._id === response.topic._id) {
            return response.topic;
          }

          setUnreadMessages((prevUnread) => [...prevUnread, response.topic._id]);

          return prevState;
        });

        setTopicsList(sortedTopics);
        saveChatToSession(sortedTopics);
      }
    },
    [topicsList, saveChatToSession]
  );

  return {
    activeTopic,
    topicsList,
    unreadMessages,
    onActiveTopic,
    handleTopicCreated,
    handleTopicDeleted,
    handleTopicUpdated,
  };
};
