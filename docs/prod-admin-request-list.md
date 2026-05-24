# PPCCC Production Readiness Request List

This checklist is for church admins helping get the Palo Pinto County Cowboy Church app ready for a real public launch. It focuses on the accounts, links, permissions, and decisions we need from the church or its vendors.

The app can launch in stages. Some items are required for the first public app store release, while others only unlock nicer automation or admin features.

## Quick Launch Summary

### The Plain-English Request

Please help us connect the church app to the same trusted sources already used by the church website. We are not trying to take over the website, collect payment information, or expose private member data. We need approved access to public content feeds, calendar feeds, media feeds, and a secure backend so the app can stay accurate without church staff updating everything twice.

### What To Send To Each Vendor Or Admin

- FaithConnector: "Do you provide an API, RSS feed, page content feed, media/sermon feed, form webhook, or custom form action URL for our site content and form submissions?"
- Teamup: "Please confirm the public iCalendar feed for the church calendar and whether we may use an API key later for admin event editing."
- ChurchTrac: "Please confirm whether we should connect the app to ChurchTrac, and if yes, what API/export/webhook options are available for registrations, groups, forms, or members."
- YouTube/media team: "Please provide the official channel, playlist, live stream setup, and permission to embed videos in the app."
- Giving provider: "Please provide the final mobile-safe giving URL. The app will link out to this provider and will not store card, bank, or donation details."
- Supabase owner/developer: "Please confirm the production project URL, anon key, service role key, and first admin email so auth, roles, submissions, Kids Korral links, and notifications can be backed by the database."

### Needed before a public app store launch

- Apple Developer Program access or confirmation that the church wants help setting it up.
- Production Supabase details for the app backend.
- Final secure giving link.
- Final church contact links, service times, privacy/support URLs, and app store listing details.
- Confirmation that Teamup calendar data shown in the app is approved for public viewing.
- Confirmation that FaithConnector media listings shown in the app are approved for public viewing.

### Helpful, but not required for launch

- Private Teamup API key for richer calendar admin features.
- ChurchTrac access if the church wants people, groups, giving, or member workflows connected later.
- YouTube channel manager access or a final list of video/live embed IDs.
- Push notification policies and named staff who may send alerts.
- Deeper FaithConnector admin/API access for stronger website-to-app syncing.

### Can launch without vendor integration

The app can still launch with manually managed or public-feed content for:

- Home screen basics.
- Service times and church contact information.
- Public calendar/events.
- Public sermon/media listings.
- External giving button.
- Basic live stream link.
- Static ministry information.

## 1. FaithConnector Website Access

### What We Need

- FaithConnector admin login for the church website, or a FaithConnector support contact who can answer setup questions.
- Confirmation of which public pages should appear in the app.
- Permission to use existing website text, images, staff/ministry information, sermon/media listings, and public announcements.
- Any official API, RSS, calendar, or media feed links FaithConnector provides.

### Why We Need It

FaithConnector appears to be the current source for much of the church website content. The app should not require church staff to update the same information in two places unless that is the preferred workflow.

Important note: seeing FaithConnector files hosted on AWS does not give us permission or a stable way to write into the website. We need a FaithConnector-approved feed, API, webhook, export, or form integration so the app and website stay connected safely.

### Who Likely Provides It

- FaithConnector website admin.
- Church office/admin staff with website access.
- FaithConnector support if special feed/API details are needed.

### What It Unlocks in the App

- Website content can be reused in the app.
- Sermon/media listings can update from the existing FaithConnector RSS feed.
- Ministry pages, staff details, contact information, and announcements can stay consistent between website and app.
- Less manual copy/paste work for church admins.

### What Can Launch Without It

- The app can launch with manually entered home content, ministry information, and contact details.
- Public sermon/media listings can launch from the existing FaithConnector RSS feed if the church approves it.
- Deeper automated syncing can wait until after launch.

## 2. Teamup Calendar Access

### What We Need

- Confirmation that the public Teamup calendar currently connected to the app is the correct church calendar.
- Confirmation that all public events on that calendar are safe to show in the app.
- Read-only iCalendar feed URL for the public church calendar and any needed sub-calendars.
- Optional: private Teamup API key if the church wants app-side calendar editing or richer sync later.

### Why We Need It

The app needs a reliable source for upcoming church events. Teamup can provide that without requiring admins to enter events twice.

### Who Likely Provides It

- Teamup calendar admin.
- Church office/admin staff who manage the calendar.
- Teamup support if API access is needed.

### What It Unlocks in the App

