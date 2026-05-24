# Security Hardening Checklist

This review focuses on the PPCCC mobile app backend surface: Supabase schema, row-level security, Edge Functions, push notifications, form submissions, native shell permissions, and release secrets. It is written as a launch checklist, not a theoretical security plan.

## Current State

- Supabase tables have RLS enabled in `native-app/supabase/schema.sql`.
- Privileged Edge Functions verify the Supabase user token and role before calendar, media, Kids Korral, and Live Now actions.
- Push token registration requires a signed-in user.
- Form submissions can be anonymous or signed in and are written through `submit-app-form` with basic IP/user cooldowns.
- Service-role keys are read from Supabase Edge Function environment variables, not from the mobile bundle.
- Local staff/admin passcode unlocks have been removed; staff permissions now require Supabase Auth plus role checks.
- Supabase function deployment keeps JWT verification on for authenticated functions; only public read/submit functions skip JWT verification.
- `.gitignore` excludes `.env`, `.supabase-token`, Supabase temp files, EAS local files, and logs.

## Launch Blockers

### Closed - Remove beta passcode/admin unlock before public launch

Status:

- Removed the local staff passcode flow from `public/app.js`.
- Staff/admin actions now require a signed-in Supabase session and role checks.

Remaining before production:

- Smoke test real `general`, `kids_korral`, and `admin` accounts.
- Add biometric unlock as a local convenience layer before sensitive staff actions.

### P1 - Strengthen abuse protection on public form submissions

Observed:

- `native-app/supabase/functions/submit-app-form/index.ts` allows anonymous submissions.
- It validates allowed form kinds and trims payloads, which is good.
- It enforces basic IP and signed-in user cooldowns.

Required before production:

- Add bot protection for anonymous website/app submissions, such as Cloudflare Turnstile or hCaptcha.
- Add duplicate-submission detection for the same form/email/message in a short window.
- Add request body size limits at the edge/proxy layer.
- Add office workflow fields: `status`, `assigned_to`, `handled_at`, and notes if the church wants in-app triage later.

Beta allowance:

- Acceptable for small trusted beta if the function is monitored and notification emails are not exposed publicly.

### P0 - Add rate limits/cooldowns to notification send functions

Observed:

- `send-live-now` requires `admin`.
- `send-kids-korral-alert` requires `admin` or `kids_korral`.
- Both write `notification_audit`.
- Both now enforce basic per-sender cooldowns: Live Now max 1 per 10 minutes, Kids Korral max 5 per 5 minutes.

Required before production:

- Add duplicate family/message cooldowns and an admin override plan.
- Add a server-side disable switch for push sends.
- Add audit fields for client platform, app version, and request id.
- Add a second confirmation in the UI for broad notifications.

Beta allowance:

- Can test with trusted staff only after verifying role checks with real `general`, `kids_korral`, and `admin` accounts.

### P0 - Smoke test RLS with real accounts

Observed:

- RLS is enabled across private tables.
- Policies appear aligned with the role model, but they have not been proven from real signed-in users in this review.
- `20260523_app_api_grants.sql` grants broad table privileges to `authenticated`; RLS should still restrict rows/actions, but broad grants increase the need for tests.

Required before production:

- Create three real accounts: `general`, `kids_korral`, and `admin`.
- From each account, verify direct table access and each Edge Function:
  - `general` cannot send push, edit events, edit media, read other profiles, read push tokens, read form submissions, or read unrelated family numbers.
  - `kids_korral` can send only Kids Korral alerts and cannot send Live Now, edit events/media, manage roles, or browse private tables.
  - `admin` can perform intended admin actions.
- Keep the test evidence in `docs/external-beta-release-readiness.md` or a release checklist.

### P0 - Confirm push credentials and Expo/APNs path on physical devices

Observed:

- `native-app/src/lib/notifications.ts` requests permission, gets an Expo push token, and calls `register-push-token`.
- `register-push-token` requires authentication and validates token shape/platform.
- App config includes iOS and Android notification permissions.

Required before production:

- Confirm EAS/APNs push credentials are configured for the production bundle id.
- Confirm a physical iPhone receives a real Kids Korral alert.
- Confirm a physical iPhone receives a real Live Now alert.
- Confirm a signed-out user cannot register a push token to an account.
- Confirm disabled notification preferences are respected.
- Confirm Apple Watch notification mirroring works as expected from iPhone notification settings. The app does not need a Watch app for normal mirrored notifications.

## High-Priority Hardening

### P1 - Tighten public grants for least privilege

Observed:

- `native-app/supabase/migrations/202605240001_security_hardening.sql` revokes anonymous profile select and public direct form inserts.
- RLS should prevent anonymous profile reads because the profile policy depends on `auth.uid()` or admin role, but the grant is unnecessary.
- The same migration grants direct authenticated write privileges on operational tables where the intended path is Edge Functions plus RLS.

