import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateSaju } from "@/lib/saju/calculator";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

  const { data: interpretations } = await supabase
    .from("interpretation_templates")
    .select("condition_value, category, title, content, summary, weight")
    .eq("condition_key", "element_tag")
    .in("condition_value", calc.element_tags)
    .eq("is_active", true)
    .order("weight", { ascending: false });

  return NextResponse.json({ ...calc, interpretations: interpretations ?? [] });
}
