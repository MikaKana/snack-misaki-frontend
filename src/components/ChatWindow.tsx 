import { FormEvent, useRef, useState } from "react";
import { useChatEngine } from "../hooks/useChatEngine";
import MessageBubble from "./MessageBubble";

function ChatWindow() {
  const { messages, isBusy, sendMessage, resetConversation } = useChatEngine();
  const [input, setInput] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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
          ママへのひとこと
        </label>
        <textarea
          id="chat-input"
          className="form-input"
          placeholder="今日の出来事や相談ごとを教えてね。"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={3}
          disabled={isBusy}
        />
        <div className="form-actions">
          <button type="submit" className="button" disabled={isBusy || !input.trim()}>
            送信する
          </button>
          <button type="button" className="button button--ghost" onClick={resetConversation}>
            会話をリセット
          </button>
        </div>
      </form>
    </section>
  );
}

export default ChatWindow;
