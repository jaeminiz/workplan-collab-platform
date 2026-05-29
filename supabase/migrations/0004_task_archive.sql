alter table public.tasks
  add column if not exists archived_at timestamptz,
  add column if not exists archived_by uuid references public.profiles(id);

create index if not exists tasks_archived_at_idx on public.tasks (archived_at);
