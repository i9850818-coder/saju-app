import type { Metadata } from "next";
import CompatClient from "@/components/compatibility/CompatClient";

export const metadata: Metadata = {
  title: "궁합",
  description: "두 사람의 생년월일시로 알아보는 사주 궁합. 사랑·신뢰·소통·미래 궁합을 무료로 확인하세요.",
  keywords: ["궁합", "사주궁합", "연애궁합", "커플궁합", "무료궁합"],
};

export default function CompatibilityPage() {
  return <CompatClient />;
}
