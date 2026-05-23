# Palo Pinto Cowboy Church App Plan

## Product Goals

The app should be more than a mobile copy of the website. Its strongest v1 value is timely communication:

- "Live Now" and urgent push notifications
- Upcoming events that can be added to a phone calendar
- Kids Korral private parent alerts
- Safe outbound giving flow that does not store card or bank data

## V1 Screens

- Home: service time, next event, live status, quick actions
- Events: upcoming events, detail view, add-to-calendar
- Live: livestream link, notification opt-in, recent messages
- Give: external secure giving link, no in-app payment collection
- Account: parent login, family profile, notification preferences
- Kids Korral: parent number management and staff alert sender
- Contact/Prayer: contact actions and request form

## Account Model

Users can sign in individually, while families can support one or two adults.

Password reset should be handled by the production auth provider. The app asks for an email, calls the backend/auth provider, and always shows a neutral message so people cannot use the reset screen to discover whether an email has an account.

Suggested fields:

- `users`: id, name, email, phone, role, status, created_at
- `families`: id, display_name, primary_user_id
- `family_members`: family_id, user_id, relationship
- `children`: id, family_id, preferred_name, kids_korral_number, room
- `push_tokens`: id, user_id, platform, token, enabled

Avoid storing sensitive child data in v1. No birthdates, medical notes, addresses, custody details, or school details unless church leadership formally decides it is necessary.

## Login Tiers

Use role-based access control from the start.

### End User

General church app user.

Allowed:

- View events
- Add events to phone calendar
- Watch live service
- Open secure giving link
- Manage own family profile
- Attach Kids Korral number
- Manage notification preferences

Not allowed:

- Send broadcast notifications
- Send Kids Korral alerts
- Add or edit app-wide content
- Add users or change permissions

### Kids Korral Staff

Trusted Sunday morning staff role focused only on Kids Korral.

Allowed:

- View Kids Korral lookup
- Send Kids Korral parent push notifications
- View alert history for accountability

Not allowed:

- Change user permissions
- Add admins
- Edit app-wide content
- Send general broadcast notifications unless separately granted

### Admin

Dedicated church leadership or communications users.

Allowed:

- Add and manage users
- Update user roles and permissions
- Add, edit, and remove app content
- Add and edit events
- Send general push notifications
- Send Kids Korral alerts
- View audit logs

Recommended production roles:

- `end_user`
- `kids_korral`
- `admin`

For production, enforce these roles on the backend as well as in the app UI. Hiding a button in the app is not enough security by itself.
Use native biometrics (Face ID, Touch ID, or Android fingerprint) as a local unlock before staff/admin actions, especially role changes and Kids Korral alert sends. Biometrics do not replace backend authentication or server-side role checks.

Initial rule:

- Brandon's account starts as `admin`.
- Every new signup automatically starts as `end_user`.
- Only an existing admin can promote a user to `kids_korral` or `admin`.
- The app should not show a public admin mode or role picker. Admin tools appear only inside an approved admin account.
- Role changes should be logged in `audit_logs`.

Security details live in `docs/security-plan.md`.

## Kids Korral Alert Flow

1. Parent creates account.
2. Parent attaches Kids Korral number to their family profile.
3. Kids Korral staff sign into a staff-only view.
4. Staff search/select the number and send an alert.
5. All linked parent devices receive a push notification.
6. The app logs who sent the alert and when.

Suggested alert fields:

- `kids_korral_alerts`: id, number, family_id, sent_by, message, status, created_at
- `audit_logs`: id, actor_user_id, action, target_type, target_id, metadata, created_at

## Giving Security

The app should not process or store payment details. Use a secure external provider such as ChurchTrac Giving, Tithe.ly, Subsplash Giving, Stripe Checkout, or PayPal Giving.

The app can show a "Give" button that opens the provider's hosted payment page in the system browser.

## Push Notifications

Suggested notification topics:

- General
- Live Now
- Kids Korral
- Youth
- Arena
- Women
- Men
- Weather / Closures

