import { useCallback, useMemo, useState } from "react";
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from "../config";
import { matchStaticResponse } from "../constants/responses";
import { getTimePersona } from "../utils/timeGreetings";
import type { ChatMessage } from "../types";

type SendMessageResult = {
  handledBy: "static" | "api" | "fallback";
};

const createMessage = (sender: ChatMessage["sender"], text: string): ChatMessage => ({
  id: crypto.randomUUID(),
  sender,
  text,
  createdAt: new Date()
});

const mamaTypingMessage = (): ChatMessage => ({
  id: "typing",
  sender: "mama",
  text: "……",
  createdAt: new Date(),
  pending: true
});

const initialGreeting = (): ChatMessage[] => {
  const persona = getTimePersona();
  return [
    createMessage("mama", persona.greeting),
    createMessage(
      "system",
      "ご注文や世間話など、好きなことを気軽に入力してくださいね。"
    )
  ];
};

const callApi = async (text: string): Promise<string | null> => {
  if (!API_BASE_URL) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text }),
      signal: controller.signal
    });

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    if (
      data &&
      typeof data === "object" &&
      "reply" in data &&
      typeof (data as { reply: unknown }).reply === "string"
    ) {
      return (data as { reply: string }).reply;
    }
  } catch (error) {
    console.error("Failed to call backend API", error);
  } finally {
    clearTimeout(timeout);
  }

  return null;
};

const fallbackResponse = () =>
  createMessage(
    "mama",
    "ごめんなさいね、まだ修行中でその話題にはうまく答えられないの。もう少し詳しく教えてくれる？"
  );

export const useChatEngine = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => initialGreeting());
  const [isBusy, setIsBusy] = useState(false);

  const persona = useMemo(() => getTimePersona(), []);

  const sendMessage = useCallback(
    async (text: string): Promise<SendMessageResult> => {
      const trimmed = text.trim();
      if (!trimmed) {
        return { handledBy: "fallback" };
      }

      setMessages((prev) => [...prev, createMessage("user", trimmed), mamaTypingMessage()]);
      setIsBusy(true);

      await new Promise((resolve) => setTimeout(resolve, 400));

      const staticResponse = matchStaticResponse(trimmed);
      if (staticResponse) {
        setMessages((prev) => [
          ...prev.filter((message) => message.id !== "typing"),
          createMessage("mama", staticResponse)
        ]);
        setIsBusy(false);
        return { handledBy: "static" };
      }

      const apiReply = await callApi(trimmed);

      setMessages((prev) => [
        ...prev.filter((message) => message.id !== "typing"),
        apiReply
          ? createMessage("mama", apiReply)
          : fallbackResponse(),
        createMessage("system", `${persona.mamaName}は会話を記録しているわ。`)
      ]);

      setIsBusy(false);

      return { handledBy: apiReply ? "api" : "fallback" };
    },
    [persona.mamaName]
  );

  const resetConversation = useCallback(() => {
    setMessages(initialGreeting());
  }, []);

  return {
    messages,
    isBusy,
    sendMessage,
    resetConversation
  };
};
