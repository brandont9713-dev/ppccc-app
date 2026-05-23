# Website/App Sync Integration Plan

Goal: keep the app and Palo Pinto County Cowboy Church website aligned, while keeping the mobile app native and app-only. Website content feeds app screens; app-only features stay in the app.

## Source Of Truth

Use one shared content source where possible:

- Website pages and images: church CMS/API, scraper cache, or export endpoint.
- Events: Teamup public calendar/API feed.
- Livestream/media: website embed, YouTube/live provider API, or media feed.
- Forms: app backend receives native submissions, then forwards to the church workflow.
- Kids Korral: app database only, because this feature does not exist on the website.
- Accounts/roles: app auth database only.
- Giving: separate trusted provider handoff for security.

## Access Needed

To make live sync real instead of mocked, collect these from the church admin accounts:

- Website CMS access, API access, or an approved read-only export/scraper path.
- Teamup public calendar key is currently mapped as `kse1p8ynvg2fvo2ez6`.
- Read-only iCalendar feed currently responds at `https://ics.teamup.com/feed/kse1p8ynvg2fvo2ez6/0.ics`.
- Teamup JSON event endpoint currently responds at `https://teamup.com/kse1p8ynvg2fvo2ez6/events?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`.
- A private Teamup API key is still needed only if richer write/edit/admin behavior is required.
- Livestream provider details, such as YouTube channel/live embed source.
- Giving provider URL only; giving should remain outside app account auth.
- Approved destination email/webhook addresses for prayer, contact, RSVP, bug report, and app suggestion forms.

## Real-Time Strategy

- Events can update automatically from Teamup. The current launch path uses a same-origin `/api/app/events` proxy to read the public Teamup events endpoint, plus `public/events.generated.json` as a static fallback. The stronger version uses Teamup API/webhooks where available.
- Website page content can update automatically from CMS webhooks if the CMS supports them. If it does not, the backend should poll the known website pages on a schedule, detect changed text/images, and publish the latest normalized app content.
- The app should fetch cached JSON from the backend on launch, on pull-to-refresh, and at a short background interval where the OS allows it.
- Push notifications should not be sent for every website change. Use push for live-now alerts, Kids Korral, urgent announcements, and selected event reminders.

## Sync Direction

- Website to app: home content, ministry pages, staff/leaders, service times, media, testimonies, calendar, images.
- App to website/CMS: optional admin-created announcements/events if the church wants the app to update the website too.
- App only: Kids Korral parent push alerts, user accounts, admin permissions, notification preferences.

## Connector Shape

Recommended backend endpoints:

```txt
GET  /api/app/bootstrap
GET  /api/app/pages
GET  /api/app/pages/:id
GET  /api/app/events
GET  /api/app/media
GET  /api/app/staff
POST /api/app/forms/prayer-request
POST /api/app/forms/text-alerts
POST /api/app/forms/connect-group
POST /api/app/forms/rsvp
POST /api/app/kids-korral/alerts
POST /api/webhooks/cms-updated
POST /api/webhooks/teamup-updated
POST /api/webhooks/live-status
```

## Current App Readiness

The app already has a source registry in `public/app.js`:

- `syncSources`: shows the integration surfaces and statuses.
- `pageSourceUrls`: maps native app pages to the related website URLs.
- Native templates: image tiles, people cards, media rows, testimony cards, forms, event agenda cards.
- Settings includes a Website Sync Readiness panel.

## Implementation Steps

1. Pick backend stack and database.
2. Store page registry records with `pageId`, `sourceUrl`, `updatedAt`, `title`, `body`, `images`, `people`, `forms`, and template type.
3. Build website importer:
   - Pull known page URLs.
   - Extract text, images, captions, people/contact overlays.
   - Save normalized records.
4. Build Teamup importer:
   - Use iCalendar URL or API.
   - Normalize category, date, time, description, location.
5. Add webhook endpoints:
   - CMS/page changed.
   - Teamup event changed.
   - Livestream status changed.
6. Replace static arrays in `public/app.js` with API calls:
   - `appPages`
   - `teamupEvents`
   - `staffMembers`
   - `homeHighlights`
   - `homeSlides`
7. Keep app-only tables separate:
   - users
   - roles
   - children/family Kids Korral numbers
   - push tokens
   - alert history
8. Add admin console actions:
   - refresh website sync
   - review changed content
   - approve app-only announcements
   - update user permissions

## Safety Notes

- Do not merge tithing/giving into church account auth unless a trusted giving provider requires it.
- Keep Kids Korral alerts role-gated and log every send.
- Require confirmation before sending parent push notifications.
- Keep social, maps, phone, email, and giving as explicit handoffs.
- Everything else should render inside the app.