For production, use Expo Notifications, Firebase Cloud Messaging, or OneSignal. Kids Korral alerts should be targeted directly to linked parent devices, not broadcast topics.

## Website Parity

The app should mirror the website's major sections while using native app navigation:

- Live
- Visitors
- Service Times
- Get Directions
- About Us
- Mission Statement
- Staff
- Elders and Lay Pastors
- Team Leaders
- Teams and ministries
- Sermons
- Bible Study
- Text Alerts
- Calendar
- Prayer Requests
- Testimonies
- Connect Groups
- Contact

The app should deep-link to social platforms where possible:

- Facebook: `https://www.facebook.com/palopintocowboychurch/`
- Instagram: `https://www.instagram.com/palopintocowboychurch/`
- YouTube: `https://www.youtube.com/c/PaloPintoCountyCowboyChurchPPCCC`
- Email: `ppcccoffice@gmail.com`

On iOS and Android, production can try app-specific deep links first and fall back to the normal web URL if the social app is not installed.

## Keeping Website and App in Sync

The app should not require the church to enter the same information twice.

Best production options:

1. Shared content backend

   The website and app both read from the same database or CMS. This is the cleanest long-term option because updates are instant and structured.

2. Website API or feed

   If FaithConnector exposes an events feed, calendar feed, RSS feed, or JSON endpoint, the app can read from that. This is the best option if the church keeps the current website platform.

3. Scheduled website importer

   A small backend job checks the website every few minutes, extracts approved content such as home graphics, calendar items, livestream status, and ministry links, then stores normalized app data. This avoids editing twice, but it needs monitoring because website HTML can change.

Recommended v1:

- Events: sync from the website calendar or a shared calendar feed.
- Home graphics: pull from the website's uploaded image URLs or an approved app content table.
- Live: app checks the livestream page/status and shows "Live Now" when active.
- Ministries and pages: keep structured links in app config, refreshed from the site navigation when needed.
- Admin edits: Brandon can override app content from an admin account when something needs to be app-specific.

For reliability, the app should cache the last successful content sync so it still opens if the website is slow or offline.

Teamup events implementation path:

- Ask a calendar admin to open Teamup Preferences > iCalendar Feeds and copy the read-only feed URL for the public church calendar or each needed sub-calendar.
- Store the feed URL on the backend, not in the mobile app bundle.
- Run a scheduled job that downloads the iCalendar feed, parses events, and writes normalized rows to the app events table.
- The mobile app reads events from the app backend by month.
- A starter local parser exists at `tools/import-teamup-ics.mjs` for converting an `.ics` export into app-shaped JSON.

Prototype status:

- The current prototype uses live website image URLs and live website links.
- It does not yet automatically parse every website update into app screens.
- True automatic sync needs a backend/API/feed/importer in the production build.
- Until that backend exists, content added to the prototype manually will not automatically follow every future website edit.

## Recommended Stack

Fastest serious build:

- React Native + Expo
- Supabase Auth and Postgres, or Firebase Auth and Firestore
- Expo Notifications or Firebase Cloud Messaging
- Separate admin dashboard for staff
- External giving provider

## App Store Needs

- Apple Developer Program account
- Google Play Console account
- Privacy policy
- Terms or acceptable use notes
- Support email
- App icon and screenshots
- Clear explanation of push notification use

## Role Rules

- General users are read-only for church content, calendar, sermons, and live content. They can play videos, submit forms, use sign-up sheets, manage their own account, and add events to their personal phone calendar.
- Kids Korral staff can do everything general users can do, plus send Kids Korral push notifications only.
- Admins can add/edit/delete calendar events, manage sermons/media, send Live Now notifications, send Kids Korral notifications, and update user permissions.

## Sermons

Sermons can stay in the app using an embedded YouTube player. Store the YouTube video id in Supabase `media_items.youtube_video_id`, render it with the native WebView player, and keep an explicit fallback button to open YouTube only when needed.

Admins can add or edit sermon records. General users and Kids Korral staff can only view/play published sermons.
