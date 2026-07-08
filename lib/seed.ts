export function seedHash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
    h = h >>> 0;
  }
  return h;
}

export function getKoreaDate(): string {
  return new Date()
    .toLocaleDateString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\.\s*/g, "-")
    .replace(/-$/, "");
}

export type FortunePools = {
  general: string[];
  love: string[];
  work: string[];
  money: string[];
  health: string[];
};

export type FortuneResult = {
  general: string;
  love: string;
  work: string;
  money: string;
  health: string;
  scores: { general: number; love: number; work: number; money: number; health: number };
};

export function pickFortune(pools: FortunePools, seed: number): FortuneResult {
  const p = (arr: string[], off: number) => arr[(seed + off) % arr.length];
  const s = (off: number): number => ((seed >>> off) % 5) + 1;
  return {
    general: p(pools.general, 0),
    love: p(pools.love, 1),
    work: p(pools.work, 3),
    money: p(pools.money, 7),
    health: p(pools.health, 13),
    scores: { general: s(2), love: s(5), work: s(9), money: s(14), health: s(19) },
  };
}
