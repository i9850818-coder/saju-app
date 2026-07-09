import type { Metadata } from "next";
import SajuClient from "@/components/saju/SajuClient";

export const metadata: Metadata = {
  title: "무료 사주",
  description: "생년월일과 태어난 시간으로 알아보는 나만의 사주팔자 분석.",
};

export default function SajuPage() {
  return <SajuClient />;
}
