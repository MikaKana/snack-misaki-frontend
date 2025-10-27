import { useCallback, useRef, useState } from "react";
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from "../config";
import { matchStaticResponse } from "../constants/responses";
import { getTimePersona } from "../utils/timeGreetings";
import { generateUUID } from "../utils/uuid";
import type { ChatMessage } from "../types";

type SendMessageResult = {
  handledBy: "static" | "api" | "fallback";
};

type ApiConversationEntry = {
  role: "user" | "assistant";
  content: string;
};

type ApiRequestMetadata = {
  channel: string;
  session_id: string;
};

type ApiRequestPayload = {
  conversation: ApiConversationEntry[];
  metadata: ApiRequestMetadata;
};

const CHANNEL = "web";

const getInitialSessionId = (): string => {
  if (typeof window === "undefined") {
    return generateUUID();
  }

  try {
    const storageKey = "snack-misaki-session-id";
    const storedId = window.sessionStorage.getItem(storageKey);
    if (storedId) {
      return storedId;
    }

    const newId = generateUUID();
    window.sessionStorage.setItem(storageKey, newId);
    return newId;
  } catch {
    return generateUUID();
  }
};

const createMessage = (sender: ChatMessage["sender"], text: string): ChatMessage => ({
  id: generateUUID(),
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
    createMessage("system", persona.systemPrompt)
  ];
};

const callApi = async (payload: ApiRequestPayload): Promise<string | null> => {
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
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
    ) {
      return (data as { message: string }).message;
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
  const conversationIdRef = useRef(0);
  const sessionIdRef = useRef<string>(getInitialSessionId());

  const formatConversationForApi = useCallback(
      (history: ChatMessage[]): ApiConversationEntry[] =>
          history
              .filter((message) => message.sender !== "system" && !message.pending)
              .map((message) => ({
                role: message.sender === "user" ? "user" : "assistant",
                content: message.text
              })),
      []
  );

  const sendMessage = useCallback(
    async (text: string): Promise<SendMessageResult> => {
      const trimmed = text.trim();
      if (!trimmed) {
        return { handledBy: "fallback" };
      }

      const conversationId = conversationIdRef.current;
      const persona = getTimePersona();
      const userMessage = createMessage("user", trimmed);
      const typingMessage = mamaTypingMessage();

      setMessages((prev) => [...prev, userMessage, typingMessage]);
      setIsBusy(true);

      await new Promise((resolve) => setTimeout(resolve, 400));

      if (conversationIdRef.current !== conversationId) {
        return { handledBy: "fallback" };
      }

      const staticResponse = matchStaticResponse(trimmed);
      if (staticResponse) {
        if (conversationIdRef.current === conversationId) {
          setMessages((prev) => [
            ...prev.filter((message) => message.id !== "typing"),
            createMessage("mama", staticResponse)
          ]);
          setIsBusy(false);
        }
        return { handledBy: "static" };
      }

      const apiReply = await callApi({
        conversation: formatConversationForApi([...messages, userMessage]),
        metadata: {
          channel: CHANNEL,
          session_id: sessionIdRef.current
        }
      });

      if (conversationIdRef.current === conversationId) {
        setMessages((prev) => [
          ...prev.filter((message) => message.id !== "typing"),
          apiReply ? createMessage("mama", apiReply) : fallbackResponse(),
          createMessage("system", `${persona.mamaName}は会話を記録しているわ。`)
        ]);
        setIsBusy(false);
      }

      return { handledBy: apiReply ? "api" : "fallback" };
    },
    [formatConversationForApi, messages]
  );

  const resetConversation = useCallback(() => {
    conversationIdRef.current += 1;
    setMessages(initialGreeting());
    setIsBusy(false);
  }, []);

  return {
    messages,
    isBusy,
    sendMessage,
    resetConversation
  };
};
