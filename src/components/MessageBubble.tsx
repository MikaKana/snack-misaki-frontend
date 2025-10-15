import clsx from "clsx";
import { useTranslation } from "../i18n";
import type { ChatMessage } from "../types";

export type MessageBubbleProps = {
  message: ChatMessage;
};

function MessageBubble({ message }: MessageBubbleProps) {
  const { t, locale } = useTranslation();
  const senderLabel: Record<ChatMessage["sender"], string> = {
      user: t("message.sender.user"),
      mama: t("message.sender.mama"),
      system: t("message.sender.system")
  };

  return (
    <div className={clsx("message", `message--${message.sender}`)}>
      <div className="message-meta">
        <span className="message-sender">{senderLabel[message.sender]}</span>
        <time className="message-time">
            {message.createdAt.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </time>
      </div>
      <div className="message-body">
          {message.pending ? <span className="typing-indicator">{t("message.pendingIndicator")}</span> : message.text}
      </div>
    </div>
  );
}

export default MessageBubble;
