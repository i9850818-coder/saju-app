/**
 * 사주팔자 TypeScript 계산기
 * Jean Meeus "Astronomical Algorithms" 기반 절기 계산 + JDN 기반 일주 산출
 * 정확도: 절기 오차 수 분 이내 (1900~2100 범위)
 */

// ─── 천간·지지 ──────────────────────────────────────────────────────
const STEMS   = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'] as const;
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'] as const;
type Stem   = typeof STEMS[number];
type Branch = typeof BRANCHES[number];

// ─── 오행 매핑 ──────────────────────────────────────────────────────
const STEM_ELEMENT: Record<Stem, string> = {
  '甲':'wood','乙':'wood','丙':'fire','丁':'fire','戊':'earth',
  '己':'earth','庚':'metal','辛':'metal','壬':'water','癸':'water',
};
const BRANCH_ELEMENT: Record<Branch, string> = {
  '子':'water','丑':'earth','寅':'wood','卯':'wood','辰':'earth',
  '巳':'fire','午':'fire','未':'earth','申':'metal','酉':'metal','戌':'earth','亥':'water',
};
const ELEMENTS = ['wood','fire','earth','metal','water'] as const;

// ─── 생시 → 지지 인덱스 ────────────────────────────────────────────
const SIJU_BRANCH: Record<string, number> = {
  '자시':0,'축시':1,'인시':2,'묘시':3,'진시':4,'사시':5,
  '오시':6,'미시':7,'신시':8,'유시':9,'술시':10,'해시':11,'모름':6,
};
const SIJU_DISPLAY_HOUR: Record<string, number> = {
  '자시':0,'축시':2,'인시':4,'묘시':6,'진시':8,'사시':10,
  '오시':12,'미시':14,'신시':16,'유시':18,'술시':20,'해시':22,'모름':12,
};

// ─── 절기 (節/Jié): 해당 월 시작 기준 ─────────────────────────────
const JIEQI = [
  { lon: 285, branch: 1  }, // 소한(小寒) → 丑월
  { lon: 315, branch: 2  }, // 입춘(立春) → 寅월
  { lon: 345, branch: 3  }, // 경칩(驚蟄) → 卯월
  { lon: 15,  branch: 4  }, // 청명(清明) → 辰월
  { lon: 45,  branch: 5  }, // 입하(立夏) → 巳월
  { lon: 75,  branch: 6  }, // 망종(芒種) → 午월
  { lon: 105, branch: 7  }, // 소서(小暑) → 未월
  { lon: 135, branch: 8  }, // 입추(立秋) → 申월
  { lon: 165, branch: 9  }, // 백로(白露) → 酉월
  { lon: 195, branch: 10 }, // 한로(寒露) → 戌월
  { lon: 225, branch: 11 }, // 입동(立冬) → 亥월
  { lon: 255, branch: 0  }, // 대설(大雪) → 子월
];

// ─── 수학 유틸 ──────────────────────────────────────────────────────
function mod360(x: number): number { return ((x % 360) + 360) % 360; }
function rad(deg: number): number  { return deg * Math.PI / 180; }

// ─── 율리우스 날짜 (그레고리력) ────────────────────────────────────
function toJDN(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy
       + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

// ─── 태양 황경 (Jean Meeus 간략식) ─────────────────────────────────
function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = mod360(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M  = mod360(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mr = rad(M);
  const C  = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr)
           + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
           + 0.000289 * Math.sin(3 * Mr);
  const sunTrue = mod360(L0 + C);
  const omega   = 125.04 - 1934.136 * T;
  return mod360(sunTrue - 0.00569 - 0.00478 * Math.sin(rad(omega)));
}

// 특정 연도에서 태양이 targetLon 황경에 도달하는 JD (KST = UTC+9)
// Jan 1 기준 태양 황경 ~280°, targetLon까지의 경과 각도로 초기값 추정
function jdOfSolarTerm(year: number, targetLon: number): number {
  const jan1JD      = 2451544.5 + 365.2422 * (year - 2000);
  const angularDiff = ((targetLon - 280.46 + 360) % 360);
  let jd = jan1JD + (angularDiff / 360) * 365.2422;
  for (let i = 0; i < 50; i++) {
    let diff = targetLon - sunLongitude(jd);
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) < 0.000001) break;
    jd += diff / 360 * 365.2422;
  }
  return jd + 9 / 24; // KST 보정
}

