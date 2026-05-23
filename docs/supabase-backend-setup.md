# Supabase Backend Setup

This is what "backend access" means for this app.

## What We Need

- A Supabase account
- A Supabase project
- Project URL: `https://lwrnoexybfqykfvxgjjs.supabase.co`
- Public publishable/anon key
- Service role key, used only in Edge Functions and never committed to the app

## Create The Project

1. Go to `https://supabase.com/dashboard/projects`.
2. Create a project, for example `ppccc-app`.
3. Save the database password somewhere secure.
4. Wait for the project to finish provisioning.

## Apply The Database Schema

In Supabase:

1. Open SQL Editor.
2. Run `native-app/supabase/schema.sql`.
3. Run `native-app/supabase/profile-trigger.sql`.
4. Sign up once in the app.
5. Edit `native-app/supabase/admin-setup.sql` and replace `YOUR_EMAIL_HERE`.
6. Run `native-app/supabase/admin-setup.sql`.

## Add App Environment

Create `native-app/.env`:

```text
EXPO_PUBLIC_SUPABASE_URL=https://lwrnoexybfqykfvxgjjs.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-public-publishable-or-anon-key
```

Do not put the service role key here.

## Deploy Edge Functions

Functions to deploy:

- `register-push-token`
- `send-kids-korral-alert`
- `send-live-now`
- `upsert-app-event`
- `delete-app-event`
- `upsert-media-item`

Required function secrets:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-public-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Access Rules

- General users are read-only for church content and can submit forms/signups.
- Kids Korral staff can only send Kids Korral alerts in addition to general-user actions.
- Admins can edit calendar events, sermons/media, app content, roles, and Live Now alerts.
