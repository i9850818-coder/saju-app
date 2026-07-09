"use client";

import { useState } from "react";
import { SIJU_OPTIONS } from "@/data/compatibility";

// ─── 타입 ────────────────────────────────────────────────────────────
type Pillar = { stem: string; branch: string; combined: string };

type SajuResult = {
  pillars: Record<"year" | "month" | "day" | "hour", Pillar>;
  five_elements: Record<"wood" | "fire" | "earth" | "metal" | "water", number>;
  element_tags: string[];
  birth_info: { date: string; time: string; solar_time: string | null; siju: string };
  interpretations: Array<{
    condition_value: string;
    category: string;
    title: string;
    content: string;
    summary: string;
    weight: number;
  }>;
};

// ─── 상수 ────────────────────────────────────────────────────────────
const PILLARS = [
  { key: "year",  label: "연주", sub: "年柱" },
  { key: "month", label: "월주", sub: "月柱" },
  { key: "day",   label: "일주", sub: "日柱" },
  { key: "hour",  label: "시주", sub: "時柱" },
] as const;

const ELEMENTS = {
  wood:  { ko: "목(木)", emoji: "🌿", bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  fire:  { ko: "화(火)", emoji: "🔥", bar: "bg-rose-500",    badge: "bg-rose-100 text-rose-700 border-rose-200" },
  earth: { ko: "토(土)", emoji: "🪨", bar: "bg-amber-500",   badge: "bg-amber-100 text-amber-700 border-amber-200" },
  metal: { ko: "금(金)", emoji: "⚙️", bar: "bg-slate-400",   badge: "bg-slate-100 text-slate-600 border-slate-200" },
  water: { ko: "수(水)", emoji: "💧", bar: "bg-blue-500",    badge: "bg-blue-100 text-blue-700 border-blue-200" },
} as const;

const CATEGORIES = [
  { key: "general", label: "종합 기질", emoji: "🔮" },
  { key: "career",  label: "직업 성향", emoji: "💼" },
  { key: "love",    label: "연애 성향", emoji: "💕" },
  { key: "wealth",  label: "재물 성향", emoji: "💰" },
  { key: "health",  label: "건강 성향", emoji: "🌿" },
] as const;

const STATE_KO: Record<string, string> = {
  excess: "과다", balanced: "균형", deficient: "부족",
};

// ─── 서브 컴포넌트 ──────────────────────────────────────────────────
function PillarCard({ pillar, label, sub }: { pillar: Pillar; label: string; sub: string }) {
  return (
    <div className="flex-1 bg-gradient-to-b from-violet-50 to-white border border-violet-200 rounded-2xl py-4 px-2 text-center min-w-0">
      <p className="text-[10px] text-violet-400 mb-0.5">{sub}</p>
      <p className="text-xs text-violet-600 font-medium mb-2">{label}</p>
      <p className="text-2xl font-bold text-violet-950 tracking-wider leading-tight">
        {pillar.stem}
      </p>
      <p className="text-xl text-violet-700 tracking-wider">{pillar.branch}</p>
    </div>
  );
}

function ElementBar({ name, count, total }: { name: keyof typeof ELEMENTS; count: number; total: number }) {
  const el = ELEMENTS[name];
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm w-14 text-violet-700 font-medium shrink-0">{el.ko}</span>
      <div className="flex-1 h-2.5 bg-violet-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${el.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-violet-500 w-4 text-right shrink-0">{count}</span>
    </div>
  );
}

