import React from "react";
import ReactDOM from "react-dom/client";
import WidgetApp from "./WidgetApp";
import "./styles/global.css";
import "./styles/widget.css";

const rootElement = document.getElementById("root");

if (rootElement) {
    document.body.classList.add("chat-widget-body");

    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <WidgetApp />
        </React.StrictMode>
    );
}
