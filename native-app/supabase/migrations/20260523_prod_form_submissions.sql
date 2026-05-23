alter table public.form_submissions
  add column if not exists source text not null default 'app',
  add column if not exists source_url text,
  add column if not exists status text not null default 'new';

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists push_tokens_profile_enabled_idx on public.push_tokens(profile_id, enabled);
create index if not exists push_tokens_token_idx on public.push_tokens(expo_push_token);
create index if not exists notification_preferences_live_now_idx on public.notification_preferences(live_now, profile_id);
create index if not exists family_members_family_number_idx on public.family_members(family_number_id);
create index if not exists family_members_profile_idx on public.family_members(profile_id);
create index if not exists family_numbers_number_idx on public.family_numbers(number);
create index if not exists app_events_starts_at_idx on public.app_events(starts_at);
create index if not exists media_items_published_at_idx on public.media_items(is_published, published_at desc);
create index if not exists form_submissions_kind_created_at_idx on public.form_submissions(kind, created_at desc);
create index if not exists form_submissions_status_created_at_idx on public.form_submissions(status, created_at desc);
create index if not exists notification_audit_created_at_idx on public.notification_audit(created_at desc);
