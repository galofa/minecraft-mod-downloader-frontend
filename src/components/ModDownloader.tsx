import React from "react";
import Header from "./Header";
import VersionSelector from "./VersionSelector";
import FileUpload from "./FileUpload";
import DownloadButton from "./DownloadButton";
import ResultsDisplay from "./ResultsDisplay";
import Footer from "./Footer";
import { useModDownloader } from "../hooks/useModDownloader";

export default function MinecraftModDownloader() {
    const {
        selectedVersion,
        setSelectedVersion,
        selectedLoader,
        setSelectedLoader,
        isDownloading,
        file,
        setFile,
        downloadResults,
        currentMod,
        progress,
        handleDownload,
    } = useModDownloader();

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white">
            <main className="flex-grow p-6">
                <div className="max-w-4xl mx-auto">
                    <Header />

                    <section className="bg-slate-800/70 border border-green-500/30 rounded-lg p-6 shadow-xl">
                        <h2 className="text-2xl mb-6 flex items-center gap-2 font-semibold">⚡ Quick Download</h2>

                        <VersionSelector selectedVersion={selectedVersion} setSelectedVersion={setSelectedVersion} selectedLoader={selectedLoader} setSelectedLoader={setSelectedLoader} />

                        <FileUpload file={file} setFile={setFile} />

                        <DownloadButton selectedVersion={selectedVersion} selectedLoader={selectedLoader} file={file} isDownloading={isDownloading} currentMod={currentMod} progress={progress} onDownload={handleDownload} />

                        <ResultsDisplay isDownloading={isDownloading} downloadResults={downloadResults} />
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
