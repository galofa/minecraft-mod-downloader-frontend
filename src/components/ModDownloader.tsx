import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

interface Result {
    url: string;
    success: boolean;
    message: string;
    fileName?: string;
}

export default function ModDownloader() {
    const [mcVersion, setMcVersion] = useState("1.20.4");
    const [modLoader, setModLoader] = useState("forge");
    const [file, setFile] = useState<File | null>(null);
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            "text/plain": [".txt"]
        }
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!file) {
            setError("Please upload a .txt file with mod URLs.");
            return;
        }

        setError(null);
        setLoading(true);
        setResults([]);

        const formData = new FormData();
        formData.append("modsFile", file);
        formData.append("mcVersion", mcVersion);
        formData.append("modLoader", modLoader);

        try {
            const res = await axios.post("http://localhost:4000/api/download-mods", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setResults(res.data.results);
        } catch (err: any) {
            setError(err.response?.data?.error || "Error sending request");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label>
                Minecraft Version:
                <select value={mcVersion} onChange={e => setMcVersion(e.target.value)} style={{ marginLeft: 10 }}>
                    <option>1.20.4</option>
                    <option>1.20.1</option>
                    <option>1.19.4</option>
                    <option>1.18.2</option>
                    {/* Add more versions as needed */}
                </select>
            </label>

            <label>
                Mod Loader:
                <select value={modLoader} onChange={e => setModLoader(e.target.value)} style={{ marginLeft: 10 }}>
                    <option value="forge">Forge</option>
                    <option value="neoforge">NeoForge</option>
                    <option value="fabric">Fabric</option>
                    <option value="quilt">Quilt</option>
                </select>
            </label>

            <div
                {...getRootProps()}
                style={{
                    border: "2px dashed #888",
                    padding: "1rem",
                    textAlign: "center",
                    cursor: "pointer",
                    background: isDragActive ? "#eee" : undefined
                }}
            >
                <input {...getInputProps()} />
                {file ? (
                    <p>File selected: {file.name}</p>
                ) : (
                    <p>Drag & drop your .txt file here, or click to select</p>
                )}
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Downloading..." : "Download Mods"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {results.length > 0 && (
                <div>
                    <h3>Results:</h3>
                    <ul>
                        {results.map((r, i) => (
                            <li key={i} style={{ color: r.success ? "green" : "red" }}>
                                <strong>{r.url}</strong>: {r.message} {r.fileName && `(Saved as ${r.fileName})`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </form>
    );
}
