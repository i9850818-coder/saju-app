import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-violet-100 mt-auto">
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
              <span>🔮</span>
              <span className="font-bold text-violet-700 text-sm">{SITE_NAME}</span>
            </div>
            <p className="text-xs text-violet-500">
              운세·사주·타로는 재미와 자기이해를 위한 콘텐츠입니다.
            </p>
          </div>
          <div className="flex gap-4 text-xs text-violet-500">
            <Link href="/privacy" className="hover:text-violet-700 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-violet-700 transition-colors">
              이용약관
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-violet-300 mt-4">
          © 2025 {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
