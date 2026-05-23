# App Role Permissions

## General User

General users are read-only for church content.

Allowed:

- View home, events, ministries, staff, sermons, live, and settings content
- Play embedded sermon and livestream videos
- Submit in-app forms and sign-up sheets
- Add public events to their personal phone calendar
- Manage their own account, notification preferences, and linked Kids Korral family number

Not allowed:

- Add/edit/delete church calendar events
- Edit website/app content
- Send Live Now notifications
- Send Kids Korral notifications
- View other users, family numbers, push tokens, or admin audit details

## Kids Korral Staff

Kids Korral staff can do everything a general user can do, plus send Kids Korral notifications only.

Allowed:

- Send Kids Korral push notification by family number through the server function
- Read only their own Kids Korral notification audit entries

Not allowed:

- Add/edit/delete church calendar events
- Send Live Now notifications
- Edit sermons, media, ministries, pages, or app content
- Manage users or roles
- Browse parent/user private data tables directly

## Admin

Admins can manage app operations.

Allowed:

- Add/edit/delete calendar events
- Add/edit sermons and media items
- Send Live Now notifications
- Send Kids Korral notifications
- Update user permissions
- Manage app pages/content
- Read admin audit logs and form submissions

## Enforcement

The app UI should hide unauthorized controls, but the backend is the real guard.

- `app_events`, `app_pages`, and published `media_items` are public-read and admin-write.
- `send-live-now` requires `admin`.
- `upsert-app-event` and `delete-app-event` require `admin`.
- `upsert-media-item` requires `admin`.
- `send-kids-korral-alert` allows only `admin` or `kids_korral`.
- `register-push-token` requires an authenticated user and stores tokens server-side with the service role; users should not directly read or write `push_tokens`.
- Role changes are admin-only, and the database trigger must prevent removing the last admin.
- General users cannot write operational tables or access other users' family numbers, push tokens, audit records, or profiles.

## Release Security Checks

- Confirm new signups default to `general`.
- Confirm `kids_korral` cannot call calendar, media, role, or Live Now functions.
- Confirm `general` cannot call any admin or staff send/edit function.
- Confirm family-number reads return only the signed-in user's linked family numbers unless the caller is admin.
- Confirm push tokens are only written through `register-push-token` and are not returned to normal users by RLS.
