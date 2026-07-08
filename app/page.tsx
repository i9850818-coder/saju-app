import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="max-w-screen-lg mx-auto px-4">
      {/* Hero */}
      <section className="text-center py-14 md:py-24">
        <div className="inline-flex items-center gap-2 bg-violet-900/30 border border-violet-700/40 rounded-full px-4 py-1.5 text-sm text-violet-300 mb-6">
          <span>✨</span>
          <span>매일 자정, 새로운 운세가 업데이트됩니다</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
          나를 이해하는<br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            운세 리포트
          </span>
        </h1>
        <p className="text-violet-300 text-base md:text-lg mb-8 max-w-sm mx-auto leading-relaxed">
          사주·타로·꿈해몽으로 오늘의 나를 발견하세요.
          <br />
          MBTI처럼, 하지만 더 깊게.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/saju"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-7 py-3 rounded-full transition-colors shadow-lg shadow-violet-900/50"
          >
            ✨ 무료 사주 보기
          </Link>
          <Link
            href="/today"
            className="inline-flex items-center gap-2 border border-violet-600/50 hover:border-violet-400 text-violet-300 hover:text-white font-medium px-7 py-3 rounded-full transition-colors"
          >
            ☀️ 오늘의 운세
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 pb-8">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group bg-card hover:bg-card-alt border border-violet-900/50 hover:border-violet-600/40 rounded-2xl p-4 md:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-900/30"
          >
            <div className="text-3xl mb-3">{item.emoji}</div>
            <h2 className="font-semibold text-white text-sm md:text-base mb-1 group-hover:text-violet-200 transition-colors">
              {item.label}
            </h2>
            <p className="text-xs text-violet-400">{item.desc}</p>
          </Link>
        ))}

        {/* 행운의 번호 */}
        <Link
          href="/lucky"
          className="group bg-card hover:bg-card-alt border border-violet-900/50 hover:border-violet-600/40 rounded-2xl p-4 md:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-900/30"
        >
          <div className="text-3xl mb-3">🍀</div>
          <h2 className="font-semibold text-white text-sm md:text-base mb-1 group-hover:text-violet-200 transition-colors">
            행운의 번호
          </h2>
          <p className="text-xs text-violet-400">사주로 뽑은 이번 주 번호</p>
        </Link>
      </section>

      <section className="text-center pb-10">
        <p className="text-xs text-violet-700">🔮 운세마당의 모든 서비스는 무료입니다</p>
      </section>
    </div>
  );
}
