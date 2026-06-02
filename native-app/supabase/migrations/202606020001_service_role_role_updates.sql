create or replace function public.protect_profile_role_and_last_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' then
    if old.role <> new.role and auth.role() <> 'service_role' and public.current_user_role() <> 'admin' then
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
