import type { Metadata } from "next";
import DreamClient from "@/components/dream/DreamClient";

export const metadata: Metadata = {
  title: "꿈해몽",
  description:
    "꿈에 나타난 키워드로 숨겨진 의미를 알아보세요. 뱀, 돼지, 이빨, 불, 홍수 등 100가지 꿈해몽 무료 제공.",
  keywords: ["꿈해몽", "꿈풀이", "꿈해석", "꿈의미", "뱀꿈", "이빨꿈", "돼지꿈"],
};

export default function DreamPage() {
  return <DreamClient />;
}
