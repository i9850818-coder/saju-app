"use client";

import { useState } from "react";
import { SIJU_OPTIONS, calcCompat, type CompatResult } from "@/data/compatibility";

type Person = {
  name: string;
  year: string;
  month: string;
  day: string;
  siju: string;
};

const EMPTY_PERSON: Person = { name: "", year: "", month: "", day: "", siju: "모름" };

const CATEGORIES = [
  { key: "love" as const, label: "사랑 궁합", emoji: "💕" },
  { key: "trust" as const, label: "신뢰 궁합", emoji: "🤝" },
  { key: "communication" as const, label: "소통 궁합", emoji: "💬" },
  { key: "future" as const, label: "미래 궁합", emoji: "🌟" },
];

function Stars({ score }: { score: number }) {
  return (
    <span className="text-amber-400 text-base tracking-tight">
      {"★".repeat(score)}
      <span className="text-violet-200">{"★".repeat(5 - score)}</span>
    </span>
  );
}

function ScoreRing({ total }: { total: number }) {
  const color =
    total >= 85 ? "text-rose-500" :
    total >= 70 ? "text-violet-600" :
    total >= 55 ? "text-amber-500" :
    "text-slate-500";

  const label =
    total >= 85 ? "천생연분 💘" :
    total >= 70 ? "좋은 궁합 💕" :
    total >= 55 ? "보통 궁합 💛" :
    "노력형 궁합 🤍";

  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <div className={`text-7xl font-black ${color}`}>{total}점</div>
      <div className="text-violet-700 font-semibold text-lg">{label}</div>
    </div>
  );
}

