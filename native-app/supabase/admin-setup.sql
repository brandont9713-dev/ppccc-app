-- Run this after your own account signs up.
-- Replace the email with your actual login email.

update public.profiles
set role = 'admin'
where email = 'YOUR_EMAIL_HERE';

insert into public.notification_preferences (profile_id)
select id
from public.profiles
where email = 'YOUR_EMAIL_HERE'
on conflict (profile_id) do nothing;
