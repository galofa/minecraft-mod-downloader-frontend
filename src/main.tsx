import React from "react";
import ReactDOM from "react-dom/client";
import ModDownloader from "./components/ModDownloader";
import "./styles.css";
import { Analytics } from "@vercel/analytics/react"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ModDownloader />
        <Analytics/>
    </React.StrictMode>
);