Recommended:

- Remove unnecessary anon grants on private tables.
- Prefer no direct client writes to `push_tokens`, `notification_audit`, `family_numbers`, `family_members`, `app_events`, `media_items`, and `app_pages` unless a specific RLS-tested use case requires it.
- Keep function-based writes for privileged or sensitive workflows.

### P1 - Keep Edge Function JWT verification on unless there is a specific reason

Observed:

- `native-app/scripts/deploy-supabase-functions.ps1` deploys public functions with `--no-verify-jwt` and authenticated functions with JWT verification on.
- The functions manually call `auth.getUser()` where needed, and public functions need anonymous access.

Recommended:

- Keep manual role checks regardless. Hidden UI buttons are not authorization.
- For public functions, keep `--no-verify-jwt` only where anonymous access is intentional.

### P1 - Add ownership and approval workflow for Kids Korral family numbers

Observed:

- `link-family-number` lets a signed-in user create or link a family number with child and pickup names.
- This is convenient, but it means a parent can claim a number without staff approval.

Recommended:

- Add a `pending_verification` status to family links.
- Let Kids Korral staff/admin approve or reject links.
- Do not send Kids Korral alerts to newly claimed numbers until the link is verified.
- Store only the minimum required child/pickup confirmation data.

### P1 - Strengthen form/privacy workflow

Observed:

- Prayer requests, contact messages, feedback, and signups can be stored in `form_submissions`.
- Optional Resend email notification is supported with `RESEND_API_KEY`, `FORM_NOTIFICATION_EMAIL`, and `FORM_NOTIFICATION_FROM`.

Recommended:

- Decide who receives each form type.
- Add a data retention window for prayer/contact/signup submissions.
- Add export/delete procedure for user data deletion requests.
- Add moderation expectation for prayer requests, since these may contain sensitive information.

### P1 - Lock production Supabase ownership and environment boundaries

Required:

- Use a production Supabase project owned by the church or an approved long-term admin.
- Keep development/test data separate from production data.
- Store only public anon key in app config.
- Store service role, Resend, Teamup private API, Apple, and Expo tokens only in Supabase/EAS/GitHub secrets.
- Rotate any key that was ever pasted into chat, screenshots, docs, or a non-secret file.

## Medium-Priority Hardening

### P2 - Native WebView navigation allow-list

Observed:

- `native-app/App.tsx` uses `originWhitelist={["*"]}`.
- The embedded app source is bundled HTML, and the bridge intercepts known external routes, but broad origin allow-list is still loose.

Recommended:

- Restrict navigations to bundled content and intentional external handoffs.
- Open non-allowed URLs with `Linking.openURL` or block them.
- Keep YouTube embeds allowed only for sermon/livestream player URLs.

### P2 - Dependency and update discipline

Observed:

- `native-app/package.json` uses several `"latest"` dependencies.
- That is useful while moving fast, but it makes builds less predictable.

Recommended:

- Pin Expo SDK, React Native, React, and Expo module versions before production.
- Run `npm audit --omit=dev` before each release.
- Avoid `npm audit fix --force` unless reviewed, because it can downgrade or break Expo dependency alignment.

### P2 - Incident response and staff offboarding

Required before public launch:

- Document who can disable staff accounts.
- Document how to remove a device push token.
- Document how to demote a Kids Korral staff/admin user.
- Document how to disable all push sends temporarily.
- Keep at least two trusted admins, but prevent accidental removal of the last admin.

## Pre-Beta Security Smoke Test

Run this before the next external beta group:

1. Create/confirm one `general`, one `kids_korral`, and one `admin` account.
2. Confirm new signup defaults to `general`.
3. Confirm password reset sends a neutral response and email.
4. Confirm `general` cannot call:
   - `send-live-now`
   - `send-kids-korral-alert`
   - `upsert-app-event`
   - `delete-app-event`
   - `upsert-media-item`
5. Confirm `kids_korral` can call only `send-kids-korral-alert`.
6. Confirm `admin` can call all intended staff/admin functions.
7. Confirm form submissions save and notify the church office.
8. Confirm anonymous form spam protections are enabled or deliberately deferred for small beta only.
9. Confirm push token registration requires a signed-in account.
10. Confirm a linked, verified family number receives the Kids Korral push.
11. Confirm unlinked accounts do not receive that Kids Korral push.
12. Confirm Live Now only sends to users with `live_now = true`.
13. Confirm app privacy policy covers accounts, push tokens, Kids Korral family numbers, forms, and data deletion.

## Production Decision

The app can continue external beta with the current backend shape if testers are trusted and staff features are carefully controlled. It should not go fully public until the P0 items above are complete, especially removal of local admin unlock, real rate limits, RLS smoke tests, and push notification device tests.