- Events list.
- Event detail pages.
- Add-to-phone-calendar feature.
- Automatic calendar updates from Teamup.
- Optional future support for richer filtering by ministry, age group, or event type.

### What Can Launch Without It

- The app can launch using the current public Teamup feed if approved.
- If Teamup access is delayed, events can be entered manually or loaded from a static events file.
- Private Teamup API access is not required for a basic public events calendar.

## 3. ChurchTrac Access

### What We Need

- Confirmation whether ChurchTrac should connect to this app at all.
- If yes, identify which ChurchTrac features matter for the app: people, groups, giving records, attendance, registrations, forms, or member profiles.
- ChurchTrac admin contact.
- Documentation or API access details from ChurchTrac, if available.
- Clear decision on what member/private data should never appear in the app.

### Why We Need It

ChurchTrac may contain sensitive church records. We need clear boundaries before connecting anything so the app does not expose private information or duplicate work incorrectly.

### Who Likely Provides It

- ChurchTrac account admin.
- Pastor, church office, or finance/admin staff.
- ChurchTrac support for API or export options.

### What It Unlocks in the App

- Possible future member login workflows.
- Possible event registration or group signup workflows.
- Possible staff-only admin tools.
- Possible connection to church management data, if the church wants that.

### What Can Launch Without It

- The first public app can launch without ChurchTrac.
- Giving should still use a secure external giving provider link.
- Public events, sermons, announcements, contact info, and live stream features do not require ChurchTrac.

## 4. YouTube Channel And Live Stream Details

### What We Need

- Official PPCCC YouTube channel URL confirmation.
- Channel manager access, or a staff member who can provide video IDs and live stream links.
- Confirmation of how Sunday live stream is published: scheduled YouTube live, recurring live link, embedded player, or another provider.
- Permission to embed sermon videos in the app.
- A backup link users can tap if an embedded player fails.

### Why We Need It

The app can list sermons from FaithConnector, but embedded playback and live status work best when we know the exact YouTube video, playlist, channel, and live stream setup.

### Who Likely Provides It

- YouTube channel owner/manager.
- Media team.
- Church office/admin staff.

### What It Unlocks in the App

- Sermon video playback inside the app.
- Live Now button or live stream banner.
- Better fallback link to open YouTube directly.
- Cleaner sermon/media archive.
- More reliable Sunday morning live stream experience.

### What Can Launch Without It

- The app can launch with a simple YouTube channel button.
- Sermon/media rows can launch as links instead of embedded videos.
- Live Now can be handled manually until the channel/live setup is finalized.

## 5. Giving Provider Link

### What We Need

- Final approved giving URL.
- Name of the giving provider.
- Confirmation that the link is safe for mobile users.
- Confirmation whether the giving page supports recurring gifts.
- Any official wording the church wants near the giving button.

### Why We Need It

The app should not collect or store bank, credit card, or donation details. Giving should hand users off to a trusted provider that already handles payment security.

### Who Likely Provides It

- Church finance/admin staff.
- Giving provider admin.
- Possible providers include ChurchTrac Giving, Tithe.ly, Subsplash Giving, Stripe Checkout, PayPal Giving, or another approved provider.

### What It Unlocks in the App

- Secure Give button.
- External giving flow.
- No payment data stored in the app.
- Cleaner app store review because the app is not processing donations directly.

### What Can Launch Without It

- The app can launch without giving, but the Give screen/button should be hidden or marked unavailable until the final link is approved.
- The rest of the app does not depend on giving provider access.

## 6. Apple Developer And App Store Setup

### What We Need

- Apple Developer Program account for the church, or a decision about who will own the account.
- Access for the person submitting the app.
- App name, subtitle, description, keywords, support URL, privacy policy URL, and contact email.
- App icon approval.
- Screenshots or approval to create screenshots from the app.
- TestFlight tester list, if the church wants a private test round before public release.

### Why We Need It

Apple requires a developer account and app listing details before the app can be tested through TestFlight or released in the App Store.

### Who Likely Provides It

- Church leadership or authorized admin.
- Apple account owner.
- App submitter/developer.

### What It Unlocks in the App

- TestFlight beta testing.
- Public iPhone App Store release.
- Push notification setup for iOS.
- Official app ownership under the church rather than a personal account.

### What Can Launch Without It

- The web prototype and local app testing can continue.
- Android or internal testing can continue separately if needed.
- A public iPhone launch cannot happen without Apple Developer Program access.

## 7. Supabase Production Backend

### What We Need

