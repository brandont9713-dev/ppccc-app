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

## App Store Metadata Checklist

Use this section as the working list for App Store Connect and Google Play Console. Keep the public listing plain and church-focused; do not mention backend setup, webhooks, internal tools, or development status.

### Identity

- App name: `Palo Pinto County Cowboy Church`
- Short display name: `PPCCC`
- Subtitle: `Worship, events, and church updates`
- Category: `Lifestyle`
- Secondary category: `Reference` or `Social Networking`
- Age rating target: `4+`, assuming no unrestricted web browsing, objectionable content, user-to-user public chat, or in-app purchases are added.

### Public Description Draft

`Stay connected with Palo Pinto County Cowboy Church. Watch services and sermons, view upcoming events, add church events to your calendar, explore ministries, send prayer requests, contact the church office, and receive timely church notifications including Live Now and Kids Korral alerts.`

### Keywords

`church,worship,sermons,events,prayer,cowboy church,Palo Pinto,Santo,Texas,Kids Korral,ministries`

### URLs

- Privacy policy URL: `TBD`
- Support URL: `TBD`
- Marketing URL: `https://www.palopintocowboychurch.com/`
- Copyright: `Palo Pinto County Cowboy Church`

### Contact Information

- Public support email: `TBD`
- App review contact name: `TBD`
- App review phone: `TBD`
- App review email: `TBD`

### TestFlight Notes

- Beta description: `Help us test the PPCCC app before public launch. Please check events, add-to-calendar, sermons, ministry pages, prayer/contact forms, account creation, notifications, and iPhone/iPad layout.`
- Feedback email: `TBD`
- Review notes: `This beta is for church communication, events, sermons, prayer/contact forms, and notification testing. Giving opens only through a trusted external provider and the app does not collect payment details.`
- Review login: provide an admin-safe test account only if Apple needs access to protected screens.
- Test account email: `TBD`
- Test account password: `TBD`

### Screenshots Needed

- iPhone 6.7 inch: Home, Events, Sermons/Live, More/Ministries, Settings
- iPhone 5.5 inch or current required fallback: Home and Events
- iPad: Home, More/Ministries, Events
- Android phone: Home, Events, More/Ministries, Settings
- Avoid screenshots that show private Kids Korral numbers, personal email addresses, private prayer requests, admin-only tools, or unfinished placeholders.

### Privacy And Data Safety

- Data collected: account name, email, optional phone, push notification token, form submissions, prayer/contact requests, event RSVP/sign-up details, optional Kids Korral family number, app feedback.
- Sensitive child data: do not collect birthdates, school, address, medical notes, custody details, photos, or private child profile details for v1.
- Tracking: no third-party advertising tracking.
- Ads: none.
- Purchases: none in-app.
- Location: no background location tracking.
- Calendar access: only when a user chooses to add a church event to their device calendar.
- Notifications: only after user permission; used for church updates, Live Now, event reminders, and Kids Korral alerts.
- Payment data: not collected by the app; giving should open a trusted external giving provider.

### Final Store Review Items

- Confirm the privacy policy covers accounts, push tokens, form submissions, Kids Korral numbers, notifications, and deletion/contact instructions.
- Confirm support URL and support email are monitored.
- Confirm all screenshots show production-ready content.
- Confirm the app icon and splash screen are church-approved.
- Confirm external links are limited to trusted church/social/maps/email/giving destinations.
- Confirm admin/staff-only actions require signed-in role checks on the backend before public launch.

## Before Each TestFlight Build

- Rebuild `native-app/src/webAppHtml.ts` after any web UI change.
- Run the app syntax/type checks.
- Confirm `public/app.js` and `public/styles.css` changes are intentional before committing.
- Commit and push to GitHub before the EAS build, so the release has a clear source snapshot.
- Incrementing the iOS build number is handled by EAS production `autoIncrement`.

## Important Release Risks

- The app currently bundles the web UI into the native build. A TestFlight user will not see local UI changes until a new native build is created and submitted, unless a later Expo Updates setup is added and approved.
- Supabase function deployment now keeps JWT verification on for privileged functions. Public read/submit functions are the only ones deployed without JWT verification, and privileged functions still need smoke tests with `general`, `kids_korral`, and `admin` accounts before external testers use staff features.
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
