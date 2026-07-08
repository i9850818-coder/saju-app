"use client";

import { useState, useMemo } from "react";
import {
  DREAM_DATA,
  DREAM_CATEGORIES,
  CATEGORY_EMOJI,
  type DreamEntry,
  type DreamCategory,
} from "@/data/dreams";
import DreamModal from "./DreamModal";

type CategoryFilter = DreamCategory | "전체";

export default function DreamClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("전체");
  const [selected, setSelected] = useState<DreamEntry | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim();
    return DREAM_DATA.filter((entry) => {
      const matchCat = activeCategory === "전체" || entry.category === activeCategory;
      const matchQ =
        !q ||
        entry.keyword.includes(q) ||
        entry.tags.some((t) => t.includes(q)) ||
        entry.summary.includes(q) ||
        entry.scenarios.some((s) => s.condition.includes(q));
      return matchCat && matchQ;
    });
  }, [search, activeCategory]);

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🌙</div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">꿈해몽</h1>
        <p className="text-violet-400 text-sm">꿈에 나타난 키워드를 검색하거나 카테고리를 선택하세요</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="꿈 키워드 검색... (예: 뱀, 이빨, 홍수)"
          className="w-full bg-card border border-violet-900/50 focus:border-violet-500 rounded-2xl pl-10 pr-10 py-3.5 text-white placeholder-violet-600 outline-none transition-colors text-sm"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-500 hover:text-violet-300 transition-colors"
            aria-label="검색어 지우기"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        <button
          onClick={() => setActiveCategory("전체")}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === "전체"
              ? "bg-violet-600 text-white"
              : "bg-card border border-violet-900/50 text-violet-400 hover:text-white"
          }`}
        >
          🔮 전체
        </button>
        {DREAM_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-violet-600 text-white"
                : "bg-card border border-violet-900/50 text-violet-400 hover:text-white"
            }`}
          >
            {CATEGORY_EMOJI[cat]} {cat}
          </button>
        ))}
      </div>

      {/* Result count */}
      {search && (
        <p className="text-violet-500 text-xs mb-4">
          &ldquo;{search}&rdquo; 검색 결과 {filtered.length}개
        </p>
      )}

      {/* Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {filtered.map((entry) => (
            <button
              key={entry.id}
              onClick={() => setSelected(entry)}
              className="group bg-card hover:bg-card-alt border border-violet-900/50 hover:border-violet-500/50 rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-900/30 active:scale-95"
            >
              <span className="text-3xl">{entry.emoji}</span>
              <span className="text-[11px] font-medium text-violet-300 group-hover:text-white leading-tight text-center">
                {entry.keyword}
              </span>
              <span className="text-[10px] text-violet-600 leading-tight text-center line-clamp-1">
                {entry.scenarios.length}가지 해몽
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-violet-400 font-medium">검색 결과가 없어요</p>
          <p className="text-violet-600 text-sm mt-1">다른 키워드로 검색해 보세요</p>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <DreamModal entry={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
