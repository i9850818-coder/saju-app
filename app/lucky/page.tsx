import type { Metadata } from "next";
import LuckyClient from "@/components/lucky/LuckyClient";

export const metadata: Metadata = {
  title: "행운의 번호 | 운세마당",
  description:
    "사주로 뽑은 이번 주 행운의 번호. 생년월일 기반으로 매주 월요일 자동 갱신됩니다.",
  keywords: ["행운의번호", "로또번호", "사주로또", "행운번호"],
};

export default function LuckyPage() {
  return <LuckyClient />;
}
