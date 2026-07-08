import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "무료 사주",
  description: "생년월일로 내 사주팔자를 무료로 분석해드립니다.",
};

export default function SajuPage() {
  return (
    <div className="max-w-screen-md mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-5">✨</div>
      <h1 className="text-2xl font-bold text-white mb-3">무료 사주</h1>
      <p className="text-violet-400 mb-2">생년월일로 알아보는 사주팔자 분석</p>
      <p className="text-sm text-violet-600">준비 중입니다. 곧 만나보실 수 있어요!</p>
    </div>
  );
}
