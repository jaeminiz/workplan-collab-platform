-- Production readiness verification queries.
-- Run this in Supabase SQL Editor after applying migrations 0001-0004.

select
  'tasks archive columns' as check_name,
  count(*) = 3 as ok,
  array_agg(column_name order by column_name) as details
from information_schema.columns
where table_schema = 'public'
  and table_name = 'tasks'
  and column_name in ('archived_at', 'archived_by', 'assignee_id');

select
  'work-files bucket' as check_name,
  count(*) = 1 as ok,
  jsonb_agg(jsonb_build_object(
    'id', id,
    'public', public,
    'file_size_limit', file_size_limit
  )) as details
from storage.buckets
where id = 'work-files'
  and public = false;

select
  'profile insert policy' as check_name,
  count(*) >= 1 as ok,
  array_agg(policyname order by policyname) as details
from pg_policies
where schemaname = 'public'
  and tablename = 'profiles'
  and cmd = 'INSERT';

select
  'audit log insert policy' as check_name,
  count(*) >= 1 as ok,
  array_agg(policyname order by policyname) as details
from pg_policies
where schemaname = 'public'
  and tablename = 'audit_logs'
  and cmd = 'INSERT';

select
  'storage work-files policies' as check_name,
  count(*) >= 4 as ok,
  array_agg(policyname order by policyname) as details
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and qual like '%work-files%';

select
  'seed row counts' as check_name,
  true as ok,
  jsonb_build_object(
    'customers', (select count(*) from public.customers),
    'projects', (select count(*) from public.projects),
    'tasks', (select count(*) from public.tasks),
    'task_comments', (select count(*) from public.task_comments)
  ) as details;