function PersonForm({
  label,
  emoji,
  color,
  person,
  onChange,
}: {
  label: string;
  emoji: string;
  color: string;
  person: Person;
  onChange: (p: Person) => void;
}) {
  const set = (k: keyof Person) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...person, [k]: e.target.value });

  const inputCls = "w-full bg-violet-50 border border-violet-200 rounded-xl px-3 py-2.5 text-violet-950 text-sm placeholder-violet-400 focus:outline-none focus:border-violet-500";

  return (
    <div className={`bg-white border-2 ${color} rounded-2xl p-4`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{emoji}</span>
        <span className="font-bold text-violet-950">{label}</span>
      </div>

      {/* 이름 */}
      <div className="mb-3">
        <label className="text-xs text-violet-600 font-medium mb-1 block">이름 (선택)</label>
        <input
          type="text"
          placeholder="이름을 입력하세요"
          value={person.name}
          onChange={set("name")}
          className={inputCls}
        />
      </div>

      {/* 생년월일 */}
      <div className="mb-3">
        <label className="text-xs text-violet-600 font-medium mb-1 block">생년월일</label>
        <div className="flex gap-1.5">
          <input
            type="number"
            placeholder="년도"
            value={person.year}
            onChange={(e) => onChange({ ...person, year: e.target.value.slice(0, 4) })}
            className={`${inputCls} flex-[2] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
          <input
            type="number"
            placeholder="월"
            min={1} max={12}
            value={person.month}
            onChange={set("month")}
            className={`${inputCls} flex-1 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
          <input
            type="number"
            placeholder="일"
            min={1} max={31}
            value={person.day}
            onChange={set("day")}
            className={`${inputCls} flex-1 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
        </div>
      </div>

      {/* 생시 */}
      <div>
        <label className="text-xs text-violet-600 font-medium mb-1 block">생시</label>
        <select
          value={person.siju}
          onChange={set("siju")}
          className="w-full bg-violet-50 border border-violet-200 rounded-xl px-3 py-2.5 text-violet-950 text-sm focus:outline-none focus:border-violet-500 appearance-none cursor-pointer"
        >
          {SIJU_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function ResultPanel({ p1, p2, result }: { p1: Person; p2: Person; result: CompatResult }) {
  const name1 = p1.name || "나";
  const name2 = p2.name || "상대방";

  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      {/* 총점 */}
      <div className="bg-white border border-violet-200 rounded-2xl text-center mb-5 overflow-hidden">
        <div className="bg-gradient-to-r from-violet-100 to-pink-100 px-4 py-3 border-b border-violet-100">
          <p className="text-sm font-semibold text-violet-700">
            {name1} × {name2} 궁합
          </p>
        </div>
        <ScoreRing total={result.scores.total} />
        <p className="text-violet-600 text-sm px-5 pb-5 leading-relaxed">
          {result.oneliner}
        </p>
      </div>

      {/* 전체 궁합 설명 */}
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-5">
        <p className="text-sm text-violet-800 leading-relaxed">{result.general}</p>
      </div>

      {/* 카테고리별 점수 */}
      <div className="grid grid-cols-2 gap-1.5 mb-5">
        {CATEGORIES.map(({ key, label, emoji }) => (
          <div key={key} className="bg-white border border-violet-200 rounded-xl p-3 flex items-center gap-2">
            <span className="text-lg">{emoji}</span>
            <div>
              <p className="text-[11px] text-violet-600 font-medium">{label}</p>
              <Stars score={result.scores[key]} />
            </div>
          </div>
        ))}
      </div>

      {/* 카테고리별 설명 */}
      <div className="space-y-3">
        {CATEGORIES.map(({ key, label, emoji }) => (
          <div key={key} className="bg-white border border-violet-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{emoji}</span>
              <span className="text-sm font-semibold text-violet-950">{label}</span>
              <Stars score={result.scores[key]} />
            </div>
            <p className="text-sm text-violet-700 leading-relaxed">{result[key]}</p>
          </div>
        ))}
      </div>

      {/* 다시 보기 */}
      <div className="text-center mt-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="px-6 py-3 rounded-2xl bg-white border border-violet-300 text-violet-600 hover:text-violet-900 hover:border-violet-500 hover:bg-violet-50 text-sm transition-all active:scale-95"
        >
          🔄 다시 입력하기
        </button>
      </div>
    </div>
  );
}

function isValid(p: Person) {
  return (
    p.year.length === 4 &&
    Number(p.year) >= 1900 &&
    Number(p.year) <= 2030 &&
    Number(p.month) >= 1 &&
    Number(p.month) <= 12 &&
    Number(p.day) >= 1 &&
    Number(p.day) <= 31
  );
}

export default function CompatClient() {
  const [p1, setP1] = useState<Person>({ ...EMPTY_PERSON });
  const [p2, setP2] = useState<Person>({ ...EMPTY_PERSON });
  const [result, setResult] = useState<CompatResult | null>(null);

  const canSubmit = isValid(p1) && isValid(p2);

  const handleSubmit = () => {
    if (!canSubmit) return;
    const birth1 = `${p1.year}-${p1.month.padStart(2,"0")}-${p1.day.padStart(2,"0")}`;
    const birth2 = `${p2.year}-${p2.month.padStart(2,"0")}-${p2.day.padStart(2,"0")}`;
    setResult(calcCompat(
      { birth: birth1, siju: p1.siju },
      { birth: birth2, siju: p2.siju }
    ));
    setTimeout(() => {
      document.getElementById("compat-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">💕</div>
        <h1 className="text-2xl md:text-3xl font-bold text-violet-950 mb-2">궁합</h1>
        <p className="text-violet-600 text-sm">두 사람의 사주로 알아보는 운명적 궁합</p>
      </div>

      {/* Forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <PersonForm
          label="나"
          emoji="💙"
          color="border-blue-200"
          person={p1}
          onChange={(p) => { setP1(p); setResult(null); }}
        />
        <PersonForm
          label="상대방"
          emoji="💗"
          color="border-pink-200"
          person={p2}
          onChange={(p) => { setP2(p); setResult(null); }}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-500 hover:to-pink-400 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-300/40 active:scale-[0.98] mb-8"
      >
        💕 궁합 보기
      </button>

      {/* Result */}
      {result && (
        <div id="compat-result">
          <ResultPanel p1={p1} p2={p2} result={result} />
        </div>
      )}
    </div>
  );
}
