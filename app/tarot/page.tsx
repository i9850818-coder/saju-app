import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "타로",
  description: "타로카드로 오늘의 운을 점쳐보세요.",
};

export default function TarotPage() {
  return (
    <div className="max-w-screen-md mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-5">🎴</div>
      <h1 className="text-2xl font-bold text-white mb-3">타로</h1>
      <p className="text-violet-400 mb-2">카드를 뽑아 오늘의 메시지를 확인하세요</p>
      <p className="text-sm text-violet-600">준비 중입니다. 곧 만나보실 수 있어요!</p>
    </div>
  );
}
