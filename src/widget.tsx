import React from "react";
import { createRoot } from "react-dom/client";
import WidgetApp from "./WidgetApp";
import "./styles/global.css";
import "./styles/widget.css";

const rootElement = document.getElementById("root");

if (rootElement) {
    document.body.classList.add("chat-widget-body");

    createRoot(rootElement).render(
        <React.StrictMode>
            <WidgetApp />
        </React.StrictMode>
    );
}
