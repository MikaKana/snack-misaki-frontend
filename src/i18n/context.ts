import { createContext } from "react";

import type {
    Language,
    TranslationKey,
    TranslationParams
} from "./config";

export type TranslationContextValue = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: TranslationKey, params?: TranslationParams) => string;
    availableLanguages: { code: Language; label: string }[];
    locale: string;
};

export const TranslationContext = createContext<TranslationContextValue | undefined>(undefined);
