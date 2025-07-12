import { useState } from "react";

export function useModDownloader() {
    const [selectedVersion, setSelectedVersion] = useState("");
    const [selectedLoader, setSelectedLoader] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [downloadResults, setDownloadResults] = useState<any[]>([]);
    const [currentMod, setCurrentMod] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);

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

    return {
        // State
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
        // Actions
        handleDownload,
    };
} 