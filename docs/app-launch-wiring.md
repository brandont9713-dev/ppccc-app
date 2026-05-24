# App Launch Wiring Notes

This is the short version of what still needs to be connected when vendor/API access is approved.

## Already Prepared In The App

- Teamup calendar display, generated cache fallback, and add-to-device-calendar flow.
- FaithConnector media/RSS fallback and in-app video player slots.
- Supabase function URL pattern for events and form submissions.
- Native iOS/Android WebView shell, platform detection, and native app styling.
- Account, role, Kids Korral, prayer/contact/signup, password reset, and push notification screens.
- Staff-only UI paths for admin, Live Now alerts, Kids Korral alerts, and user permissions.

## API/Webhook Values To Add

Add these values in `public/app.js` under `appConfig`, or move them into a production config endpoint before release:

- `contentSyncApiUrl`: approved endpoint for website page/home/ministry/staff content.
- `formForwardingWebhookUrl`: approved endpoint that forwards app prayer requests, contact forms, RSVPs, and suggestions into the church office workflow.
- `liveStatusApiUrl`: endpoint that tells the app whether church is live and which video ID/embed URL to show.
- `pushSendFunctionUrl`: server-side endpoint for role-checked Live Now and Kids Korral push notifications.
- `supabaseUrl` and `supabaseAnonKey`: production Supabase project values.

Never place service-role keys, private Teamup API keys, Apple push keys, or vendor admin passwords inside the app bundle.

## Supabase Items To Finish

- Run the production schema.
- Enable Supabase Auth and password reset email templates.
- Seed the first admin account.
- Enforce RLS policies for profiles, roles, family links, form submissions, and push tokens.
- Deploy edge functions for form submission, Teamup sync, push token registration, and notification sending.
- Add rate limits and audit logs for staff actions.

## Website/Vendor Items To Finish

- FaithConnector: approved content feed/API/export and form integration/webhook.
- Teamup: confirm public feed and provide private API key only if app-side event editing is approved.
- YouTube/media: official channel, playlist, live stream video ID strategy, and embed approval.
- Giving provider: final mobile-safe giving URL.
- Church office: final destination for prayer requests, contact messages, feedback, and signups.

