import dayjs from "dayjs";
import { getTimePersona } from "../utils/timeGreetings";

export type StaticResponse = {
  id: string;
  patterns: Array<RegExp | string>;
  response: string | ((input: string) => string);
  description?: string;
};

const normalizePattern = (pattern: RegExp | string): RegExp =>
  typeof pattern === "string" ? new RegExp(pattern, "i") : pattern;

export const staticResponses: StaticResponse[] = [
  {
    id: "greeting",
    patterns: ["こんにちは", "こんばんは", "おはよう"],
    response: () => getTimePersona().greeting,
    description: "時間帯に応じた挨拶"
  },
  {
    id: "menu",
    patterns: [/おすすめ|メニュー/, /ドリンク/],
    response:
      "今日はフルーツたっぷりの美砂樹特製サングリアがおすすめよ。ゆっくり味わってね。"
  },
  {
    id: "first_time",
    patterns: [/初めて/, /はじめて/],
    response:
      "まあまあ、初めてなの？緊張しなくて大丈夫。まずは好きなお酒を教えてちょうだい。"
  },
  {
    id: "regular",
    patterns: [/いつもの/],
    response: () =>
      `はいはい、${getTimePersona().mamaName}特製のいつものやつね。カウンターを温めておいたわよ。`
  },
  {
    id: "closing_time",
    patterns: [/もう(閉店|おしまい)/],
    response: () => getTimePersona().closing
  },
  {
    id: "time_question",
    patterns: [/今何時/],
    response: () => {
      const now = dayjs();
      return `ただいまの時刻は ${now.format("HH:mm")} よ。まだ時間はたっぷりあるわ。`;
    }
  },
  {
    id: "thanks",
    patterns: [/ありがとう/, /感謝/],
    response: "こちらこそ来てくれて嬉しいわ。またゆっくりしていってね。"
  }
];

export const matchStaticResponse = (input: string): string | null => {
  for (const item of staticResponses) {
    if (item.patterns.some((pattern) => normalizePattern(pattern).test(input))) {
      return typeof item.response === "function"
        ? item.response(input)
        : item.response;
    }
  }
  return null;
};
