"use client";

import { useState, useMemo } from "react";
import { ZODIACS, getDailyFortune, type ZodiacAnimal } from "@/data/zodiac";
import { STAR_SIGNS, getStarSignFortune, type StarSign } from "@/data/star-sign";
import { BLOOD_TYPES, getBloodTypeFortune, type BloodTypeId } from "@/data/blood-type";
import { MBTI_DATA, getMbtiFortune, type MbtiType } from "@/data/mbti";
import { getKoreaDate, type FortuneResult } from "@/lib/seed";

const TABS = [
  { id: "zodiac", label: "띠별", emoji: "🐉" },
  { id: "star", label: "별자리", emoji: "⭐" },
  { id: "blood", label: "혈액형", emoji: "🩸" },
  { id: "mbti", label: "MBTI", emoji: "🧠" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const CATEGORIES = [
  { key: "general" as const, label: "총운", emoji: "🔮" },
  { key: "love" as const, label: "연애운", emoji: "💕" },
  { key: "work" as const, label: "직장운", emoji: "💼" },
  { key: "money" as const, label: "금전운", emoji: "💰" },
  { key: "health" as const, label: "건강운", emoji: "🌿" },
];

function Stars({ score }: { score: number }) {
  return (
    <span className="text-amber-400 text-sm tracking-tight">
      {"★".repeat(score)}
      <span className="text-violet-200">{"★".repeat(5 - score)}</span>
    </span>
  );
}

function FortunePanel({
  emoji,
  name,
  trait,
  fortune,
}: {
  emoji: string;
  name: string;
  trait: string;
  fortune: FortuneResult;
}) {
  return (
    <div className="mt-2 animate-[fadeIn_0.3s_ease]">
      <div className="flex items-center gap-3 mb-5 p-4 bg-violet-50 border border-violet-200 rounded-2xl">
        <span className="text-4xl">{emoji}</span>
        <div>
          <h2 className="text-lg font-bold text-violet-950">{name}</h2>
          <p className="text-violet-600 text-xs mt-0.5">{trait}</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1.5 mb-5">
        {CATEGORIES.map(({ key, label, emoji: catEmoji }) => (
          <div key={key} className="bg-white border border-violet-200 rounded-xl p-2 text-center">
            <div className="text-base mb-1">{catEmoji}</div>
            <div className="text-[10px] text-violet-600 mb-1">{label}</div>
            <Stars score={fortune.scores[key]} />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {CATEGORIES.map(({ key, label, emoji: catEmoji }) => (
          <div key={key} className="bg-white border border-violet-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{catEmoji}</span>
              <span className="text-sm font-semibold text-violet-950">{label}</span>
              <Stars score={fortune.scores[key]} />
            </div>
            <p className="text-sm text-violet-700 leading-relaxed">{fortune[key]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ZodiacTab({ today }: { today: string }) {
  const [selected, setSelected] = useState<ZodiacAnimal | null>(null);
  const fortune = useMemo(
    () => (selected ? getDailyFortune(selected.id, today) : null),
    [selected, today]
  );

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {ZODIACS.map((animal) => (
          <button
            key={animal.id}
            onClick={() => setSelected(selected?.id === animal.id ? null : animal)}
            className={`flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl border transition-all active:scale-95 ${
              selected?.id === animal.id
                ? "bg-violet-600 border-violet-500"
                : "bg-white border-violet-200 hover:border-violet-400 hover:bg-violet-50"
            }`}
          >
            <span className="text-2xl">{animal.emoji}</span>
            <span className={`text-xs font-bold ${selected?.id === animal.id ? "text-white" : "text-violet-800"}`}>
              {animal.name}띠
            </span>
            <span className={`text-[10px] leading-tight text-center ${selected?.id === animal.id ? "text-violet-200" : "text-violet-500"}`}>
              {animal.years.slice(0, 3).join(" · ")}
            </span>
          </button>
        ))}
      </div>

      {selected && fortune ? (
        <FortunePanel
          emoji={selected.emoji}
          name={`${selected.name}띠 오늘의 운세`}
          trait={selected.trait}
          fortune={fortune}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-violet-500 text-sm">내 띠를 선택해주세요 🐾</p>
        </div>
      )}
    </div>
  );
}

function StarTab({ today }: { today: string }) {
  const [selected, setSelected] = useState<StarSign | null>(null);
  const fortune = useMemo(
    () => (selected ? getStarSignFortune(selected.id, today) : null),
    [selected, today]
  );

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {STAR_SIGNS.map((sign) => (
          <button
            key={sign.id}
            onClick={() => setSelected(selected?.id === sign.id ? null : sign)}
            className={`flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl border transition-all active:scale-95 ${
              selected?.id === sign.id
                ? "bg-violet-600 border-violet-500"
                : "bg-white border-violet-200 hover:border-violet-400 hover:bg-violet-50"
            }`}
          >
            <span className="text-2xl">{sign.symbol}</span>
            <span className={`text-xs font-bold ${selected?.id === sign.id ? "text-white" : "text-violet-800"}`}>
              {sign.name}
            </span>
            <span className={`text-[10px] leading-tight text-center ${selected?.id === sign.id ? "text-violet-200" : "text-violet-500"}`}>
              {sign.startMonth}/{sign.startDay}~
            </span>
          </button>
        ))}
      </div>

      {selected && fortune ? (
        <FortunePanel
          emoji={selected.symbol}
          name={`${selected.name} 오늘의 운세`}
          trait={`${selected.element}의 기운 · ${selected.trait}`}
          fortune={fortune}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-violet-500 text-sm">내 별자리를 선택해주세요 ⭐</p>
        </div>
      )}
    </div>
  );
}

function BloodTab({ today }: { today: string }) {
  const [selectedId, setSelectedId] = useState<BloodTypeId | null>(null);
  const selected = BLOOD_TYPES.find((b) => b.id === selectedId) ?? null;
  const fortune = useMemo(
    () => (selectedId ? getBloodTypeFortune(selectedId, today) : null),
    [selectedId, today]
  );

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {BLOOD_TYPES.map((bt) => (
          <button
            key={bt.id}
            onClick={() => setSelectedId(selectedId === bt.id ? null : bt.id)}
            className={`flex flex-col items-center gap-2 py-7 px-2 rounded-2xl border transition-all active:scale-95 ${
              selectedId === bt.id
                ? "bg-violet-600 border-violet-500"
                : "bg-white border-violet-200 hover:border-violet-400 hover:bg-violet-50"
            }`}
          >
            <span className="text-3xl">{bt.emoji}</span>
            <span className={`text-sm font-bold ${selectedId === bt.id ? "text-white" : "text-violet-800"}`}>
              {bt.id}형
            </span>
          </button>
        ))}
      </div>

      {selected && fortune ? (
        <FortunePanel
          emoji={selected.emoji}
          name={`${selected.id}형 오늘의 운세`}
          trait={selected.trait}
          fortune={fortune}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-violet-500 text-sm">내 혈액형을 선택해주세요 🩸</p>
        </div>
      )}
    </div>
  );
}

const MBTI_DIMS = [
  { a: "E", b: "I", aLabel: "E 외향", bLabel: "I 내향" },
  { a: "N", b: "S", aLabel: "N 직관", bLabel: "S 감각" },
  { a: "T", b: "F", aLabel: "T 사고", bLabel: "F 감정" },
  { a: "J", b: "P", aLabel: "J 판단", bLabel: "P 인식" },
] as const;

function MbtiTab({ today }: { today: string }) {
  const [dims, setDims] = useState<[string, string, string, string]>(["E", "N", "T", "J"]);
  const mbtiId = dims.join("") as MbtiType;
  const mbtiData = MBTI_DATA.find((m) => m.id === mbtiId)!;
  const fortune = useMemo(() => getMbtiFortune(mbtiId, today), [mbtiId, today]);

  const pick = (i: number, val: string) =>
    setDims((prev) => {
      const next = [...prev] as typeof dims;
      next[i] = val;
      return next;
    });

  return (
    <div>
      <div className="space-y-2 mb-5">
        {MBTI_DIMS.map((dim, i) => (
          <div key={i} className="flex gap-2">
            <button
              onClick={() => pick(i, dim.a)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all active:scale-95 ${
                dims[i] === dim.a
                  ? "bg-violet-600 border-violet-500 text-white"
                  : "bg-white border-violet-200 text-violet-600 hover:border-violet-400 hover:bg-violet-50"
              }`}
            >
              {dim.aLabel}
            </button>
            <button
              onClick={() => pick(i, dim.b)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all active:scale-95 ${
                dims[i] === dim.b
                  ? "bg-violet-600 border-violet-500 text-white"
                  : "bg-white border-violet-200 text-violet-600 hover:border-violet-400 hover:bg-violet-50"
              }`}
            >
              {dim.bLabel}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mb-5 py-4 bg-violet-50 border border-violet-200 rounded-2xl">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-3xl font-bold tracking-widest text-violet-950">{mbtiId}</span>
          <span className="text-2xl">{mbtiData.emoji}</span>
        </div>
        <p className="text-violet-600 text-sm">
          {mbtiData.nickname} · {mbtiData.trait}
        </p>
      </div>

      <FortunePanel
        emoji={mbtiData.emoji}
        name={`${mbtiId} ${mbtiData.nickname} 오늘의 운세`}
        trait={mbtiData.trait}
        fortune={fortune}
      />
    </div>
  );
}

export default function TodayClient() {
  const [activeTab, setActiveTab] = useState<TabId>("zodiac");
  const today = useMemo(() => getKoreaDate(), []);

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">☀️</div>
        <h1 className="text-2xl md:text-3xl font-bold text-violet-950 mb-2">오늘의 운세</h1>
        <p className="text-violet-600 text-sm">오늘 하루의 운세를 확인하세요</p>
        <p className="text-violet-400 text-xs mt-1">{today.replace(/-/g, ".")} 기준</p>
      </div>

      <div className="flex gap-1.5 bg-white border border-violet-200 rounded-2xl p-1.5 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-violet-600 text-white"
                : "text-violet-500 hover:text-violet-700"
            }`}
          >
            <span className="text-base">{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === "zodiac" && <ZodiacTab today={today} />}
      {activeTab === "star" && <StarTab today={today} />}
      {activeTab === "blood" && <BloodTab today={today} />}
      {activeTab === "mbti" && <MbtiTab today={today} />}
    </div>
  );
}
