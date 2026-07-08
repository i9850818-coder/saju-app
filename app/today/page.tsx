import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오늘의 운세",
  description: "오늘 하루의 운세를 확인하세요. 매일 자정 자동 업데이트.",
};

export default function TodayPage() {
  return (
    <div className="max-w-screen-md mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-5">☀️</div>
      <h1 className="text-2xl font-bold text-white mb-3">오늘의 운세</h1>
      <p className="text-violet-400 mb-2">매일 자정 Claude AI가 생성하는 운세</p>
      <p className="text-sm text-violet-600">준비 중입니다. 곧 만나보실 수 있어요!</p>
    </div>
  );
}
