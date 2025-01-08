import { User } from "../interfaces/interfaces.ts";

export const validateTopicName = (user: User | undefined, searchValue: string): string | null => {
  if (!user || !user._id) {
    return "User not authenticated.";
  }

  const trimmedValue = searchValue.trim();
  const words = trimmedValue.split(/\s+/);

  if (words.length < 2 || words.some((word) => word.length < 2)) {
    return "Topic name must contain at least 2 words with 2 characters each.";
  }

  return null;
};
