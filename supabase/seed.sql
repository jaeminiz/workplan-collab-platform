insert into public.customers (id, name, company_code, memo)
values
  ('10000000-0000-0000-0000-000000000001', '현대삼호중공업', 'HSHI', 'POC sample customer'),
  ('10000000-0000-0000-0000-000000000002', 'POSSM', 'POSSM', 'POC sample customer'),
  ('10000000-0000-0000-0000-000000000003', '대선조선', 'DAESUN', 'POC sample customer'),
  ('10000000-0000-0000-0000-000000000004', 'EH ENG', 'EHENG', 'POC sample customer'),
  ('10000000-0000-0000-0000-000000000005', 'HD HMS', 'HDHMS', 'POC sample customer')
on conflict (id) do update set
  name = excluded.name,
  company_code = excluded.company_code,
  memo = excluded.memo,
  updated_at = now();

insert into public.projects (id, customer_id, code, name, vessel, description, health, due_date)
values
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'H8282',
    '현대삼호중공업 ODME',
    'H8282',
    'ODME project sample',
    '주의',
    '2026-06-10'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'SUPER HERO',
    'POSSM 연차검사 + 도급',
    'SUPER HERO',
    'Annual inspection sample',
    '정상',
    '2026-06-29'
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000003',
    'SB660',
    'PEGASUS HOPE CLAIM',
    'PEGASUS HOPE',
    'Claim project sample',
    '지연',
    '2026-06-26'
  )
on conflict (id) do update set
  customer_id = excluded.customer_id,
  code = excluded.code,
  name = excluded.name,
  vessel = excluded.vessel,
  description = excluded.description,
  health = excluded.health,
  due_date = excluded.due_date,
  updated_at = now();

insert into public.tasks (
  id,
  project_id,
  customer_id,
  title,
  body,
  type,
  status,
  workflow_stage,
  vessel,
  item_name,
  due_date
)
values
  (
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    '260527_작요_PMF_POSSM_SUPER HERO_싱가폴 연차검사',
    '익명 담당자 샘플 업무',
    '작요',
    '진행중',
    '접수',
    'SUPER HERO',
    '연차검사',
    '2026-06-29'
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000003',
    '260508_CLAIM접수_대선조선_PEGASUS HOPE_TLGS',
    'CLAIM 접수 샘플 업무',
    'CLAIM',
    '검토요청',
    '검토중',
    'PEGASUS HOPE',
    'TLGS',
    '2026-05-15'
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000004',
    '260527_생요_EH ENG_BAL SPARE_PAFR 60',
    '생산 요청 샘플 업무',
    '생요',
    '완료요청',
    '설계중',
    'H8282',
    'PAFR 60',
    '2026-06-05'
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000005',
    '260527_자재증_HD HMS_KOHAKU_H3277_BAL CLAIM',
    '자재 증빙 샘플 업무',
    '자재증',
    '진행중',
    '구매/자재',
    'KOHAKU',
    'BAL CLAIM',
    '2026-06-05'
  )
on conflict (id) do update set
  project_id = excluded.project_id,
  customer_id = excluded.customer_id,
  title = excluded.title,
  body = excluded.body,
  type = excluded.type,
  status = excluded.status,
  workflow_stage = excluded.workflow_stage,
  vessel = excluded.vessel,
  item_name = excluded.item_name,
  due_date = excluded.due_date,
  updated_at = now();

insert into public.task_comments (id, task_id, author_id, body)
values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', null, 'CLAIM 접수 내용 확인 필요'),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', null, '일정 검토 후 담당 부서 회신 예정')
on conflict (id) do update set
  body = excluded.body,
  updated_at = now();
