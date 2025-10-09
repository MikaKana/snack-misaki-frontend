export type Sender = "user" | "mama" | "system";

export type ChatMessage = {
  id: string;
  sender: Sender;
  text: string;
  createdAt: Date;
  pending?: boolean;
};
