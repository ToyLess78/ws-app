import { randomUUID } from "crypto";
import { Topic } from "../data/models/topic";

const now = new Date();

const oneAndHalfHourAgo = new Date(now.getTime() - 1.5 * 60 * 60 * 1000);
const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
export const getTestTopicsForUser = (userId: string): Omit<Topic, "_id">[] => [
  {
    userId,
    createdAt: fifteenMinutesAgo.toISOString(),
    updatedAt: new Date().toISOString(),
    name: "Alice Freeman",
    photo: "./avatars/u-3.webp",
    messages: [
      {
        messageId: randomUUID(),
        role: "bot",
        text: "Hey, where are you?",
        timestamp: tenMinutesAgo.toISOString(),
      },
      {
        messageId: randomUUID(),
        role: "user",
        text: "What's happen?",
        timestamp: fifteenMinutesAgo.toISOString(),
      },
    ],
  },
  {
    userId,
    createdAt: thirtyMinutesAgo.toISOString(),
    updatedAt: thirtyMinutesAgo.toISOString(),
    name: "Josephina Hale",
    photo: "./avatars/u-2.webp",
    messages: [
      {
        messageId: randomUUID(),
        role: "bot",
        text: "Hi! How are you?",
        timestamp: thirtyMinutesAgo.toISOString(),
      },
      {
        messageId: randomUUID(),
        role: "user",
        text: "Hey there! I'm here and ready to chat. How about you? How's your day going?",
        timestamp: fifteenMinutesAgo.toISOString(),
      },
    ],
  },
  {
    userId,
    createdAt: oneAndHalfHourAgo.toISOString(),
    updatedAt: thirtyMinutesAgo.toISOString(),
    name: "Diego Velazquez",
    photo: "./avatars/u-1.webp",
    messages: [
      {
        messageId: randomUUID(),
        role: "user",
        text: "Hey there!",
        timestamp: oneAndHalfHourAgo.toISOString(),
      },
      {
        messageId: randomUUID(),
        role: "bot",
        text: "Hi 😊",
        timestamp: thirtyMinutesAgo.toISOString(),
      },
      {
        messageId: randomUUID(),
        role: "user",
        text: "How’s it going?",
        timestamp: oneAndHalfHourAgo.toISOString(),
      },
    ],
  },
  {
    userId,
    createdAt: fiveMinutesAgo.toISOString(),
    updatedAt: fiveMinutesAgo.toISOString(),
    name: "Piter Parker",
    photo: "./avatars/u-4.webp",
    messages: [],
  },
];
