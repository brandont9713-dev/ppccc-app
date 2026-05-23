# Apple TestFlight Path

This is the fastest practical path to get the app onto iPhones for testing.

## Accounts Needed

- Apple Developer Program membership
- Expo account
- GitHub repository connected to the project
- Supabase project

## Local Requirements

- EAS CLI
- The portable Node.js setup already added under `tools/`

```powershell
cd native-app
..\tools\node-v24.16.0-win-x64\npm.cmd install
.\scripts\eas-login.ps1
..\tools\node-v24.16.0-win-x64\node.exe node_modules\eas-cli\bin\run build:configure
```

## First iOS Development Build

```powershell
.\scripts\build-ios-dev.ps1
```

Use this for early device testing. It is faster than App Store review and supports native modules like notifications and biometrics.

## TestFlight Build

```powershell
.\scripts\build-ios-testflight.ps1
.\scripts\submit-ios-testflight.ps1
```

Apple review is still required before external TestFlight users can test. Internal users on the Apple Developer team are faster.

## Security Gate Before Inviting Testers

- Apply `native-app/supabase/schema.sql` and `native-app/supabase/profile-trigger.sql`.
- Create one admin account with `native-app/supabase/admin-setup.sql`, then confirm at least one admin remains.
- Deploy these Supabase Edge Functions: `register-push-token`, `send-kids-korral-alert`, `send-live-now`, `upsert-app-event`, `delete-app-event`, and `upsert-media-item`.
- Set Supabase function secrets for `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`; never place the service role key in EAS, `.env`, or the app bundle.
- Smoke test three accounts: `general`, `kids_korral`, and `admin`.
- Confirm `general` cannot send push notifications or edit events/media.
- Confirm `kids_korral` can send only Kids Korral alerts and cannot edit calendar/media or send Live Now.
- Confirm only `admin` can edit calendar events, edit sermon/media records, send Live Now, and update roles.
- Confirm Expo/APNs push credentials are configured in EAS before testing real notifications.
- Confirm the privacy policy covers account data, push tokens, Kids Korral family numbers, and no sale of data.

## Required Before Real Kids Korral Push

- Supabase schema applied
- Supabase auth enabled
- Expo push credentials configured
- iOS APNs credentials created through Apple
- Push token registration implemented
- Staff-only send endpoint implemented
- Parent/family number mapping in Supabase
