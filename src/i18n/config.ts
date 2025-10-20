export const supportedLanguages = ["ja", "en"] as const;

export type Language = (typeof supportedLanguages)[number];

export type TranslationParams = Record<string, string | number>;

export const translations = {
    ja: {
        "app.languageSwitcherLabel": "言語",
        "header.subtitle": "いらっしゃいませ、スナック美砂樹へようこそ",
        "intro.kicker": "今日もおつかれさま",
        "intro.title": "ママと一緒に小さなひとときを分かち合おう",
        "intro.description":
            "今日はどんなことがあった？嬉しかったことも、ちょっと疲れたことも、このスナックでゆっくりお話していってね。",
        "chat.promptLabel": "ママへのひとこと",
        "chat.placeholder": "今日の出来事や相談ごとを教えてね。",
        "chat.submit": "送信する",
        "chat.reset": "会話をリセット",
        "footer.copy": "© {{year}} Snack Misaki",
        "footer.apiBaseUrlPrefix": "API ベース URL:",
        "footer.apiBaseUrlUnset": "未設定",
        "message.sender.user": "あなた",
        "message.sender.mama": "美砂樹ママ",
        "message.sender.system": "システム",
        "message.pendingIndicator": "・・・"
    },
    en: {
        "app.languageSwitcherLabel": "Language",
        "header.subtitle": "Welcome to Snack Misaki",
        "intro.kicker": "Thanks for your hard work today",
        "intro.title": "Share a small moment together with Mama",
        "intro.description":
            "How was your day? Whether it was something joyful or a little tiring, take your time and tell Mama all about it here.",
        "chat.promptLabel": "A note for Mama",
        "chat.placeholder": "Tell us about your day or anything on your mind.",
        "chat.submit": "Send",
        "chat.reset": "Reset conversation",
        "footer.copy": "© {{year}} Snack Misaki",
        "footer.apiBaseUrlPrefix": "API base URL:",
        "footer.apiBaseUrlUnset": "Not set",
        "message.sender.user": "You",
        "message.sender.mama": "Mama Misaki",
        "message.sender.system": "System",
        "message.pendingIndicator": "..."
    }
} as const;

export type TranslationKey = keyof (typeof translations)[Language];

export const languageLabels: Record<Language, string> = {
    ja: "日本語",
    en: "English"
};

export const locales: Record<Language, string> = {
    ja: "ja-JP",
    en: "en-US"
};

export const fallbackLanguage: Language = "ja";
