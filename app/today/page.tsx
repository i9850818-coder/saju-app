import type { Metadata } from "next";
import TodayClient from "@/components/today/TodayClient";

export const metadata: Metadata = {
  title: "오늘의 운세",
  description:
    "띠별, 별자리, 혈액형, MBTI 오늘의 운세. 매일 새로운 운세를 무료로 확인하세요.",
  keywords: ["오늘의운세", "띠별운세", "별자리운세", "혈액형운세", "MBTI운세"],
};

export default function TodayPage() {
  return <TodayClient />;
}
