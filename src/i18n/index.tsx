import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode
} from "react";

const supportedLanguages = ["ja", "en"] as const;

export type Language = (typeof supportedLanguages)[number];

type TranslationParams = Record<string, string | number>;

const translations = {
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

type TranslationKey = keyof (typeof translations)["ja"];

const languageLabels: Record<Language, string> = {
    ja: "日本語",
    en: "English"
};

const locales: Record<Language, string> = {
    ja: "ja-JP",
    en: "en-US"
};

type TranslationContextValue = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: TranslationKey, params?: TranslationParams) => string;
    availableLanguages: { code: Language; label: string }[];
    locale: string;
};

const TranslationContext = createContext<TranslationContextValue | undefined>(undefined);

const fallbackLanguage: Language = "ja";

function isSupportedLanguage(value: string | null | undefined): value is Language {
    return supportedLanguages.includes(value as Language);
}

function getStoredLanguage(): Language | undefined {
    if (typeof window === "undefined") {
        return undefined;
    }

    const stored = window.localStorage.getItem("app.language");
    if (isSupportedLanguage(stored)) {
        return stored;
    }

    return undefined;
}

function detectBrowserLanguage(): Language | undefined {
    if (typeof navigator === "undefined") {
        return undefined;
    }

    const { language, languages } = navigator;
    const candidates = [language, ...(languages ?? [])];

    for (const candidate of candidates) {
        if (!candidate) {
            continue;
        }

        const normalized = candidate.slice(0, 2).toLowerCase();
        if (isSupportedLanguage(normalized)) {
            return normalized;
        }
    }

    return undefined;
}

const languageOptions = supportedLanguages.map((code) => ({
    code,
    label: languageLabels[code]
}));

export function TranslationProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        return getStoredLanguage() ?? detectBrowserLanguage() ?? fallbackLanguage;
    });

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        window.localStorage.setItem("app.language", language);
    }, [language]);

    const setLanguage = useCallback((nextLanguage: Language) => {
        setLanguageState(nextLanguage);
    }, []);

    const translate = useCallback(
        (key: TranslationKey, params?: TranslationParams) => {
            const catalog = translations[language] ?? translations[fallbackLanguage];
            const template = catalog[key] ?? key;

            if (!params) {
                return template;
            }

            return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, token: string) => {
                const value = params[token];
                return value === undefined || value === null ? "" : String(value);
            });
        },
        [language]
    );

    const value = useMemo<TranslationContextValue>(
        () => ({
            language,
            setLanguage,
            t: translate,
            availableLanguages: languageOptions,
            locale: locales[language] ?? locales[fallbackLanguage]
        }),
        [language, setLanguage, translate]
    );

    return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslation() {
    const context = useContext(TranslationContext);

    if (!context) {
        throw new Error("useTranslation must be used within a TranslationProvider");
    }

    return context;
}
