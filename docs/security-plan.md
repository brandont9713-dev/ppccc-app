# Security Plan

Security target: protect church members, family accounts, Kids Korral numbers, push tokens, and admin tools. No system is impossible to hack or DDoS, so production must use layered controls, least-privilege data access, logging, monitoring, and rapid revocation.

## Password Reset

- Use a trusted auth provider such as Supabase Auth, Firebase Auth, Auth0, or Cognito.
- The app collects an email and calls a backend/auth-provider reset endpoint.
- Always show the same response: "If that email has an account, a reset link will be sent."
- Never confirm whether an email exists.
- Reset links must be single-use, short-lived, HTTPS-only, and generated server-side.
- Rate-limit reset requests by IP, email hash, device, and account.
- Log reset request attempts and successful password changes.

Recommended endpoints:

```txt
POST /api/auth/password-reset
POST /api/auth/password-update
POST /api/auth/logout-all-devices
```

## Authentication

- Require verified email before enabling family/Kids Korral features.
- Require strong passwords or passwordless magic links from a trusted provider.
- Require MFA for `admin` and `kids_korral` staff roles.
- Add native biometric unlock for sensitive app areas: Face ID, Touch ID, or Android fingerprint before admin actions, Kids Korral alert sending, and role changes.
- Biometrics should unlock a local session only; they do not replace backend authentication or server-side role checks.
- Use short-lived access tokens and refresh tokens managed by the auth provider.
- Never store auth secrets, service keys, private Teamup keys, APNs keys, FCM keys, or database admin keys in the mobile app.

## Authorization

- Enforce every permission on the backend.
- Client-side hidden buttons are UX only, not security.
- Every API request must check the authenticated user id and role.
- New signups default to `end_user`.
- Only an existing admin can promote another user.
- Admin self-protection: at least one admin must remain active.

Roles:

- `end_user`
- `kids_korral`
- `admin`

## Kids Korral Data

Store the minimum possible data:

- family display name
- parent user ids
- Kids Korral number
- push token ids
- alert history

Avoid in v1 unless formally approved:

- child birthdates
- medical notes
- custody notes
- school information
- addresses
- photos of children

## Push Notifications

- Store push tokens server-side only.
- Tokens belong to a user and device.
- Kids Korral alerts must target linked parent devices only.
- General app users must not be able to send push notifications.
- Require confirmation before sending Kids Korral or live/broadcast pushes.
- Log every send attempt, success, failure, sender, recipient family id, and message type.
- Add server-side rate limits and cooldowns.
- Validate push payloads server-side: authenticated user, Expo token shape, platform allow-list, message length limits, and staff/admin role check before every send.
- Treat Expo push tokens as private operational data. They are written by a function using the service role and should not be directly selectable by general users.

## Database Rules

Required tables:

```txt
users
families
family_members
kids_korral_profiles
push_tokens
notification_preferences
kids_korral_alerts
role_assignments
audit_logs
security_events
```

Data access rules:

- Users can read/update only their own profile.
- Users can read only their linked family Kids Korral number and update family mappings only through approved admin/staff flows.
- Kids Korral staff can send alerts but cannot browse unrelated personal data.
- Admins can manage users and roles.
- Audit logs are admin-readable only and append-only.
- Calendar event and sermon/media mutations must go through admin-only functions, not direct client writes.

## Abuse And DDoS Protection

- Use managed hosting with DDoS protection, such as Cloudflare, Vercel, Netlify, Firebase, or Supabase edge protections.
- Put API endpoints behind rate limits.
- Cache public content and calendar events.
- Use bot protection/WAF rules on auth, forms, reset password, and push send endpoints.
- Set per-user and per-role notification quotas.
- Add request body limits and input validation.
- Monitor spikes in login failures, reset attempts, form submissions, and notification sends.

## App Privacy

- No ads.
- No ad SDKs.
- No selling data.
- No background location tracking.
- No hidden background data collection.
- No analytics that identify children or families.
- Collect only data needed for church communication and Kids Korral alerts.

## Production Blockers

Do not launch real accounts, Kids Korral alerts, admin tools, or push notifications until these exist:

- backend auth provider
- verified email flow
- password reset flow
- MFA for staff/admin
- server-side RBAC
- database row-level security or equivalent API checks
- push provider credentials
- audit logs
- rate limits
- privacy policy
- incident/revocation plan
- TestFlight security smoke test proving `general`, `kids_korral`, and `admin` restrictions match `docs/role-permissions.md`

## Role Lockdown Update

- General users are read-only for church content, events, sermons, and live content, with normal interaction for videos, forms, sign-ups, account settings, and personal notification preferences.
- Kids Korral staff can do everything general users can do, plus send Kids Korral alerts only through the server function.
- Kids Korral staff cannot add/edit/delete calendar events, send Live Now notifications, edit app content, manage roles, or browse parent/user private data tables.
- Admins are the only users allowed to add/edit/delete calendar events, edit media/sermons, send Live Now notifications, and update permissions.
- Backend checks must enforce this even if UI buttons are hidden.