// ─── 연주 (年柱) ────────────────────────────────────────────────────
function calcYearPillar(year: number, month: number, day: number) {
  const birthJD  = toJDN(year, month, day);
  const ipchunJD = jdOfSolarTerm(year, 315); // 입춘 (立春)
  const sajuYear = birthJD < ipchunJD ? year - 1 : year;
  const idx      = ((sajuYear - 4) % 60 + 60) % 60;
  const stem   = STEMS[idx % 10];
  const branch = BRANCHES[idx % 12];
  return { stem, branch, combined: stem + branch };
}

// ─── 월주 (月柱) ────────────────────────────────────────────────────
function calcMonthPillar(year: number, month: number, day: number, yearStem: Stem) {
  const birthJD = toJDN(year, month, day);

  // 생일 이전 가장 최근 절기 찾기
  let latestJD = -Infinity;
  let monthBranchIdx = 1; // 기본값 丑
  for (const jq of JIEQI) {
    for (const y of [year - 1, year]) {
      const jqJD = jdOfSolarTerm(y, jq.lon);
      if (jqJD <= birthJD && jqJD > latestJD) {
        latestJD      = jqJD;
        monthBranchIdx = jq.branch;
      }
    }
  }

  // 월간(月干) = 연간 그룹 × 寅월 기준 + 오프셋
  const yearStemIdx  = STEMS.indexOf(yearStem);
  const group        = yearStemIdx % 5;
  const startStemIdx = (group * 2 + 2) % 10;          // 寅월 천간
  const offset       = (monthBranchIdx - 2 + 12) % 12; // 寅에서 몇 칸
  const stemIdx      = (startStemIdx + offset) % 10;

  const stem   = STEMS[stemIdx];
  const branch = BRANCHES[monthBranchIdx];
  return { stem, branch, combined: stem + branch };
}

// ─── 일주 (日柱) ────────────────────────────────────────────────────
function calcDayPillar(year: number, month: number, day: number) {
  const jdn  = toJDN(year, month, day);
  const idx  = ((jdn + 49) % 60 + 60) % 60;
  const stem   = STEMS[idx % 10];
  const branch = BRANCHES[idx % 12];
  return { stem, branch, combined: stem + branch };
}

// ─── 시주 (時柱) ────────────────────────────────────────────────────
function calcHourPillar(siju: string, dayStem: Stem) {
  const branchIdx  = SIJU_BRANCH[siju] ?? 6;
  const dayStemIdx = STEMS.indexOf(dayStem);
  const group      = dayStemIdx % 5;
  const startStem  = (group * 2) % 10; // 子시 천간
  const stemIdx    = (startStem + branchIdx) % 10;
  const stem   = STEMS[stemIdx];
  const branch = BRANCHES[branchIdx];
  return { stem, branch, combined: stem + branch };
}

// ─── 오행 카운트·태그 ───────────────────────────────────────────────
function countElements(pillars: Record<string, { stem: string; branch: string }>) {
  const counts: Record<string, number> = { wood:0, fire:0, earth:0, metal:0, water:0 };
  for (const p of Object.values(pillars)) {
    const se = STEM_ELEMENT[p.stem as Stem];
    const be = BRANCH_ELEMENT[p.branch as Branch];
    if (se) counts[se]++;
    if (be) counts[be]++;
  }
  return counts;
}

function makeTags(counts: Record<string, number>): string[] {
  return ELEMENTS.map(el => {
    const n     = counts[el];
    const state = n <= 1 ? 'deficient' : n === 2 ? 'balanced' : 'excess';
    return `${el}_${state}`;
  });
}

// ─── 메인 export ─────────────────────────────────────────────────────
export type SajuPillar = { stem: string; branch: string; combined: string };

export type SajuResult = {
  pillars: Record<'year'|'month'|'day'|'hour', SajuPillar>;
  five_elements: Record<string, number>;
  element_tags: string[];
  birth_info: { date: string; time: string; solar_time: null; siju: string; city: null };
};

export function calculateSaju(
  year: number, month: number, day: number, siju: string
): SajuResult {
  const yp = calcYearPillar(year, month, day);
  const mp = calcMonthPillar(year, month, day, yp.stem);
  const dp = calcDayPillar(year, month, day);
  const hp = calcHourPillar(siju, dp.stem);

  const pillars       = { year: yp, month: mp, day: dp, hour: hp };
  const five_elements = countElements(pillars);
  const element_tags  = makeTags(five_elements);

  const h = SIJU_DISPLAY_HOUR[siju] ?? 12;
  return {
    pillars,
    five_elements,
    element_tags,
    birth_info: {
      date:       `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`,
      time:       `${String(h).padStart(2,'0')}:00`,
      solar_time: null,
      siju,
      city:       null,
    },
  };
}
