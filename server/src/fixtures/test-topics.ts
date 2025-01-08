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
            {
                messageId: randomUUID(),
                role: "bot",
                text: "Your work is the worst!",
                timestamp: new Date().toISOString(),
            },
        ],
    },
    {
        userId,
        createdAt: thirtyMinutesAgo.toISOString(),
        updatedAt: thirtyMinutesAgo.toISOString(),
        name: "Josephina",
        photo: "./avatars/u-2.webp",
        messages: [
            {
                messageId: randomUUID(),
                role: "bot",
                text: "Welcome to our chat platform! How can I help you?",
                timestamp: thirtyMinutesAgo.toISOString(),
            },
        ],
    },
    {
        userId,
        createdAt: oneAndHalfHourAgo.toISOString(),
        updatedAt: thirtyMinutesAgo.toISOString(),
        name: "Velazquez",
        photo: "./avatars/u-1.webp",
        messages: [
            {
                messageId: randomUUID(),
                role: "user",
                text: "Hello",
                timestamp: oneAndHalfHourAgo.toISOString(),
            },
            {
                messageId: randomUUID(),
                role: "bot",
                text: "Hello! How are you?",
                timestamp: thirtyMinutesAgo.toISOString(),
            },
        ],
    },
    {
        userId,
        createdAt: fiveMinutesAgo.toISOString(),
        updatedAt: fiveMinutesAgo.toISOString(),
        name: "Piter",
        photo: "./avatars/u-4.webp",
        messages: [],
    },
];
