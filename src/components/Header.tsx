import React from "react";

export default function Header() {
    return (
        <header className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center shadow-lg font-bold text-4xl">
                    📦
                </div>
                <h1 className="text-4xl font-bold tracking-tight">BulkMod</h1>
            </div>
            <p className="text-green-300 text-lg">
                Download in bulk the best mods for your Minecraft experience
            </p>
        </header>
    );
} 