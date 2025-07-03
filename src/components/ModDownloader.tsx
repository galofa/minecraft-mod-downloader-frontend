import React, { useState, useRef } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function MinecraftModDownloader() {
    const [selectedVersion, setSelectedVersion] = useState("");
    const [selectedLoader, setSelectedLoader] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const minecraftVersions = ['1.21.7', '1.21.6', '1.21.5', '1.21.4', '1.21.3', '1.21.2', '1.21.1', '1.21', '1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.20', '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19', '1.18.2', '1.18.1', '1.18', '1.17.1', '1.17', '1.16.5', '1.16.4', '1.16.3', '1.16.2', '1.16.1', '1.15.2', '1.15.1', '1.15', '1.14.4', '1.14.3', '1.14.2', '1.14.1', '1.14', '1.13.2', '1.13.1', '1.13', '1.12.2', '1.12.1', '1.12', '1.11.2', '1.11.1', '1.11', '1.10.2', '1.10.1', '1.10.0', '1.9.4', '1.9.3', '1.9.2', '1.9.1', '1.9', '1.8.9', '1.8.8', '1.8.7', '1.8.6', '1.8.5', '1.8.4', '1.8.3', '1.8.2', '1.8.1', '1.8', '1.7.10', '1.7.9', '1.7.8', '1.7.7', '1.7.6', '1.7.5', '1.7.4', '1.7.2', '1.6.2', '1.6.1', '1.5.2', '1.5.1', '1.5', '1.4.7', '1.4.6', '1.4.5', '1.4.4', '1.4.2', '1.3.2', '1.3.1', '1.2.5', '1.2.4', '1.2.3', '1.2.2', '1.2.1', '1.1', '1.0'];
    const modLoaders = ["Forge", "NeoForge", "Fabric", "Quilt"];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // ✅ clear real file input
        }
    };

    const handleDownload = async () => {
        if (!selectedVersion || !selectedLoader || !file) {
            alert("Please select Minecraft version, mod loader and upload a .txt file.");
            return;
        }

        setIsDownloading(true);

        try {
            const formData = new FormData();
            formData.append("mcVersion", selectedVersion);
            formData.append("modLoader", selectedLoader);
            formData.append("modsFile", file);

            const response = await fetch("http://localhost:4000/api/download-mods", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const data = await response.json();

            console.log("Download results:", data);

            alert("Download process complete. Check backend logs and downloads folder.");

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Download error:", error.message);
                alert("Failed to download mods: " + error.message);
            } else {
                console.error("Download error:", error);
                alert("Failed to download mods: Unknown error");
            }
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white">
            <main className="flex-grow p-6">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-8 text-center">
                        <div className="inline-flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-lg font-bold text-xl">
                                📦
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight">Minecraft Mod Downloader</h1>
                        </div>
                        <p className="text-green-300 text-lg">
                            Discover and download the best mods for your Minecraft experience
                        </p>
                    </header>

                    <section className="bg-slate-800/70 border border-green-500/30 rounded-lg p-6 shadow-xl">
                        <h2 className="text-2xl mb-6 flex items-center gap-2 font-semibold">⚡ Quick Download</h2>

                        {/* Minecraft version selector */}
                        <div className="mb-6">
                            <label htmlFor="mcVersion" className="block mb-1 font-medium text-green-300">
                                Minecraft Version
                            </label>
                            <select
                                id="mcVersion"
                                value={selectedVersion}
                                onChange={(e) => setSelectedVersion(e.target.value)}
                                className="w-full p-3 rounded bg-slate-700 border border-green-600 text-white"
                            >
                                <option value="">Select version</option>
                                {minecraftVersions.map((v) => (
                                    <option key={v} value={v}>
                                        {v}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Mod loader selector */}
                        <div className="mb-6">
                            <label htmlFor="modLoader" className="block mb-1 font-medium text-green-300">
                                Mod Loader
                            </label>
                            <select
                                id="modLoader"
                                value={selectedLoader}
                                onChange={(e) => setSelectedLoader(e.target.value)}
                                className="w-full p-3 rounded bg-slate-700 border border-green-600 text-white"
                            >
                                <option value="">Select mod loader</option>
                                {modLoaders.map((loader) => (
                                    <option key={loader} value={loader.toLowerCase()}>
                                        {loader}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* File upload input */}
                        <div className="mb-6">
                            <label htmlFor="modsFile" className="block mb-2 font-medium text-green-300">
                                Upload .txt file with mod URLs
                            </label>

                            <div className="flex items-center w-full rounded-md border border-green-600 bg-slate-700 px-3 py-2 relative">
                                {/* Clickable file area */}
                                <div className="flex items-center flex-grow relative z-10 cursor-pointer">
                                    <FaPlus className="text-green-300 mr-3" />
                                    <span className="text-white truncate">
                                        {file ? file.name : "No file selected"}
                                    </span>
                                    <input
                                        id="modsFile"
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".txt"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>

                                {/* Trash icon (clickable) */}
                                {file && (
                                    <button
                                        onClick={handleRemoveFile}
                                        className="text-red-400 hover:text-red-300 ml-3 relative z-20"
                                        title="Remove file"
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Download button */}
                        <button
                            onClick={handleDownload}
                            disabled={!selectedVersion || !selectedLoader || !file || isDownloading}
                            className={`w-full p-4 text-lg font-bold rounded text-white 
                                bg-gradient-to-r from-green-500 to-green-600
                                hover:from-green-600 hover:to-green-700
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-transform duration-200
                                ${isDownloading ? "animate-pulse" : "hover:scale-[1.02]"}`}
                        >
                            {isDownloading ? "Downloading..." : "Download Mods"}
                        </button>
                    </section>
                </div>
            </main>

            <footer className="text-center text-green-300/60 text-sm mb-4">
                Made for Minecraft enthusiasts • Always use trusted mod sources
            </footer>
        </div>
    );
}
