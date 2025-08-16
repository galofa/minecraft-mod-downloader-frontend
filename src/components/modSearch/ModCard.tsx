import React from "react";
import { FiDownload, FiClock, FiStar } from "react-icons/fi";
import { ModrinthProject } from "./types";
import { formatNumber, timeAgo } from "./utils";

interface ModCardProps {
  mod: ModrinthProject;
}

export default function ModCard({ mod }: ModCardProps) {
  return (
    <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-4 gap-4 shadow hover:shadow-lg transition-shadow items-center relative">
      {/* Icon */}
      <img
        src={mod.icon_url || "/favicon.png"}
        alt={mod.title}
        className="w-16 h-16 rounded bg-slate-700 object-cover flex-shrink-0"
        onError={(e) => ((e.target as HTMLImageElement).src = "/favicon.png")}
      />
      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <a
            href={`https://modrinth.com/mod/${mod.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-bold text-green-300 hover:underline truncate"
          >
            {mod.title}
          </a>
          <span className="text-xs text-slate-400 truncate">by {mod.author}</span>
        </div>
        <p className="text-slate-300 text-sm mb-1 truncate">{mod.description}</p>
        <div className="flex flex-wrap gap-2 text-xs mt-1">
          <span className="bg-green-900/60 px-2 py-0.5 rounded text-green-300 font-semibold">
            {mod.client_side === "required" || mod.server_side === "required"
              ? "Client or server"
              : mod.client_side === "optional" || mod.server_side === "optional"
              ? "Client or server (optional)"
              : mod.client_side === "unsupported"
              ? "Server only"
              : "Client only"}
          </span>
          {mod.loaders.map((loader) => (
            <span
              key={loader}
              className="bg-slate-800 px-2 py-0.5 rounded text-green-400 border border-green-700"
            >
              {loader.charAt(0).toUpperCase() + loader.slice(1)}
            </span>
          ))}
        </div>
      </div>
      {/* Right stats */}
      <div className="flex flex-col items-end gap-2 min-w-[120px]">
        <span className="flex items-center gap-1 text-green-200 text-sm">
          <FiDownload className="text-green-400" />
          <span className="font-semibold">{formatNumber(mod.downloads)}</span>
          <span className="text-xs text-slate-400">downloads</span>
        </span>
        <span className="flex items-center gap-1 text-slate-400 text-xs">
          <FiClock className="text-slate-400" />
          Updated {timeAgo(mod.updated)}
        </span>
      </div>
      {/* Star button */}
      <button
        className="ml-4 p-2 rounded-full hover:bg-yellow-200/10 transition-colors text-yellow-400 text-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 absolute right-4 top-1/2 -translate-y-1/2"
        title="Favorite"
        tabIndex={0}
        aria-label="Favorite mod"
        type="button"
      >
        <FiStar />
      </button>
    </div>
  );
} 