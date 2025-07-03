import React from "react";
import ModDownloader from "./components/ModDownloader";

export default function App() {
    return (
        <div style={{ maxWidth: 700, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
            <h1>Minecraft Mod Downloader</h1>
            <ModDownloader />
        </div>
    );
}
