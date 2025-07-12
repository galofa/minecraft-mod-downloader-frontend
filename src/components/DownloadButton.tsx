import React from "react";

interface DownloadButtonProps {
    selectedVersion: string;
    selectedLoader: string;
    file: File | null;
    isDownloading: boolean;
    currentMod: string | null;
    progress: number;
    onDownload: () => void;
}

export default function DownloadButton({
    selectedVersion,
    selectedLoader,
    file,
    isDownloading,
    currentMod,
    progress,
    onDownload
}: DownloadButtonProps) {
    return (
        <>
            {/* Download button */}
            <button
                onClick={onDownload}
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
        </>
    );
} 