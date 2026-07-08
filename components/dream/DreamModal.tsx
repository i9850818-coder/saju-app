"use client";

import { useEffect } from "react";
import type { DreamEntry, DreamType } from "@/data/dreams";

const TYPE_STYLE: Record<DreamType, string> = {
  길몽: "bg-emerald-100 text-emerald-700 border border-emerald-300",
  흉몽: "bg-rose-100 text-rose-700 border border-rose-300",
  혼재: "bg-amber-100 text-amber-700 border border-amber-300",
};

const TYPE_ICON: Record<DreamType, string> = {
  길몽: "✨",
  흉몽: "⚠️",
  혼재: "🔀",
};

export default function DreamModal({
  entry,
  onClose,
}: {
  entry: DreamEntry;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="relative w-full md:max-w-lg bg-white border border-violet-200 rounded-t-3xl md:rounded-3xl max-h-[85vh] overflow-y-auto shadow-2xl shadow-violet-200/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar (mobile only) */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-violet-300 rounded-full" />
        </div>

        <div className="p-5 pb-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{entry.emoji}</span>
              <div>
                <h2 className="text-xl font-bold text-violet-950">{entry.keyword} 꿈</h2>
                <span className="text-xs text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full mt-0.5 inline-block">
                  {entry.category}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-violet-400 hover:text-violet-700 transition-colors p-1 text-lg leading-none"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          {/* Summary */}
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 mb-5">
            <p className="text-violet-700 text-sm leading-relaxed">{entry.summary}</p>
          </div>

          {/* Scenarios */}
          <div className="space-y-3">
            {entry.scenarios.map((s, i) => (
              <div key={i} className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-violet-950 leading-snug">{s.condition}</p>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${TYPE_STYLE[s.type]}`}
                  >
                    {TYPE_ICON[s.type]} {s.type}
                  </span>
                </div>
                <p className="text-sm text-violet-700 leading-relaxed">{s.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
