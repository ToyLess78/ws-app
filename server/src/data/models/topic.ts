import { ObjectId } from "mongodb";
import { Message } from "./message";

export class Topic {
  public _id?: ObjectId;
  public userId: string;
  public createdAt: string;
  public updatedAt: string;
  public name: string;
  public photo: string;
  public messages: Message[];

  constructor(userId: string, name: string, photo: string, messages: Message[] = []) {
    this.userId = userId;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.name = name;
    this.photo = photo;
    this.messages = messages;
  }
}
