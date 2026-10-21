<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Database (Supabase)

- 해석 데이터 작업 전에 `supabase/README.md`를 먼저 읽는다. 스키마는 `supabase/schema.sql`에 있다.
- DB에 직접 접속할 수 없다. 데이터는 `supabase/seed/`에 새 SQL 파일로 작성하고, 사람이 Supabase SQL Editor에서 실행한다.
- 기존 seed 파일은 수정하지 말고 번호를 이어서 새 파일을 만든다.
- `.env.local`이나 실제 키는 절대 커밋하지 않는다. 필요한 변수 이름은 `.env.example`에 있다.
