export interface User {
  _id?: string;
  name?: string;
  picture?: string;
  email: string;
  createdAt?: string;

}

export interface Topic {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  photo: string;
  messages: Message[] | [];
}

export interface Message {
  messageId: string;
  role: string;
  text: string;
  timestamp: Date | string;
}

export interface Chat {
  chat: Topic[];
}