- Production Supabase project URL.
- Public anon/publishable key for the app.
- Service role key for backend-only jobs, stored securely and never placed in the app.
- Confirmation of the first admin email address.
- Confirmation that database schema and admin setup scripts may be run.
- Decision on who owns the Supabase account long term.

### Why We Need It

Supabase stores app data such as roles, events, media records, app content, push tokens, and admin permissions. Production should be separate from experiments or local test data.

### Who Likely Provides It

- Supabase account owner.
- App developer/admin.
- Church technical contact, if one exists.

### What It Unlocks in the App

- Real admin login and role management.
- Production event/media/content data.
- Kids Korral and Live Now notification backend.
- Secure server-side jobs for imports and updates.
- Stable data for TestFlight and public launch.

### Production Safety Items Required Before Public Release

- Real account login must use Supabase Auth, not a shared beta passcode.
- Admin, Kids Korral staff, and general user permissions must be enforced on the server, not just hidden in the app UI.
- Push token registration must be tied to a logged-in user account.
- Kids Korral family-number linking must be approved and stored in Supabase with row-level security.
- Staff notification actions need audit logs, rate limits, and clear permission rules.
- Prayer requests, contact forms, and signups need a final destination, abuse protection, and a staff workflow.
- The giving button must only use the final approved giving provider and must never collect payment details inside the app.

### What Can Launch Without It

- A static prototype can launch for review without Supabase.
- Public read-only content can be shown from generated JSON files.
- Admin editing, production notifications, and account-based features should wait until Supabase is ready.

## 8. Push Notification Decisions

### What We Need

- List of staff allowed to send notifications.
- Which notification types are approved: Live Now, Kids Korral, urgent alerts, selected event reminders, or announcements.
- Preferred wording style.
- Quiet hours or limits, if any.
- Confirmation that notifications should not be sent for every website or calendar change.

### Why We Need It

Push notifications are powerful and easy to overuse. The church should decide who can send them and what situations are important enough to interrupt someone.

### Who Likely Provides It

- Pastor/church leadership.
- Kids Korral leaders.
- Church office/admin staff.
- App admin.

### What It Unlocks in the App

- Live Now alerts.
- Kids Korral pickup or status alerts.
- Urgent church announcements.
- Event reminders for selected events.

### What Can Launch Without It

- The app can launch without push notifications.
- Users can still view events, sermons, giving, and church information.
- Push can be added after staff permissions and wording rules are approved.

## 9. Public Church Information Review

### What We Need

- Final service times.
- Church address.
- Main phone number.
- Main email address.
- Website URL.
- Social media links.
- Ministry names and descriptions.
- Staff/leader names and photos approved for public display.
- Privacy policy URL.
- Support/contact URL or email for app users.

### Why We Need It

The app store and app screens need accurate public information. This is also the easiest area for users to notice mistakes.

### Who Likely Provides It

- Church office/admin staff.
- Pastor/church leadership.
- Website admin.

### What It Unlocks in the App

- Accurate Home screen.
- Contact buttons.
- Maps/directions button.
- Ministry pages.
- App Store listing support and privacy fields.

### What Can Launch Without It

- The app can be tested with draft information.
- Public launch should wait for final review of church contact details, service times, privacy, and support information.

## 10. Launch Without Each Item

| Item | Can Launch Without It? | What Changes If Missing |
| --- | --- | --- |
| FaithConnector admin access | Yes | Use public RSS/manual content first; deeper syncing waits. |
| Teamup public feed approval | Not recommended | Events may need to be hidden or manually entered. |
| Teamup private API key | Yes | Public read-only events can still work. |
| ChurchTrac access | Yes | Member/private workflows wait. |
| YouTube manager access | Yes | Use channel/live links instead of reliable embedded playback/live status. |
| Giving provider link | Yes | Hide or disable giving until approved. |
| Apple Developer access | No for public iPhone launch | Can still test locally, but cannot release on the App Store. |
| Supabase production setup | Yes for static review, no for full production admin features | Admin editing, roles, notifications, and stable backend data wait. |
| Push notification policy | Yes | Launch without push alerts. |
| Final public church info | Not recommended | Public listing and app content may be inaccurate. |

## Suggested Admin Request Order

1. Confirm public church information, service times, contact links, and privacy/support links.
2. Confirm Apple Developer ownership and app store access.
3. Confirm Supabase production ownership and first admin email.
4. Approve Teamup public calendar feed for app display.
5. Approve FaithConnector public media/content reuse.
6. Provide final giving provider URL.
7. Confirm YouTube channel/live stream setup.
8. Decide push notification staff, rules, and launch timing.
9. Decide whether ChurchTrac integration is needed for a later phase.
