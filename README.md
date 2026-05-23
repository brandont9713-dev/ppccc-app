# Palo Pinto Cowboy Church App Prototype

This workspace contains a first-pass mobile app prototype for Palo Pinto Cowboy Church.

The current version is a dependency-free web prototype so it can run immediately in this environment. It is structured around the same screens and data concepts we would carry into a native iOS/Android app with React Native, Expo, Firebase, or Supabase.

## What is included

- Mobile-first app prototype in `public/`
- iOS/Android-ready metadata, manifest, icons, safe-area styling, and offline shell
- Events list with "add to calendar" download
- Live service screen with "Live Now" notification concept
- Secure giving flow as an external link
- Account and family profile concept
- Kids Korral number attachment
- Staff-only Kids Korral alert sender mock
- Architecture notes in `docs/app-plan.md`
- Sync plan in `docs/sync-integration-plan.md`
- Native iOS/Android plan in `docs/native-ios-android-plan.md`

## Run locally

Use the bundled Node runtime or any local Node install:

```powershell
& "C:\Users\Brand\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" .\server.mjs
```

Then open:

```text
http://localhost:4173
```

## Native app direction

The recommended production path is:

- React Native + Expo for iOS and Android, or Capacitor if keeping this exact web shell
- Supabase or Firebase for auth, database, and push tokens
- External giving provider for tithes and payments
- Separate staff/admin dashboard for events and alerts
- Website sync through APIs, webhooks, or scheduled importers
- Kids Korral push notifications as app-only data

## Expo native starter

The first production-oriented Expo app now lives in `native-app/`.

It includes a React Native app shell, Expo/EAS config, generated app icons, Supabase placeholders, biometric detection, Expo push registration, Supabase SQL schema, and Edge Function starter code for Kids Korral and Live Now notifications.

See:

- `native-app/README.md`
- `docs/apple-testflight-tonight.md`
