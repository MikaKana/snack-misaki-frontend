import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode
} from "react";

import {
    fallbackLanguage,
    languageLabels,
    locales,
    supportedLanguages,
    translations,
    type Language,
    type TranslationKey,
    type TranslationParams
} from "./config";
import { TranslationContext, type TranslationContextValue } from "./context";

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
