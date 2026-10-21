# Supabase DB

사주 해석 데이터는 Supabase `interpretation_templates` 테이블에 있다. 앱은 anon key로 **읽기만** 하므로,
데이터 추가·수정은 SQL 파일로 작성한 뒤 Supabase 대시보드 → SQL Editor에서 실행한다.

## 파일

| 파일 | 내용 |
|---|---|
| `schema.sql` | 테이블·유니크 인덱스·RLS 정책 (여러 번 실행해도 안전) |
| `seed/001_element_tag.sql` | 기존 데이터 75행: 5 오행 × 3 상태 × 5 카테고리 |
| `seed/0NN_*.sql` | 새 데이터는 번호를 이어서 새 파일로 추가 |

## 데이터 규칙

- **조회 방식** (`app/api/saju/calculate/route.ts`): `condition_key`와 `condition_value`로 고르고, `is_active = true`만, `weight` 내림차순.
- **condition_key / condition_value**
  - `element_tag`: `{wood|fire|earth|metal|water}_{excess|balanced|deficient}`
  - 새 종류(예: 일주 `day_pillar` / `갑자`, 십성 `ten_god` 등)를 추가하면 이를 조회하는 코드도 함께 수정해야 한다.
- **category**: `general`(종합 기질) · `career`(직업 성향) · `love`(연애 성향) · `wealth`(재물 성향) · `health`(건강 성향)
- **title**: `{대상} · {카테고리 한글}` 형식. 예: `목 과다 · 총운`
- **summary**: 1~2문장. 무료 화면에 그대로 노출된다.
- **content**: 4~6문장의 상세 해석. 유료 AI 분석의 재료다.
- **weight**: 기존 데이터는 과다·부족 80, 균형 60.
- **표현**: "기질·성향" 프레이밍을 쓴다. "올해", "이번 달", "~할 시기" 같은 시간 표현과 단정적인 예언은 쓰지 않는다.
- **INSERT 끝**: 반드시 `ON CONFLICT (condition_key, condition_value, category) DO NOTHING`을 붙여 재실행해도 안전하게 한다.
