import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "궁합",
  description: "사주로 알아보는 두 사람의 궁합. 카카오톡으로 공유해보세요.",
};

export default function CompatibilityPage() {
  return (
    <div className="max-w-screen-md mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-5">💕</div>
      <h1 className="text-2xl font-bold text-white mb-3">궁합</h1>
      <p className="text-violet-400 mb-2">두 사람의 사주로 알아보는 운명적 궁합</p>
      <p className="text-sm text-violet-600">준비 중입니다. 곧 만나보실 수 있어요!</p>
    </div>
  );
}
