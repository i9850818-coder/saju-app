-- interpretation_templates: 사주 해석 문구 테이블
-- 실제 Supabase 데이터(2026-10-21)를 기준으로 복원한 스키마. 새 DB를 만들 때 이 파일을 먼저 실행한다.

create table if not exists interpretation_templates (
  id              uuid primary key default gen_random_uuid(),
  condition_key   text not null,             -- 조건 종류. 예: 'element_tag'
  condition_value text not null,             -- 조건 값. 예: 'wood_excess'
  category        text not null,             -- general | career | love | wealth | health
  title           text not null,             -- 예: '목 과다 · 총운'
  summary         text not null,             -- 무료 화면 표시용 1~2문장
  content         text not null,             -- 상세 해석 (유료 AI 분석 재료)
  weight          integer not null default 60,  -- 정렬 우선순위 (높을수록 먼저)
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- seed 파일의 ON CONFLICT가 동작하려면 필요
create unique index if not exists interpretation_templates_condition_uq
  on interpretation_templates (condition_key, condition_value, category);

-- 앱은 anon key로 읽기만 한다
alter table interpretation_templates enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies
                 where tablename = 'interpretation_templates' and policyname = 'anon read active') then
    create policy "anon read active" on interpretation_templates
      for select using (is_active = true);
  end if;
end $$;
