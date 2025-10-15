import { FormEvent, useRef, useState } from "react";
import { useChatEngine } from "../hooks/useChatEngine";
import { useTranslation } from "../i18n";
import MessageBubble from "./MessageBubble";

function ChatWindow() {
  const { messages, isBusy, sendMessage, resetConversation } = useChatEngine();
  const [input, setInput] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) {
      return;
    }

    await sendMessage(input);
    setInput("");

    requestAnimationFrame(() => {
      const element = listRef.current;
      if (element) {
        element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
      }
    });
  };

  return (
    <section className="chat-window">
      <div className="chat-log" ref={listRef}>
        {messages.map((message) => (
          <MessageBubble key={message.id + message.createdAt.getTime()} message={message} />
        ))}
      </div>

      <form className="chat-form" onSubmit={handleSubmit} ref={formRef}>
        <label className="form-label" htmlFor="chat-input">
          {t("chat.promptLabel")}
        </label>
        <textarea
          id="chat-input"
          className="form-input"
          placeholder={t("chat.placeholder")}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={3}
          disabled={isBusy}
        />
        <div className="form-actions">
          <button type="submit" className="button" disabled={isBusy || !input.trim()}>
            {t("chat.submit")}
          </button>
          <button type="button" className="button button--ghost" onClick={resetConversation}>
            {t("chat.reset")}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ChatWindow;
