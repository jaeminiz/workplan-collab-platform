create policy "users can insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

create policy "authenticated users can create audit logs" on public.audit_logs
  for insert to authenticated with check (true);
