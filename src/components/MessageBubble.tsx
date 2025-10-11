import clsx from "clsx";
import type { ChatMessage } from "../types";

export type MessageBubbleProps = {
  message: ChatMessage;
};

const senderLabel: Record<ChatMessage["sender"], string> = {
  user: "あなた",
  mama: "美砂樹ママ",
  system: "システム"
};

function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={clsx("message", `message--${message.sender}`)}>
      <div className="message-meta">
        <span className="message-sender">{senderLabel[message.sender]}</span>
        <time className="message-time">
          {message.createdAt.toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </time>
      </div>
      <div className="message-body">
        {message.pending ? <span className="typing-indicator">・・・</span> : message.text}
      </div>
    </div>
  );
}

export default MessageBubble;
