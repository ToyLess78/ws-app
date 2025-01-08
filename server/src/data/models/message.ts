import { randomUUID } from "crypto";

export class Message {
    public messageId: string;
    public role: "user" | "bot";
    public text: string;
    public timestamp: string;

    constructor(role: "user" | "bot", text: string) {
        this.messageId = randomUUID();
        this.role = role;
        this.text = text;
        this.timestamp = new Date().toISOString();
    }
}
