# External Beta Release Readiness

This file is the short, practical checklist for getting PPCCC from the current TestFlight/internal beta state into controlled external testing.

## Current Local Setup

- iOS bundle id: `com.ppccc.app`
- App Store Connect app id: `6772600260`
- Expo project id: `f1abd24a-4471-4766-aa0f-8f3188411106`
- iPad support: enabled with `supportsTablet: true`
- Calendar permission text: present for iOS and Android
- Notifications package: present through `expo-notifications`
- Biometric package: present through `expo-local-authentication`
- Supabase project currently referenced by the app: `https://lwrnoexybfqykfvxgjjs.supabase.co`
- Native app shell: React Native + Expo WebView with bundled app HTML

## External TestFlight Steps

1. Build and submit the newest iOS build.
   - From `native-app`, run `.\scripts\build-ios-testflight.ps1`.
   - After EAS finishes successfully, run `.\scripts\submit-ios-testflight.ps1`.

2. Wait for Apple to process the build.
   - In App Store Connect, open the PPCCC app.
   - Go to `TestFlight`.
   - Confirm the newest build appears and is done processing.

3. Fill in beta testing information.
   - Add beta app description.
   - Add feedback email.
   - Add contact information.
   - Add any review notes Apple needs, especially test login details if account-only screens matter.

4. Create or open the external testing group.
   - Go to `TestFlight` -> `External Testing`.
   - Create a group such as `PPCCC Beta Testing`, or use the existing one.
   - Add the newest build to that group.

5. Submit the build for TestFlight App Review.
   - The first external build for a version needs Apple beta review.
   - Later builds for the same version may be faster, but still can require review.

6. After approval, invite testers.
   - For controlled testing, invite specific email addresses instead of using an open public link.
   - If a public link is used, set a tester limit and disable it after the right people join.
   - If testers do not receive email, use the public link with a strict low tester limit as the fallback.

7. Tell testers what to check.
   - Login/account creation.
   - Events list and add-to-calendar.
   - Sermons/videos.
   - More/ministry pages.
   - Settings, prayer/contact forms, feedback.
   - Notifications permission.
   - iPhone and iPad layout.

## Before Each TestFlight Build

- Rebuild `native-app/src/webAppHtml.ts` after any web UI change.
- Run the app syntax/type checks.
- Confirm `public/app.js` and `public/styles.css` changes are intentional before committing.
- Commit and push to GitHub before the EAS build, so the release has a clear source snapshot.
- Incrementing the iOS build number is handled by EAS production `autoIncrement`.

## Important Release Risks

- The app currently bundles the web UI into the native build. A TestFlight user will not see local UI changes until a new native build is created and submitted, unless a later Expo Updates setup is added and approved.
- Supabase function deployment uses `--no-verify-jwt`, so every privileged function must keep doing its own auth and role checks. The current notification functions do check user roles, but this should be smoke-tested with `general`, `kids_korral`, and `admin` accounts before external testers use staff features.
- Public form submission is intentionally allowed, but should have rate limiting, spam protection, and a clear office workflow before public launch.
- The app still needs final App Store privacy policy/support URLs in App Store Connect before public release.
- The giving flow should stay as an external trusted provider link and should not collect payment details in the app.
- Do not commit `.env`, `.supabase-token`, Apple certificates, provisioning profiles, or service role keys.

## External Beta Recommendation

Use a private email invite group for the first church beta round. Avoid an open public link until the pastor/staff review is done. If Apple email delivery is flaky, create a public link with a small tester limit, share it only with the named testers, then disable the link after they install.

## What To Ask The Church Admins For

- Final beta tester email list.
- Support email for tester feedback.
- Privacy policy URL.
- Confirmation that public Teamup events and public ministry photos may be used in the app.
- Confirmation that sermon/video embeds may be shown inside the app.
- Names of who should be allowed to send Live Now and Kids Korral notifications.
