import React, { useState, useRef } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function MinecraftModDownloader() {
    // State
    const [selectedVersion, setSelectedVersion] = useState("");
    const [selectedLoader, setSelectedLoader] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [downloadResults, setDownloadResults] = useState<any[]>([]);
    const [currentMod, setCurrentMod] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Constants
    const minecraftVersions = ['1.21.7', '1.21.6', '1.21.5', '1.21.4', '1.21.3'];
    const modLoaders = ["Forge", "NeoForge", "Fabric", "Quilt"];

    // Handle file change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setFile(e.target.files[0]);
    };

    // Handle remove file
    const handleRemoveFile = () => {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Handle download
    const handleDownload = async () => {
        if (!selectedVersion || !selectedLoader || !file) {
            alert("Please select Minecraft version, mod loader and upload a .txt file.");
            return;
        }

        setIsDownloading(true);
        setCurrentMod(null);
        setDownloadResults([]);
        setProgress(0);

        try {
            // Create form data
            const formData = new FormData();
            formData.append("mcVersion", selectedVersion);
            formData.append("modLoader", selectedLoader);
            formData.append("modsFile", file);

            // Upload mods
            const uploadRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload-mods`, {
                method: "POST",
                body: formData,
            });

            // Get job ID and total mods
            const { jobId, totalMods } = await uploadRes.json();
            const results: any[] = [];
            let completed = 0;
            const progressPerMod = 100 / totalMods;

            // Create event source
            const eventSource = new EventSource(`${import.meta.env.VITE_API_BASE_URL}/progress/${jobId}`);

            // Handle message
            eventSource.onmessage = (e) => {
                const result = JSON.parse(e.data);
                results.push(result);
                setCurrentMod(result.url);
                completed++;
                setProgress(Math.min(Math.round(completed * progressPerMod), 100));
            };

            // Handle done
            eventSource.addEventListener("done", (e) => {
                const { zipUrl } = JSON.parse(e.data || "{}");

                if (zipUrl) {
                    // Create anchor element
                    const a = document.createElement("a");
                    a.href = zipUrl + "?t=" + Date.now();
                    a.download = "mods.zip";
                    a.target = "_blank";
                    a.rel = "noopener noreferrer";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }

                eventSource.close();
                setDownloadResults(results);
                setCurrentMod(null);
                setProgress(100);
                setIsDownloading(false);
            });

            // Handle error
            eventSource.onerror = () => {
                eventSource.close();
                setIsDownloading(false);
                alert("Connection lost during download.");
            };
        } catch (err: any) {
            // Error
            alert("Error: " + (err?.message || "Unknown"));
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

                        {/* Minecraft version */}
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
                                {minecraftVersions.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>

                        {/* Mod loader */}
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
                                {modLoaders.map(loader => (
                                    <option key={loader} value={loader.toLowerCase()}>{loader}</option>
                                ))}
                            </select>
                        </div>

                        {/* File input */}
                        <div className="mb-6">
                            <label htmlFor="modsFile" className="block mb-2 font-medium text-green-300">
                                Upload .txt file with mod URLs
                            </label>
                            <div className="flex items-center w-full rounded-md border border-green-600 bg-slate-700 px-3 py-2 relative">
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

                        {/* Status */}
                        {isDownloading && currentMod && (
                            <div className="mt-4 text-green-200 font-medium">
                                Currently downloading:{" "}
                                <a href={currentMod} target="_blank" rel="noopener noreferrer" className="underline">
                                    {currentMod}
                                </a>
                            </div>
                        )}

                        {isDownloading && (
                            <div className="w-full bg-green-900/50 rounded-full h-4 mt-3">
                                <div
                                    className="bg-green-400 h-4 rounded-full transition-all duration-300 ease-in-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        )}

                        {/* Failures */}
                        {!isDownloading && downloadResults.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-red-300 mb-2">❌ Mods with no compatible version:</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    {downloadResults
                                        .filter(r => !r.success)
                                        .map((fail, index) => {
                                            const link = fail.url.endsWith("/versions") ? fail.url : `${fail.url}/versions`;
                                            return (
                                                <li key={index}>
                                                    <a
                                                        href={link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-red-400 hover:underline"
                                                    >
                                                        {link}
                                                    </a>{" "}
                                                    – {fail.message}
                                                </li>
                                            );
                                        })}
                                </ul>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <footer className="text-center text-green-300/60 text-sm mb-4">
                Made for Minecraft enthusiasts • Always use trusted mod sources
            </footer>
        </div>
    );
}
