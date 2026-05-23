create extension if not exists pgcrypto;

create type public.app_role as enum ('general', 'kids_korral', 'admin');
create type public.push_kind as enum ('live_now', 'kids_korral', 'event', 'urgent');
create type public.media_kind as enum ('sermon', 'livestream', 'replay');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role public.app_role not null default 'general',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.family_numbers (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  label text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.family_members (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  family_number_id uuid not null references public.family_numbers(id) on delete cascade,
  relationship text default 'parent_guardian',
  created_at timestamptz not null default now(),
  unique (profile_id, family_number_id)
);

create table public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  expo_push_token text not null unique,
  platform text not null check (platform in ('ios', 'android')),
  device_name text,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notification_preferences (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  live_now boolean not null default true,
  kids_korral boolean not null default true,
  event_reminders boolean not null default true,
  urgent boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.notification_audit (
  id uuid primary key default gen_random_uuid(),
  kind public.push_kind not null,
  sent_by uuid references public.profiles(id),
  target_family_number text,
  title text not null,
  body text not null,
  recipient_count integer not null default 0,
  status text not null default 'queued',
  error text,
  created_at timestamptz not null default now()
);

create table public.app_events (
  id text primary key,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  category text,
  source_url text,
  updated_at timestamptz not null default now()
);

create table public.media_items (
  id uuid primary key default gen_random_uuid(),
  kind public.media_kind not null default 'sermon',
  title text not null,
  speaker text,
  description text,
  youtube_video_id text,
  source_url text,
  published_at timestamptz,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.app_pages (
  slug text primary key,
  title text not null,
  body text,
  cover_image_url text,
  source_url text,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id),
  kind text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.family_numbers enable row level security;
alter table public.family_members enable row level security;
alter table public.push_tokens enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.notification_audit enable row level security;
alter table public.app_events enable row level security;
alter table public.media_items enable row level security;
alter table public.app_pages enable row level security;
alter table public.form_submissions enable row level security;

create or replace function public.current_user_role()
returns public.app_role
language sql
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create policy "users can read their profile" on public.profiles
  for select using (id = auth.uid() or public.current_user_role() = 'admin');

create policy "users can update their profile basics" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

create policy "admins manage profiles" on public.profiles
  for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create or replace function public.protect_profile_role_and_last_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' then
    if old.role <> new.role and public.current_user_role() <> 'admin' then
      raise exception 'Only admins can change roles';
    end if;

    if old.role = 'admin' and new.role <> 'admin' and (
      select count(*) from public.profiles where role = 'admin'
    ) <= 1 then
      raise exception 'At least one admin must remain';
    end if;

    new.updated_at = now();
    return new;
  end if;

  if tg_op = 'DELETE' and old.role = 'admin' and (
    select count(*) from public.profiles where role = 'admin'
  ) <= 1 then
    raise exception 'At least one admin must remain';
  end if;

  return old;
end;
$$;

drop trigger if exists protect_profile_role_and_last_admin on public.profiles;

create trigger protect_profile_role_and_last_admin
before update or delete on public.profiles
for each row execute function public.protect_profile_role_and_last_admin();

create policy "admins manage push tokens" on public.push_tokens
  for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy "users manage their preferences" on public.notification_preferences
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy "users read their family memberships" on public.family_members
  for select using (profile_id = auth.uid() or public.current_user_role() = 'admin');

create policy "users read linked family numbers" on public.family_numbers
  for select using (
    public.current_user_role() = 'admin'
    or exists (
      select 1
      from public.family_members
      where family_members.family_number_id = family_numbers.id
        and family_members.profile_id = auth.uid()
    )
  );

create policy "admins read family numbers" on public.family_numbers
  for select using (public.current_user_role() = 'admin');

create policy "admins manage family numbers" on public.family_numbers
  for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy "public app events are readable" on public.app_events
  for select using (true);

create policy "published media is readable" on public.media_items
  for select using (is_published = true);

create policy "public app pages are readable" on public.app_pages
  for select using (true);

create policy "admins manage app content" on public.app_events
  for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy "admins manage media" on public.media_items
  for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy "admins manage app pages" on public.app_pages
  for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');

create policy "users create form submissions" on public.form_submissions
  for insert with check (profile_id = auth.uid() or profile_id is null);

create policy "admins read form submissions" on public.form_submissions
  for select using (public.current_user_role() = 'admin');

create policy "staff read notification audit" on public.notification_audit
  for select using (
    public.current_user_role() = 'admin'
    or (public.current_user_role() = 'kids_korral' and kind = 'kids_korral' and sent_by = auth.uid())
  );
