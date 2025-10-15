import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { TranslationProvider } from "./i18n";
import "./styles/global.css";

createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <TranslationProvider>
            <App />
        </TranslationProvider>
    </React.StrictMode>
);
