# iOS and Android Readiness Plan

This prototype is now prepared to move into a native mobile shell. The current web app can be wrapped with Capacitor, Expo/React Native, or another native framework, but the recommended path is below.

## Recommended Build Path

Use a native shell with shared app logic:

- Best fit for this app: React Native + Expo, or Capacitor if we keep this exact HTML/CSS/JS build.
- Backend: Supabase or Firebase for auth, roles, push tokens, Kids Korral records, forms, and sync cache.
- Website sync: backend importers/webhooks feed native app data.
- Giving: trusted provider handoff for security.

## Current Mobile-Ready Work

Added to the prototype:

- `public/app.webmanifest`
- app icons in `public/icons/`
- iOS mobile web metadata
- Android/PWA theme metadata
- safe-area support for notches and gesture bars
- touch-friendly UI handling
- app-shell service worker for offline startup
- sync registry for later API/webhook integration

## Native Features Needed

### iOS

- Apple Developer account.
- Bundle ID, for example `com.palopintocowboychurch.app`.
- APNs push notification certificate/key.
- App Store privacy labels.
- Native notification permission flow.
- Face ID / Touch ID local unlock for staff/admin sensitive actions.
- Universal/deep links for maps, email, phone, social apps, and giving provider.
- TestFlight testing before App Store submission.

### Android

- Google Play Developer account.
- Package name, for example `com.palopintocowboychurch.app`.
- Firebase Cloud Messaging for push notifications.
- Play Store data safety form.
- Native notification channels.
- Android biometric prompt for staff/admin sensitive actions.
- Android intent handling for maps, email, phone, social apps, and giving provider.
- Internal testing before Play Store release.

## App-Only Data

These should not be synced from the website:

- Kids Korral family number records.
- Parent push notifications.
- Push token/device records.
- User accounts and roles.
- Admin permission updates.
- Alert send history.

## Website-Synced Data

These should come from the website, Teamup, media feeds, or backend importers:

- Home images and announcement cards.
- Visitors, service times, mission, staff, elders, team leaders.
- Ministry pages and photos.
- Sermons and Bible study media.
- Prayer/testimony/connect resources.
- Teamup calendar events.
- Livestream status.

## Push Notification Types

- Live now.
- Kids Korral parent needed.
- Event reminders.
- Weather/cancellation updates.
- Prayer or church-wide announcements.

Kids Korral push must be role-gated and logged.

## Privacy And Background Data Policy

- No ads.
- No ad SDKs.
- No selling personal data.
- No background location tracking.
- No hidden background data collection.
- Calendar/content refresh should happen on app open, pull-to-refresh, scheduled backend sync, or limited OS-approved refresh only.
- Push notifications must require user permission and should be limited to church alerts, live service notices, selected event reminders, and Kids Korral alerts.
- Kids Korral numbers, roles, accounts, push tokens, and alert history must be stored in a secure backend before production launch.

## Native App Store Checklist

- Replace placeholder app icon with final church-approved icon.
- Confirm app name and subtitle.
- Add splash screen.
- Add privacy policy URL.
- Add terms/contact URL.
- Connect auth provider.
- Connect backend API.
- Connect push notification provider.
- Connect calendar/event sync.
- Confirm giving provider handoff.
- Test on iPhone SE, standard iPhone, iPhone Pro Max, small Android, large Android.
- Test light/dark mode.
- Test low/no internet startup.
- Test notification permissions.
- Test back button behavior on Android.

## Suggested Technical Steps

1. Choose Expo/React Native or Capacitor.
2. Move current screen data into backend API contracts.
3. Implement app auth and role checks.
4. Implement website sync importers.
5. Implement push notification registration.
6. Implement Kids Korral push flow with confirmation and history.
7. Replace web-only calendar download with native calendar integration.
8. Replace social/map/email web opens with native linking APIs.
9. Build TestFlight and Android internal test releases.
