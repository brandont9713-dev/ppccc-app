alter table public.form_submissions
  add column if not exists source_ip_hash text,
  add column if not exists user_agent text;

create index if not exists form_submissions_source_ip_hash_created_at_idx
  on public.form_submissions(source_ip_hash, created_at desc);

revoke select on public.profiles from anon;
revoke insert on public.form_submissions from anon, authenticated;

