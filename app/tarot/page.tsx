import type { Metadata } from "next";
import TarotClient from "@/components/tarot/TarotClient";

export const metadata: Metadata = {
  title: "타로",
  description:
    "메이저 아르카나 22장으로 보는 무료 타로 리딩. 연애·직장·금전·전반 주제별 과거·현재·미래 쓰리카드 스프레드.",
  keywords: ["타로", "타로점", "타로카드", "무료타로", "쓰리카드"],
};

export default function TarotPage() {
  return <TarotClient />;
}
