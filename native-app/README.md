# PPCCC Native App

This is the Expo/React Native starter for the production iOS and Android app.

The current `public/` app remains the visual prototype. This folder is where the true native app will live.

## What This Includes

- Expo app config for iOS and Android
- Supabase client placeholder
- Expo Notifications registration placeholder
- Biometric readiness check with Face ID / Touch ID / Android fingerprint support
- EAS build config for internal and production builds

## Required Accounts

- Apple Developer account for iOS device builds, TestFlight, and App Store release
- Google Play Console account for Android internal testing and Play Store release
- Expo account for EAS builds and updates
- Supabase project for auth, database, roles, password reset, Kids Korral data, and audit logs
- GitHub repository for version control and maintenance

## Environment

Create a `.env` file later:

```text
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
```

The service role key must never go in the app. It belongs only in Supabase Edge Functions or another backend.

## Install And Run

This workspace has a portable Node.js install under `../tools/`, so you do not need a system-wide Node install for this project.

```powershell
cd native-app
..\tools\node-v24.16.0-win-x64\npm.cmd install
.\scripts\start-lan.ps1
```

For the first real device build:

```powershell
.\scripts\eas-login.ps1
..\tools\node-v24.16.0-win-x64\node.exe node_modules\eas-cli\bin\run build:configure
.\scripts\build-ios-dev.ps1
```

## How Updates Work

Small JavaScript/UI fixes can ship through EAS Update:

```powershell
npm run update
```

Native changes, permission changes, icons, splash screens, notification entitlement changes, or new native libraries require a new App Store / Play Store build.

## Tonight Path

1. Create the GitHub repository and commit this workspace.
2. Create an Expo account and run `.\scripts\eas-login.ps1`.
3. Run `..\tools\node-v24.16.0-win-x64\node.exe node_modules\eas-cli\bin\run build:configure`.
4. Create the Supabase project.
5. Run the SQL files in `supabase/` in this order:
   - `schema.sql`
   - `profile-trigger.sql`
   - create your account in the app
   - `admin-setup.sql` after replacing `YOUR_EMAIL_HERE`
6. Add `.env` with Supabase URL and anon key.
7. Run `..\tools\node-v24.16.0-win-x64\npm.cmd install`.
8. Run `.\scripts\build-ios-dev.ps1`.
9. Install the development build on your iPhone.
10. After it is stable, run `.\scripts\build-ios-testflight.ps1` and then `.\scripts\submit-ios-testflight.ps1`.
