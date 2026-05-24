grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on public.profiles to authenticated, service_role;
grant select on public.profiles to anon;

grant select, insert, update, delete on public.family_numbers to authenticated, service_role;
grant select, insert, update, delete on public.family_members to authenticated, service_role;
grant select, insert, update, delete on public.push_tokens to authenticated, service_role;
grant select, insert, update, delete on public.notification_preferences to authenticated, service_role;
grant select, insert, update, delete on public.notification_audit to authenticated, service_role;

grant select on public.app_events to anon, authenticated;
grant insert, update, delete on public.app_events to authenticated, service_role;

grant select on public.media_items to anon, authenticated;
grant insert, update, delete on public.media_items to authenticated, service_role;

grant select on public.app_pages to anon, authenticated;
grant insert, update, delete on public.app_pages to authenticated, service_role;

grant insert on public.form_submissions to anon, authenticated, service_role;
grant select, update, delete on public.form_submissions to authenticated, service_role;

grant usage, select on all sequences in schema public to anon, authenticated, service_role;
