import React from "react";

interface VersionSelectorProps {
    selectedVersion: string;
    setSelectedVersion: (version: string) => void;
    selectedLoader: string;
    setSelectedLoader: (loader: string) => void;
}

export default function VersionSelector({
    selectedVersion,
    setSelectedVersion,
    selectedLoader,
    setSelectedLoader
}: VersionSelectorProps) {
    const minecraftVersions = ['1.21.7', '1.21.6', '1.21.5', '1.21.4', '1.21.3', '1.21.2', '1.21.1', '1.21', '1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.20', '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19', '1.18.2', '1.18.1', '1.18', '1.17.1', '1.17', '1.16.5', '1.16.4', '1.16.3', '1.16.2', '1.16.1', '1.15.2', '1.15.1', '1.15', '1.14.4', '1.14.3', '1.14.2', '1.14.1', '1.14', '1.13.2', '1.13.1', '1.13', '1.12.2', '1.12.1', '1.12', '1.11.2', '1.11.1', '1.11', '1.10.2', '1.10.1', '1.10.0', '1.9.4', '1.9.3', '1.9.2', '1.9.1', '1.9', '1.8.9', '1.8.8', '1.8.7', '1.8.6', '1.8.5', '1.8.4', '1.8.3', '1.8.2', '1.8.1', '1.8', '1.7.10', '1.7.9', '1.7.8', '1.7.7', '1.7.6', '1.7.5', '1.7.4', '1.7.2', '1.6.2', '1.6.1', '1.5.2', '1.5.1', '1.5', '1.4.7', '1.4.6', '1.4.5', '1.4.4', '1.4.2', '1.3.2', '1.3.1', '1.2.5', '1.2.4', '1.2.3', '1.2.2', '1.2.1', '1.1', '1.0'];
    const modLoaders = ["Forge", "NeoForge", "Fabric", "Quilt"];

    return (
        <>
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
        </>
    );
} 