function CategoryTab({
  result,
  activeTab,
  setTab,
}: {
  result: SajuResult;
  activeTab: string;
  setTab: (t: string) => void;
}) {
  const catItems = result.interpretations.filter(
    (i) => i.category === activeTab && !i.condition_value.endsWith("_balanced")
  );

  return (
    <div className="bg-white border border-violet-200 rounded-2xl overflow-hidden">
      {/* 탭 헤더 */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-violet-100">
        {CATEGORIES.map((cat) => {
          const active = activeTab === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setTab(cat.key)}
              className={`flex-1 flex flex-col items-center py-3 px-2 text-xs font-medium transition-colors whitespace-nowrap min-w-[60px] ${
                active
                  ? "bg-violet-600 text-white"
                  : "text-violet-500 hover:text-violet-700 hover:bg-violet-50"
              }`}
            >
              <span className="text-base mb-0.5">{cat.emoji}</span>
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 탭 내용 */}
      <div className="p-4 space-y-3 animate-[fadeIn_0.3s_ease]">
        {catItems.length === 0 ? (
          <p className="text-sm text-violet-400 text-center py-4">해석 데이터가 없습니다.</p>
        ) : (
          catItems.map((item) => {
            const elemKey = item.condition_value.split("_")[0] as keyof typeof ELEMENTS;
            const stateKey = item.condition_value.split("_")[1];
            const el = ELEMENTS[elemKey];
            if (!el) return null;
            return (
              <div key={item.condition_value} className="flex gap-3">
                <span
                  className={`shrink-0 mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${el.badge} h-fit`}
                >
                  {el.ko} {STATE_KO[stateKey] ?? stateKey}
                </span>
                <p className="text-sm text-violet-800 leading-relaxed">{item.summary}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ──────────────────────────────────────────────────
export default function SajuClient() {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [siju, setSiju] = useState("모름");
  const [gender, setGender] = useState<"male" | "female">("female");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SajuResult | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  const canSubmit =
    year.length === 4 &&
    Number(year) >= 1900 &&
    Number(year) <= 2025 &&
    Number(month) >= 1 &&
    Number(month) <= 12 &&
    Number(day) >= 1 &&
    Number(day) <= 31;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/saju/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: Number(year),
          month: Number(month),
          day: Number(day),
          siju,
          gender,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "오류가 발생했습니다.");
      setResult(data);
      setActiveTab("general");
      setTimeout(() => {
        document.getElementById("saju-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const totalElements = result
    ? Object.values(result.five_elements).reduce((a, b) => a + b, 0)
    : 8;

  const inputCls =
    "w-full bg-violet-50 border border-violet-200 rounded-xl px-3 py-2.5 text-violet-950 text-sm placeholder-violet-400 focus:outline-none focus:border-violet-500 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      {/* 히어로 */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">✨</div>
        <h1 className="text-2xl md:text-3xl font-bold text-violet-950 mb-2">사주로 보는 나의 기질</h1>
        <p className="text-violet-600 text-sm">오행으로 알아보는 타고난 성향과 재능</p>
      </div>

      {/* 입력 폼 */}
      <div className="bg-white border border-violet-200 rounded-2xl p-5 mb-5">
        {/* 이름 */}
        <div className="mb-4">
          <label className="text-xs text-violet-600 font-medium mb-1.5 block">이름 (선택)</label>
          <input
            type="text"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-violet-50 border border-violet-200 rounded-xl px-3 py-2.5 text-violet-950 text-sm placeholder-violet-400 focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* 생년월일 */}
        <div className="mb-4">
          <label className="text-xs text-violet-600 font-medium mb-1.5 block">생년월일</label>
          <div className="flex gap-2">
            <input type="number" placeholder="년도" value={year}
              onChange={(e) => setYear(e.target.value.slice(0, 4))}
              className={`${inputCls} flex-[2]`} />
            <input type="number" placeholder="월" min={1} max={12} value={month}
              onChange={(e) => setMonth(e.target.value)}
              className={`${inputCls} flex-1`} />
            <input type="number" placeholder="일" min={1} max={31} value={day}
              onChange={(e) => setDay(e.target.value)}
              className={`${inputCls} flex-1`} />
          </div>
        </div>

        {/* 생시 + 성별 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-violet-600 font-medium mb-1.5 block">태어난 시</label>
            <select
              value={siju}
              onChange={(e) => setSiju(e.target.value)}
              className="w-full bg-violet-50 border border-violet-200 rounded-xl px-3 py-2.5 text-violet-950 text-sm focus:outline-none focus:border-violet-500 appearance-none cursor-pointer"
            >
              {SIJU_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-violet-600 font-medium mb-1.5 block">성별</label>
            <div className="flex gap-2 h-[42px]">
              {(["female", "male"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 rounded-xl text-sm font-medium border transition-all ${
                    gender === g
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-violet-50 text-violet-600 border-violet-200 hover:border-violet-400"
                  }`}
                >
                  {g === "female" ? "여성" : "남성"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 제출 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
        className="w-full py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-300/40 active:scale-[0.98] mb-8"
      >
        {loading ? "✨ 사주 분석 중..." : "✨ 내 사주 보기"}
      </button>

      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-700 text-center">
          {error}
        </div>
      )}

      {/* 결과 */}
      {result && (
        <div id="saju-result" className="space-y-5 animate-[fadeIn_0.4s_ease]">

          {/* 사주팔자 4기둥 */}
          <div className="bg-white border border-violet-200 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3">
              <p className="text-white font-bold text-sm text-center">
                {name ? `${name}님의 ` : ""}사주팔자
              </p>
              <p className="text-violet-200 text-xs text-center mt-0.5">
                {result.birth_info.date} · {result.birth_info.siju}
                {result.birth_info.solar_time && ` (태양시 ${result.birth_info.solar_time})`}
              </p>
            </div>
            <div className="flex gap-2 p-4">
              {PILLARS.map(({ key, label, sub }) => (
                <PillarCard
                  key={key}
                  pillar={result.pillars[key]}
                  label={label}
                  sub={sub}
                />
              ))}
            </div>
          </div>

          {/* 오행 분포 */}
          <div className="bg-white border border-violet-200 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-violet-950 mb-4 flex items-center gap-2">
              <span>⚖️</span> 오행 분포
            </h3>
            <div className="space-y-2.5">
              {(Object.keys(ELEMENTS) as (keyof typeof ELEMENTS)[]).map((el) => (
                <ElementBar
                  key={el}
                  name={el}
                  count={result.five_elements[el]}
                  total={totalElements}
                />
              ))}
            </div>
            {/* 태그 뱃지 */}
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-violet-100">
              {result.element_tags
                .filter((t) => !t.endsWith("_balanced"))
                .map((tag) => {
                  const elemKey = tag.split("_")[0] as keyof typeof ELEMENTS;
                  const stateKey = tag.split("_")[1];
                  const el = ELEMENTS[elemKey];
                  if (!el) return null;
                  return (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${el.badge}`}
                    >
                      {el.ko} {STATE_KO[stateKey]}
                    </span>
                  );
                })}
            </div>
          </div>

          {/* 운세 해석 */}
          <CategoryTab result={result} activeTab={activeTab} setTab={setActiveTab} />

          {/* 유료 CTA */}
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-5 text-center">
            <p className="text-white font-bold text-base mb-1">🔮 올해 운세 AI 분석</p>
            <p className="text-violet-200 text-sm mb-4 leading-relaxed">
              내 기질 위에 올해 세운(歲運)을 얹어<br />
              Claude AI가 2026년 맞춤 운세를 풀어드립니다.
            </p>
            <button className="bg-white text-violet-700 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-violet-50 transition-colors opacity-60 cursor-not-allowed">
              준비 중 — 곧 만나보세요
            </button>
          </div>

          {/* 다시 하기 */}
          <div className="text-center pb-4">
            <button
              onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="px-6 py-3 rounded-2xl bg-white border border-violet-300 text-violet-600 hover:border-violet-500 hover:bg-violet-50 text-sm transition-all active:scale-95"
            >
              🔄 다시 입력하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
