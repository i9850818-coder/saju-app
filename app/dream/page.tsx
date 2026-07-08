import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "꿈해몽",
  description: "꿈의 숨겨진 의미를 알아보세요. 키워드 검색으로 내 꿈을 해몽합니다.",
};

export default function DreamPage() {
  return (
    <div className="max-w-screen-md mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-5">🌙</div>
      <h1 className="text-2xl font-bold text-white mb-3">꿈해몽</h1>
      <p className="text-violet-400 mb-2">꿈 키워드로 알아보는 숨겨진 의미</p>
      <p className="text-sm text-violet-600">준비 중입니다. 곧 만나보실 수 있어요!</p>
    </div>
  );
}
