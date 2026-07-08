import type { Metadata } from "next";
import ZodiacClient from "@/components/zodiac/ZodiacClient";

export const metadata: Metadata = {
  title: "띠별 운세",
  description:
    "쥐·소·호랑이·토끼·용·뱀·말·양·원숭이·닭·개·돼지 12띠별 오늘의 운세. 총운·연애운·직장운·금전운·건강운 무료 제공.",
  keywords: ["띠별운세", "12띠운세", "오늘의운세", "쥐띠", "소띠", "호랑이띠"],
};

export default function ZodiacPage() {
  return <ZodiacClient />;
}
