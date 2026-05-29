insert into storage.buckets (id, name, public, file_size_limit)
values ('work-files', 'work-files', false, 20971520)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

create policy "authenticated users can read work files" on storage.objects
  for select to authenticated
  using (bucket_id = 'work-files');

create policy "authenticated users can upload work files" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'work-files');

create policy "authenticated users can update work files" on storage.objects
  for update to authenticated
  using (bucket_id = 'work-files')
  with check (bucket_id = 'work-files');

create policy "authenticated users can delete work files" on storage.objects
  for delete to authenticated
  using (bucket_id = 'work-files');
