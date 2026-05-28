create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create type project_health as enum ('정상', '주의', '지연');
create type task_type as enum (
  '작요',
  '생요',
  '설검',
  '업무참조',
  '자재증',
  '검사완료',
  '출고완료',
  '계산서',
  'CLAIM',
  'SPARE',
  '일반업무'
);
create type task_status as enum ('미착수', '진행중', '검토요청', '완료요청', '완료확인', '반려', '보류');
create type notification_channel as enum ('web', 'mobile', 'slack', 'telegram', 'kakao', 'email');

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  department_id uuid references public.departments(id),
  email text not null unique,
  display_name text not null,
  role text not null default 'member',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_code text,
  memo text,
  search_vector tsvector generated always as (
    to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(company_code, '') || ' ' || coalesce(memo, ''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  title text,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id),
  code text not null,
  name text not null,
  vessel text,
  description text,
  owner_id uuid references public.profiles(id),
  health project_health not null default '정상',
  start_date date,
  due_date date,
  completed_at timestamptz,
  search_vector tsvector generated always as (
    to_tsvector('simple', coalesce(code, '') || ' ' || coalesce(name, '') || ' ' || coalesce(vessel, '') || ' ' || coalesce(description, ''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  parent_task_id uuid references public.tasks(id) on delete set null,
  customer_id uuid references public.customers(id),
  title text not null,
  body text,
  type task_type not null default '일반업무',
  status task_status not null default '미착수',
  workflow_stage text not null default '접수',
  vessel text,
  item_name text,
  due_date date,
  target_date date,
  completed_at timestamptz,
  created_by uuid references public.profiles(id),
  assignee_id uuid references public.profiles(id),
  search_vector tsvector generated always as (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(body, '') || ' ' || coalesce(vessel, '') || ' ' || coalesce(item_name, ''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_assignees (
  task_id uuid not null references public.tasks(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'assignee',
  created_at timestamptz not null default now(),
  primary key (task_id, profile_id)
);

create table public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_id uuid references public.profiles(id),
  body text not null,
  search_vector tsvector generated always as (to_tsvector('simple', coalesce(body, ''))) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  task_id uuid references public.tasks(id) on delete set null,
  title text not null,
  storage_bucket text not null default 'work-files',
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references public.profiles(id),
  search_vector tsvector generated always as (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(storage_path, ''))
  ) stored,
  created_at timestamptz not null default now()
);

create table public.task_files (
  task_id uuid not null references public.tasks(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (task_id, document_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  channel notification_channel not null default 'web',
  title text not null,
  body text,
  read_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.integration_accounts (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  profile_id uuid references public.profiles(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete cascade,
  external_id text not null,
  access_token_encrypted text,
  refresh_token_encrypted text,
  scopes text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, external_id)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index departments_name_idx on public.departments using btree (name);
create index customers_search_idx on public.customers using gin (search_vector);
create index customers_name_trgm_idx on public.customers using gin (name gin_trgm_ops);
create index contacts_customer_id_idx on public.contacts (customer_id);
create index projects_customer_id_idx on public.projects (customer_id);
create index projects_search_idx on public.projects using gin (search_vector);
create index projects_name_trgm_idx on public.projects using gin (name gin_trgm_ops);
create index tasks_project_id_idx on public.tasks (project_id);
create index tasks_status_idx on public.tasks (status);
create index tasks_type_idx on public.tasks (type);
create index tasks_due_date_idx on public.tasks (due_date);
create index tasks_assignee_id_idx on public.tasks (assignee_id);
create index tasks_search_idx on public.tasks using gin (search_vector);
create index tasks_title_trgm_idx on public.tasks using gin (title gin_trgm_ops);
create index task_comments_task_id_idx on public.task_comments (task_id);
create index task_comments_search_idx on public.task_comments using gin (search_vector);
create index documents_project_id_idx on public.documents (project_id);
create index documents_task_id_idx on public.documents (task_id);
create index documents_search_idx on public.documents using gin (search_vector);
create index notifications_recipient_id_idx on public.notifications (recipient_id);
create index notifications_read_at_idx on public.notifications (read_at);

alter table public.departments enable row level security;
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.contacts enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.task_assignees enable row level security;
alter table public.task_comments enable row level security;
alter table public.documents enable row level security;
alter table public.task_files enable row level security;
alter table public.notifications enable row level security;
alter table public.integration_accounts enable row level security;
alter table public.audit_logs enable row level security;

create policy "authenticated users can read departments" on public.departments
  for select to authenticated using (true);
create policy "authenticated users can read profiles" on public.profiles
  for select to authenticated using (true);
create policy "users can update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "authenticated users can read customers" on public.customers
  for select to authenticated using (true);
create policy "authenticated users can write customers" on public.customers
  for all to authenticated using (true) with check (true);

create policy "authenticated users can read contacts" on public.contacts
  for select to authenticated using (true);
create policy "authenticated users can write contacts" on public.contacts
  for all to authenticated using (true) with check (true);

create policy "authenticated users can read projects" on public.projects
  for select to authenticated using (true);
create policy "authenticated users can write projects" on public.projects
  for all to authenticated using (true) with check (true);

create policy "authenticated users can read tasks" on public.tasks
  for select to authenticated using (true);
create policy "authenticated users can write tasks" on public.tasks
  for all to authenticated using (true) with check (true);

create policy "authenticated users can read task assignees" on public.task_assignees
  for select to authenticated using (true);
create policy "authenticated users can write task assignees" on public.task_assignees
  for all to authenticated using (true) with check (true);

create policy "authenticated users can read comments" on public.task_comments
  for select to authenticated using (true);
create policy "authenticated users can write comments" on public.task_comments
  for all to authenticated using (true) with check (true);

create policy "authenticated users can read documents" on public.documents
  for select to authenticated using (true);
create policy "authenticated users can write documents" on public.documents
  for all to authenticated using (true) with check (true);

create policy "authenticated users can read task files" on public.task_files
  for select to authenticated using (true);
create policy "authenticated users can write task files" on public.task_files
  for all to authenticated using (true) with check (true);

create policy "users can read own notifications" on public.notifications
  for select to authenticated using (recipient_id = auth.uid());
create policy "users can update own notifications" on public.notifications
  for update to authenticated using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());
create policy "authenticated users can create notifications" on public.notifications
  for insert to authenticated with check (true);

create policy "users can read own integrations" on public.integration_accounts
  for select to authenticated using (profile_id = auth.uid());
create policy "users can write own integrations" on public.integration_accounts
  for all to authenticated using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy "authenticated users can read audit logs" on public.audit_logs
  for select to authenticated using (true);
