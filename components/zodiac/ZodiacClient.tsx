"use client";

import { useState, useMemo } from "react";
import { ZODIACS, getDailyFortune, type ZodiacAnimal, type DailyFortune } from "@/data/zodiac";

function getKoreaDate(): string {
  return new Date().toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\.\s*/g, "-").replace(/-$/, "");
}

function Stars({ score }: { score: number }) {
  return (
    <span className="text-amber-400 text-sm tracking-tight">
      {"★".repeat(score)}
      <span className="text-violet-800">{"★".repeat(5 - score)}</span>
    </span>
  );
}

const CATEGORIES = [
  { key: "general" as const, label: "총운", emoji: "🔮" },
  { key: "love" as const, label: "연애운", emoji: "💕" },
  { key: "work" as const, label: "직장운", emoji: "💼" },
  { key: "money" as const, label: "금전운", emoji: "💰" },
  { key: "health" as const, label: "건강운", emoji: "🌿" },
];

function FortunePanel({ animal, fortune }: { animal: ZodiacAnimal; fortune: DailyFortune }) {
  return (
    <div className="mt-2 animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 p-4 bg-card-alt border border-violet-900/40 rounded-2xl">
        <span className="text-4xl">{animal.emoji}</span>
        <div>
          <h2 className="text-lg font-bold text-white">{animal.name}띠 오늘의 운세</h2>
          <p className="text-violet-500 text-xs mt-0.5">{animal.trait}</p>
        </div>
      </div>

      {/* Score row */}
      <div className="grid grid-cols-5 gap-1.5 mb-5">
        {CATEGORIES.map(({ key, label, emoji }) => (
          <div key={key} className="bg-card border border-violet-900/40 rounded-xl p-2 text-center">
            <div className="text-base mb-1">{emoji}</div>
            <div className="text-[10px] text-violet-500 mb-1">{label}</div>
            <Stars score={fortune.scores[key]} />
          </div>
        ))}
      </div>

      {/* Fortune text */}
      <div className="space-y-3">
        {CATEGORIES.map(({ key, label, emoji }) => (
          <div key={key} className="bg-card border border-violet-900/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{emoji}</span>
              <span className="text-sm font-semibold text-white">{label}</span>
              <Stars score={fortune.scores[key]} />
            </div>
            <p className="text-sm text-violet-200 leading-relaxed">{fortune[key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ZodiacClient() {
  const [selected, setSelected] = useState<ZodiacAnimal | null>(null);
  const today = useMemo(() => getKoreaDate(), []);
  const fortune = useMemo(
    () => (selected ? getDailyFortune(selected.id, today) : null),
    [selected, today]
  );

  const handleSelect = (animal: ZodiacAnimal) => {
    if (selected?.id === animal.id) {
      setSelected(null);
    } else {
      setSelected(animal);
      setTimeout(() => {
        document.getElementById("fortune-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🐉</div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">띠별 운세</h1>
        <p className="text-violet-400 text-sm">내 띠를 선택하면 오늘의 운세를 알 수 있어요</p>
        <p className="text-violet-600 text-xs mt-1">{today.replace(/-/g, ".")} 기준</p>
      </div>

      {/* Animal grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {ZODIACS.map((animal) => (
          <button
            key={animal.id}
            onClick={() => handleSelect(animal)}
            className={`flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl border transition-all active:scale-95 ${
              selected?.id === animal.id
                ? "bg-violet-600 border-violet-500"
                : "bg-card border-violet-900/50 hover:border-violet-500/50 hover:bg-card-alt"
            }`}
          >
            <span className="text-2xl">{animal.emoji}</span>
            <span className={`text-xs font-bold ${selected?.id === animal.id ? "text-white" : "text-violet-300"}`}>
              {animal.name}띠
            </span>
            <span className="text-[10px] text-violet-600 leading-tight text-center">
              {animal.years.slice(0, 3).join(" · ")}
            </span>
          </button>
        ))}
      </div>

      {/* Fortune panel */}
      {selected && fortune && (
        <div id="fortune-panel">
          <FortunePanel animal={selected} fortune={fortune} />
        </div>
      )}

      {!selected && (
        <div className="text-center py-12">
          <p className="text-violet-600 text-sm">위에서 내 띠를 선택해주세요 🐾</p>
        </div>
      )}
    </div>
  );
}
