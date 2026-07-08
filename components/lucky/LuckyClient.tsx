"use client";

import { useState, useMemo } from "react";
import { seedHash } from "@/lib/seed";

function getWeekKey(): string {
  const seoulStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
  const seoul = new Date(seoulStr);
  const day = seoul.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(seoul);
  monday.setDate(seoul.getDate() + diff);
  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, "0");
  const d = String(monday.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getWeekRange(): string {
  const seoulStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
  const seoul = new Date(seoulStr);
  const day = seoul.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(seoul);
  monday.setDate(seoul.getDate() + diff);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${monday.getFullYear()}년 ${fmt(monday)} ~ ${fmt(sunday)}`;
}

function pickLuckyNumbers(seed: number): number[] {
  const nums = new Set<number>();
  let s = seed;
  while (nums.size < 6) {
    s = ((s * 1664525) + 1013904223) >>> 0;
    nums.add((s % 45) + 1);
  }
  return [...nums].sort((a, b) => a - b);
}

function ballStyle(n: number): string {
  if (n <= 10) return "bg-amber-400 text-amber-950 shadow-amber-300/60";
  if (n <= 20) return "bg-sky-500 text-white shadow-sky-300/60";
  if (n <= 30) return "bg-rose-500 text-white shadow-rose-300/60";
  if (n <= 40) return "bg-zinc-500 text-white shadow-zinc-300/60";
  return "bg-emerald-500 text-white shadow-emerald-300/60";
}

function LuckyBall({ n, delay }: { n: number; delay: number }) {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-black text-lg md:text-xl shadow-lg animate-[fadeIn_0.4s_ease_both] ${ballStyle(n)}`}
      style={{ animationDelay: `${delay}ms`, width: "3.25rem", height: "3.25rem" }}
    >
      {n}
    </div>
  );
}

export default function LuckyClient() {
  const weekKey = useMemo(() => getWeekKey(), []);
  const weekRange = useMemo(() => getWeekRange(), []);

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [numbers, setNumbers] = useState<number[] | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const isValid =
    year.length === 4 &&
    Number(year) >= 1900 &&
    Number(year) <= 2030 &&
    Number(month) >= 1 &&
    Number(month) <= 12 &&
    Number(day) >= 1 &&
    Number(day) <= 31;

  const generate = () => {
    if (!isValid) return;
    const birthdate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const seed = seedHash(`lucky:${birthdate}:${weekKey}`);
    setNumbers(pickLuckyNumbers(seed));
    setAnimKey((k) => k + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") generate();
  };

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-6">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🍀</div>
        <h1 className="text-2xl md:text-3xl font-bold text-violet-950 mb-2">행운의 번호</h1>
        <p className="text-violet-600 text-sm">사주로 뽑은 이번 주 행운의 번호</p>
        <div className="inline-flex items-center gap-1.5 mt-2 bg-violet-100 border border-violet-200 rounded-full px-3 py-1">
          <span className="text-[10px] text-violet-600">📅 {weekRange}</span>
        </div>
      </div>

      {/* Input card */}
      <div className="bg-white border border-violet-200 rounded-2xl p-5 mb-5">
        <p className="text-sm font-semibold text-violet-800 mb-4 text-center">생년월일 입력</p>
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            placeholder="출생년도"
            value={year}
            onChange={(e) => setYear(e.target.value.slice(0, 4))}
            onKeyDown={handleKeyDown}
            className="flex-[2] bg-violet-50 border border-violet-200 rounded-xl px-3 py-3 text-violet-950 text-sm placeholder-violet-400 focus:outline-none focus:border-violet-500 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <input
            type="number"
            placeholder="월"
            min={1}
            max={12}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-violet-50 border border-violet-200 rounded-xl px-3 py-3 text-violet-950 text-sm placeholder-violet-400 focus:outline-none focus:border-violet-500 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <input
            type="number"
            placeholder="일"
            min={1}
            max={31}
            value={day}
            onChange={(e) => setDay(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-violet-50 border border-violet-200 rounded-xl px-3 py-3 text-violet-950 text-sm placeholder-violet-400 focus:outline-none focus:border-violet-500 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <button
          onClick={generate}
          disabled={!isValid}
          className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-300/40 active:scale-[0.98]"
        >
          🍀 이번 주 행운 번호 뽑기
        </button>
      </div>

      {/* Result */}
      {numbers ? (
        <div key={animKey} className="bg-white border border-violet-200 rounded-2xl p-6 text-center animate-[fadeIn_0.3s_ease]">
          <p className="text-violet-600 text-xs mb-0.5">이번 주 나의 행운 번호</p>
          <p className="text-violet-800 font-semibold text-sm mb-6">{weekRange}</p>

          <div className="flex justify-center gap-2.5 mb-6 flex-wrap">
            {numbers.map((n, i) => (
              <LuckyBall key={n} n={n} delay={i * 80} />
            ))}
          </div>

          {/* Color guide */}
          <div className="flex justify-center flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-violet-500 mb-4">
            {[
              { color: "bg-amber-400", label: "1–10" },
              { color: "bg-sky-500", label: "11–20" },
              { color: "bg-rose-500", label: "21–30" },
              { color: "bg-zinc-500", label: "31–40" },
              { color: "bg-emerald-500", label: "41–45" },
            ].map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full inline-block ${color}`} />
                {label}
              </span>
            ))}
          </div>

          <p className="text-violet-400 text-[11px]">
            매주 월요일 자동 갱신 · 같은 생년월일은 같은 번호
          </p>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-violet-500 text-sm">생년월일을 입력하고 번호를 뽑아보세요 🎱</p>
        </div>
      )}
    </div>
  );
}
