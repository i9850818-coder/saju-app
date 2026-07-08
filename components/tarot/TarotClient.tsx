"use client";

import { useState } from "react";
import {
  TAROT_CARDS,
  TOPIC_INFO,
  POSITIONS,
  POSITION_DESC,
  type TarotCardData,
  type TarotTopic,
} from "@/data/tarot";

const TOPICS: TarotTopic[] = ["연애", "직장", "금전", "전반"];

type DrawnCard = {
  card: TarotCardData;
  isReversed: boolean;
  isFlipped: boolean;
};

function CardFace({
  drawn,
  index,
  onFlip,
}: {
  drawn: DrawnCard;
  index: number;
  onFlip: (i: number) => void;
}) {
  const pos = POSITIONS[index];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Position label */}
      <div className="text-center h-8 flex flex-col justify-center">
        <p className="text-violet-700 text-xs font-semibold">{pos}</p>
        <p className="text-violet-500 text-[10px]">{POSITION_DESC[pos]}</p>
      </div>

      {/* 3-D flip card */}
      <div
        className="w-full"
        style={{ perspective: "1000px", aspectRatio: "2 / 3" }}
        onClick={() => !drawn.isFlipped && onFlip(index)}
      >
        <div
          className="relative w-full h-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            transform: drawn.isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* ── BACK ── */}
          <div
            className="absolute inset-0 rounded-2xl cursor-pointer select-none
              bg-gradient-to-b from-violet-950 via-purple-950 to-violet-900
              border-2 border-violet-700/60 flex flex-col items-center justify-center gap-3
              hover:border-violet-500/80 transition-colors"
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          >
            <div className="text-3xl opacity-60">✦</div>
            <div className="w-8 h-px bg-violet-700/50" />
            <p className="text-violet-500 text-[10px] tracking-widest uppercase">tap</p>
          </div>

          {/* ── FRONT ── */}
          <div
            className="absolute inset-0 rounded-2xl select-none
              bg-gradient-to-b from-white to-violet-50
              border-2 border-violet-300 flex flex-col items-center justify-center gap-2 p-2"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div
              className="text-3xl leading-none"
              style={{ transform: drawn.isReversed ? "rotate(180deg)" : "none" }}
            >
              {drawn.card.emoji}
            </div>
            <div className="text-center">
              <p className="text-violet-950 text-[11px] font-bold leading-tight">
                {drawn.card.nameKo}
              </p>
              {drawn.isReversed && (
                <p className="text-rose-600 text-[10px] mt-0.5">역방향</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TarotClient() {
  const [topic, setTopic] = useState<TarotTopic | null>(null);
  const [shuffling, setShuffling] = useState(false);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[] | null>(null);

  const draw = (t: TarotTopic) => {
    setTopic(t);
    setShuffling(true);
    setDrawnCards(null);

    setTimeout(() => {
      const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
      setDrawnCards(
        shuffled.slice(0, 3).map((card) => ({
          card,
          isReversed: Math.random() < 0.35,
          isFlipped: false,
        }))
      );
      setShuffling(false);
    }, 800);
  };

  const flipCard = (index: number) => {
    setDrawnCards((prev) =>
      prev?.map((c, i) => (i === index ? { ...c, isFlipped: true } : c)) ?? null
    );
  };

  const allFlipped = drawnCards?.every((c) => c.isFlipped) ?? false;
  const flippedCount = drawnCards?.filter((c) => c.isFlipped).length ?? 0;

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🎴</div>
        <h1 className="text-2xl md:text-3xl font-bold text-violet-950 mb-2">타로</h1>
        <p className="text-violet-600 text-sm">주제를 선택하고 카드를 뽑아보세요</p>
      </div>

      {/* Topic tabs */}
      <div className="mb-8">
        <p className="text-center text-violet-500 text-xs mb-3 tracking-wide">
          {topic
            ? `${TOPIC_INFO[topic].emoji} ${topic} 리딩 중 · 다른 주제로 바꾸려면 아래를 탭하세요`
            : "어떤 주제로 리딩할까요?"}
        </p>
        <div className="grid grid-cols-4 gap-3">
          {TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => draw(t)}
              className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl border transition-all active:scale-95 ${
                topic === t
                  ? "bg-violet-600 border-violet-500 text-white"
                  : "bg-white border-violet-200 text-violet-600 hover:border-violet-400 hover:bg-violet-50"
              }`}
            >
              <span className="text-2xl">{TOPIC_INFO[t].emoji}</span>
              <span className="text-xs font-medium">{t}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Shuffling */}
      {shuffling && (
        <div className="text-center py-14">
          <div className="text-5xl mb-4 animate-spin">🔮</div>
          <p className="text-violet-600 text-sm">카드를 섞는 중...</p>
        </div>
      )}

      {/* Card table */}
      {!shuffling && drawnCards && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-2">
            {drawnCards.map((drawn, i) => (
              <CardFace key={i} drawn={drawn} index={i} onFlip={flipCard} />
            ))}
          </div>

          {/* Hint */}
          {!allFlipped && (
            <p className="text-center text-violet-500 text-xs mt-3">
              {flippedCount === 0
                ? "카드를 하나씩 탭해서 운명을 확인하세요 ✦"
                : `${flippedCount}/3 공개 · 나머지 카드를 탭하세요`}
            </p>
          )}

          {/* ── Reading ── */}
          {allFlipped && topic && (
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-violet-200" />
                <span className="text-violet-600 text-xs font-semibold tracking-wide">
                  📖 {topic} 타로 리딩
                </span>
                <div className="flex-1 h-px bg-violet-200" />
              </div>

              <div className="space-y-4">
                {drawnCards.map((drawn, i) => {
                  const text = drawn.isReversed
                    ? drawn.card.reversed[topic]
                    : drawn.card.upright[topic];

                  return (
                    <div
                      key={i}
                      className="bg-white border border-violet-200 rounded-2xl p-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{drawn.card.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-violet-600 text-xs bg-violet-100 px-2 py-0.5 rounded-full">
                              {POSITIONS[i]}
                            </span>
                            <span className="text-violet-950 text-sm font-bold">
                              {drawn.card.nameKo}
                            </span>
                            {drawn.isReversed && (
                              <span className="text-rose-600 text-[10px] bg-rose-100 px-1.5 py-0.5 rounded-full">
                                역방향
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {drawn.card.keywords.slice(0, 3).map((kw) => (
                              <span
                                key={kw}
                                className="text-[10px] text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded-full"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-violet-800 leading-relaxed">{text}</p>
                    </div>
                  );
                })}
              </div>

              {/* Redraw */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => draw(topic)}
                  className="px-6 py-3 rounded-2xl bg-white border border-violet-300 text-violet-600 hover:text-violet-900 hover:border-violet-500 hover:bg-violet-50 text-sm transition-all active:scale-95"
                >
                  🔄 다시 뽑기
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
