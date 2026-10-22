import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateSaju } from "@/lib/saju/calculator";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 일주 해석은 한글 일주명(예: '갑자')으로 저장돼 있다
const STEM_KOR: Record<string, string> = {
  "甲":"갑","乙":"을","丙":"병","丁":"정","戊":"무","己":"기","庚":"경","辛":"신","壬":"임","癸":"계",
};
const BRANCH_KOR: Record<string, string> = {
  "子":"자","丑":"축","寅":"인","卯":"묘","辰":"진","巳":"사",
  "午":"오","未":"미","申":"신","酉":"유","戌":"술","亥":"해",
};

const VALID_SIJU = new Set([
  "자시","축시","인시","묘시","진시","사시",
  "오시","미시","신시","유시","술시","해시","모름",
]);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { year, month, day, siju = "모름", gender } = body;

  if (!year || !month || !day || !gender) {
    return NextResponse.json({ detail: "필수 입력값이 누락됐습니다." }, { status: 400 });
  }
  if (!VALID_SIJU.has(siju)) {
    return NextResponse.json({ detail: "올바르지 않은 생시입니다." }, { status: 400 });
  }

  const calc = calculateSaju(Number(year), Number(month), Number(day), siju);

  const dayPillarKor = STEM_KOR[calc.pillars.day.stem] + BRANCH_KOR[calc.pillars.day.branch];
  const columns = "condition_value, category, title, content, summary, weight";

  const [{ data: interpretations }, { data: dayPillarInterpretations }] = await Promise.all([
    supabase
      .from("interpretation_templates")
      .select(columns)
      .eq("condition_key", "element_tag")
      .in("condition_value", calc.element_tags)
      .eq("is_active", true)
      .order("weight", { ascending: false }),
    supabase
      .from("interpretation_templates")
      .select(columns)
      .eq("condition_key", "day_pillar")
      .eq("condition_value", dayPillarKor)
      .eq("is_active", true),
  ]);

  return NextResponse.json({
    ...calc,
    interpretations: interpretations ?? [],
    day_pillar_interpretations: dayPillarInterpretations ?? [],
  });
}
