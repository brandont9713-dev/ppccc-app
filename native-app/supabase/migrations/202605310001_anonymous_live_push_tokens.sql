alter table public.push_tokens
  alter column profile_id drop not null;

create index if not exists push_tokens_enabled_profile_idx
  on public.push_tokens(enabled, profile_id);
