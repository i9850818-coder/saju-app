"use client";

import { useState, type ReactNode } from "react";
import { SIJU_OPTIONS } from "@/data/compatibility";

// ─── 타입 ────────────────────────────────────────────────────────────
type Pillar = { stem: string; branch: string; combined: string };

type Interpretation = {
  condition_value: string;
  category: string;
  title: string;
  content: string;
  summary: string;
  weight: number;
};

type SajuResult = {
  pillars: Record<"year" | "month" | "day" | "hour", Pillar>;
  five_elements: Record<"wood" | "fire" | "earth" | "metal" | "water", number>;
  element_tags: string[];
  birth_info: { date: string; time: string; solar_time: string | null; siju: string };
  interpretations: Interpretation[];
  day_pillar_interpretations: Interpretation[];
};

// ─── 상수 ────────────────────────────────────────────────────────────
const PILLARS = [
  { key: "year",  label: "연주", sub: "年柱" },
  { key: "month", label: "월주", sub: "月柱" },
  { key: "day",   label: "일주", sub: "日柱" },
  { key: "hour",  label: "시주", sub: "時柱" },
] as const;

const ELEMENTS = {
  wood:  { ko: "목(木)", emoji: "🌿", bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700 border-emerald-200", lightBg: "bg-emerald-50", textColor: "text-emerald-700", donut: "#10b981" },
  fire:  { ko: "화(火)", emoji: "🔥", bar: "bg-rose-500",    badge: "bg-rose-100 text-rose-700 border-rose-200",          lightBg: "bg-rose-50",    textColor: "text-rose-600",    donut: "#f43f5e" },
  earth: { ko: "토(土)", emoji: "🪨", bar: "bg-amber-500",   badge: "bg-amber-100 text-amber-700 border-amber-200",        lightBg: "bg-amber-50",   textColor: "text-amber-700",   donut: "#f59e0b" },
  metal: { ko: "금(金)", emoji: "⚙️", bar: "bg-slate-400",   badge: "bg-slate-100 text-slate-600 border-slate-200",        lightBg: "bg-slate-50",   textColor: "text-slate-600",   donut: "#94a3b8" },
  water: { ko: "수(水)", emoji: "💧", bar: "bg-blue-500",    badge: "bg-blue-100 text-blue-700 border-blue-200",           lightBg: "bg-blue-50",    textColor: "text-blue-600",    donut: "#3b82f6" },
} as const;

const STEM_TO_ELEMENT: Record<string, keyof typeof ELEMENTS> = {
  "甲": "wood", "乙": "wood", "丙": "fire", "丁": "fire", "戊": "earth",
  "己": "earth", "庚": "metal", "辛": "metal", "壬": "water", "癸": "water",
};
const BRANCH_TO_ELEMENT: Record<string, keyof typeof ELEMENTS> = {
  "子": "water", "丑": "earth", "寅": "wood", "卯": "wood", "辰": "earth",
  "巳": "fire",  "午": "fire",  "未": "earth", "申": "metal", "酉": "metal",
  "戌": "earth", "亥": "water",
};
const STEM_KOR: Record<string, string> = {
  "甲": "갑", "乙": "을", "丙": "병", "丁": "정", "戊": "무",
  "己": "기", "庚": "경", "辛": "신", "壬": "임", "癸": "계",
};
const BRANCH_KOR: Record<string, string> = {
  "子": "자", "丑": "축", "寅": "인", "卯": "묘", "辰": "진", "巳": "사",
  "午": "오", "未": "미", "申": "신", "酉": "유", "戌": "술", "亥": "해",
};

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

// ─── 사주팔자 기둥 카드 ──────────────────────────────────────────────
function PillarCard({ pillar, label, sub }: { pillar: Pillar; label: string; sub: string }) {
  const stemElem = STEM_TO_ELEMENT[pillar.stem];
  const branchElem = BRANCH_TO_ELEMENT[pillar.branch];
  const stemEl = stemElem ? ELEMENTS[stemElem] : null;
  const branchEl = branchElem ? ELEMENTS[branchElem] : null;

  return (
    <div className="flex-1 bg-white border border-violet-200 rounded-2xl overflow-hidden text-center min-w-0">
      {/* 기둥 헤더 */}
      <div className="bg-gradient-to-b from-violet-100 to-violet-50 py-2 border-b border-violet-100">
        <p className="text-[9px] text-violet-400">{sub}</p>
        <p className="text-[11px] text-violet-700 font-semibold">{label}</p>
      </div>
      {/* 천간 */}
      <div className={`py-2.5 border-b border-violet-100 ${stemEl?.lightBg ?? "bg-violet-50"}`}>
        <p className="text-[8px] text-violet-400 mb-0.5">天干</p>
        <p className={`text-[26px] font-bold leading-none ${stemEl?.textColor ?? "text-violet-950"}`}>
          {pillar.stem}
        </p>
        <p className="text-[9px] text-violet-500 mt-1 leading-tight">
          {STEM_KOR[pillar.stem]}<br />{stemEl?.ko}
        </p>
      </div>
      {/* 지지 */}
      <div className={`py-2.5 ${branchEl?.lightBg ?? "bg-white"}`}>
        <p className="text-[8px] text-violet-400 mb-0.5">地支</p>
        <p className={`text-[26px] font-bold leading-none ${branchEl?.textColor ?? "text-violet-950"}`}>
          {pillar.branch}
        </p>
        <p className="text-[9px] text-violet-500 mt-1 leading-tight">
          {BRANCH_KOR[pillar.branch]}<br />{branchEl?.ko}
        </p>
      </div>
    </div>
  );
}

// ─── 오행 도넛 차트 (SVG) ────────────────────────────────────────────
function ElementDonut({
  five_elements,
  element_tags,
}: {
  five_elements: SajuResult["five_elements"];
  element_tags: string[];
}) {
  const total = Object.values(five_elements).reduce((a, b) => a + b, 0);
  const r = 52, cx = 68, cy = 68, sw = 20;
  const circ = 2 * Math.PI * r;

  let cumFrac = 0;
  const segments = (Object.keys(ELEMENTS) as (keyof typeof ELEMENTS)[])
    .map((key) => {
      const value = five_elements[key];
      const frac = total > 0 ? value / total : 0;
      const seg = { key, value, frac, startFrac: cumFrac };
      cumFrac += frac;
      return seg;
    })
    .filter((s) => s.value > 0);

  return (
    <div className="flex items-center gap-4">
      <svg width={136} height={136} viewBox="0 0 136 136" className="shrink-0">
        {/* 배경 트랙 */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ede9fe" strokeWidth={sw} />
        {segments.map(({ key, frac, startFrac }) => {
          const el = ELEMENTS[key];
          const dashLen = frac * circ;
          const gapLen = circ - dashLen;
          // dashoffset: C*(0.25 - startFrac) → 12시 방향 기준 시계방향
          const offset = circ * (0.25 - startFrac);
          return (
            <circle
              key={key}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={el.donut}
              strokeWidth={sw}
              strokeDasharray={`${dashLen} ${gapLen}`}
              strokeDashoffset={offset}
              strokeLinecap="butt"
            />
          );
        })}
        {/* 중앙 텍스트 */}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e1b4b">
          오행
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={11} fill="#7c3aed">
          {total}개
        </text>
      </svg>

      {/* 범례 */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {(Object.keys(ELEMENTS) as (keyof typeof ELEMENTS)[]).map((key) => {
          const el = ELEMENTS[key];
          const value = five_elements[key];
          const tag = element_tags.find((t) => t.startsWith(key + "_"));
          const state = tag ? tag.split("_")[1] : "";
          const stateKo = STATE_KO[state] ?? "";
          const pct = total > 0 ? Math.round((value / total) * 100) : 0;
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: el.donut }} />
              <span className="text-xs text-violet-700 w-12 shrink-0">{el.ko}</span>
              <div className="flex-1 h-1.5 bg-violet-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${el.bar}`} style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs font-bold text-violet-950 w-3 text-right shrink-0">{value}</span>
              {stateKo && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium shrink-0 ${el.badge}`}>
                  {stateKo}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 블러 유료 유도 섹션 ─────────────────────────────────────────────
function BlurredPremium({ title, icon, children }: {
  title: string;
  icon: string;
  children: ReactNode;
}) {
  return (
    <div className="relative bg-white border border-violet-200 rounded-2xl overflow-hidden">
      {/* 블러 처리된 가짜 콘텐츠 */}
      <div className="blur-sm select-none pointer-events-none p-4">
        <h3 className="text-sm font-bold text-violet-950 mb-3">{icon} {title}</h3>
        {children}
      </div>
      {/* 잠금 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white/95 flex flex-col items-center justify-end pb-5">
        <div className="text-center">
          <p className="text-xl mb-1">🔒</p>
          <p className="text-sm font-bold text-violet-800">더 보려면 →</p>
          <p className="text-xs text-violet-500 mt-0.5">AI 심층 분석에서 확인하세요</p>
        </div>
      </div>
    </div>
  );
}

// ─── 운세 카테고리 탭 ────────────────────────────────────────────────
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
  const dayItem = result.day_pillar_interpretations?.find((i) => i.category === activeTab);
  const dayStemEl = ELEMENTS[STEM_TO_ELEMENT[result.pillars.day.stem]];

  return (
    <div className="bg-white border border-violet-200 rounded-2xl overflow-hidden">
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
      <div className="p-4 space-y-3 animate-[fadeIn_0.3s_ease]">
        {dayItem && (
          <div className={`rounded-xl p-3.5 ${dayStemEl?.lightBg ?? "bg-violet-50"}`}>
            <p className={`text-xs font-bold mb-1.5 ${dayStemEl?.textColor ?? "text-violet-700"}`}>
              {dayItem.condition_value}일주의 기질
            </p>
            <p className="text-sm font-semibold text-violet-950 leading-relaxed mb-1.5">{dayItem.summary}</p>
            <p className="text-sm text-violet-800 leading-relaxed">{dayItem.content}</p>
          </div>
        )}
        {catItems.length === 0 ? (
          dayItem ? null :
          <p className="text-sm text-violet-400 text-center py-4">해석 데이터가 없습니다.</p>
        ) : (
          catItems.map((item) => {
            const elemKey = item.condition_value.split("_")[0] as keyof typeof ELEMENTS;
            const stateKey = item.condition_value.split("_")[1];
            const el = ELEMENTS[elemKey];
            if (!el) return null;
            return (
              <div key={item.condition_value} className="flex gap-3">
                <span className={`shrink-0 mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${el.badge} h-fit`}>
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
          year: Number(year), month: Number(month), day: Number(day), siju, gender,
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

          {/* ① 사주팔자 4기둥 */}
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
            {/* 일간 강조 */}
            <div className="px-4 pb-4 text-center">
              {(() => {
                const dayStem = result.pillars.day.stem;
                const elemKey = STEM_TO_ELEMENT[dayStem];
                const el = elemKey ? ELEMENTS[elemKey] : null;
                return (
                  <span className={`inline-block text-xs px-3 py-1 rounded-full border font-semibold ${el?.badge ?? "bg-violet-100 text-violet-700 border-violet-200"}`}>
                    일간(日干) {dayStem} · {STEM_KOR[dayStem]} {el?.ko}
                  </span>
                );
              })()}
            </div>
          </div>

          {/* ② 오행 분포 도넛 차트 */}
          <div className="bg-white border border-violet-200 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-violet-950 mb-4 flex items-center gap-2">
              <span>⚖️</span> 오행 분포
            </h3>
            <ElementDonut
              five_elements={result.five_elements}
              element_tags={result.element_tags}
            />
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
                    <span key={tag} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${el.badge}`}>
                      {el.ko} {STATE_KO[stateKey]}
                    </span>
                  );
                })}
            </div>
          </div>

          {/* ③ 운세 해석 (텍스트 서사) */}
          <CategoryTab result={result} activeTab={activeTab} setTab={setActiveTab} />

          {/* ④ 블러 유료 유도 — 십성표 */}
          <BlurredPremium title="십성표 (十星表)" icon="🎯">
            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] mb-3">
              {[
                ["연간","식신"], ["월간","편재"], ["일간","—"], ["시간","편관"],
                ["연지","비겁"], ["월지","편인"], ["일지","비겁"], ["시지","겁재"],
              ].map(([pos, god], i) => (
                <div key={i} className="rounded-lg overflow-hidden">
                  <div className="bg-violet-100 text-violet-500 py-0.5">{pos}</div>
                  <div className={`py-1 font-semibold ${i % 2 === 0 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>{god}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-violet-500 text-center">일간 대비 각 기둥의 관계 · 길흉 분석</p>
          </BlurredPremium>

          {/* ⑤ 블러 유료 유도 — 신강신약 */}
          <BlurredPremium title="신강신약 분석" icon="⚖️">
            <div className="mb-3">
              <div className="flex justify-between text-[10px] text-violet-400 mb-1.5">
                <span>← 신약 (약한 일간)</span>
                <span>(강한 일간) 신강 →</span>
              </div>
              <div className="relative h-5 bg-gradient-to-r from-blue-100 via-violet-100 to-rose-100 rounded-full">
                <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-violet-600 border-2 border-white shadow" style={{ left: "62%" }} />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {[["신약", false], ["중화", false], ["신강", true]].map(([label, active]) => (
                  <div key={label as string} className={`text-center text-[10px] py-1 rounded ${active ? "bg-rose-100 text-rose-600 font-bold" : "bg-violet-50 text-violet-400"}`}>
                    {label as string}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-violet-500 text-center">일간 강약 · 용신(用神) 도출 기반 분석</p>
          </BlurredPremium>

          {/* ⑥ 블러 유료 유도 — 대운표 */}
          <BlurredPremium title="대운표 (大運表)" icon="📅">
            <div className="overflow-hidden mb-3">
              <div className="flex gap-2">
                {[["壬","子",18],["癸","丑",28],["甲","寅",38],["乙","卯",48],["丙","辰",58],["丁","巳",68]].map(([stem, branch, age], i) => (
                  <div key={i} className="text-center flex-1">
                    <div className="text-[9px] text-violet-400 mb-1">{age}세</div>
                    <div className={`py-1.5 rounded-lg text-xs font-bold leading-tight ${i === 2 ? "bg-violet-600 text-white" : "bg-violet-100 text-violet-600"}`}>
                      {stem}<br />{branch}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-violet-500 text-center">10년 단위 운의 흐름 · 전체 대운 흐름 분석</p>
          </BlurredPremium>

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
