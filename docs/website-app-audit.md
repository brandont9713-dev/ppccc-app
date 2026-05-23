# Website to App Audit

This audit maps the public Palo Pinto County Cowboy Church website into native app areas. The goal is not to open the website inside the app, but to represent the same church content in app-native screens.

## Current Prototype Coverage

### Primary App Tabs

- Home
- Events
- Live
- Kids Korral
- More
- Account

### Website Sections Covered In-App

- Visitors
- Service Times
- Get Directions
- About Us
- Mission Statement
- Staff / Meet the Staff
- Elders and Lay Pastors
- Team Leaders
- Teams
- Arena Team
- Building and Grounds
- Card Ministry
- Celebrate Recovery
- Chuckwagon Team
- Concessions
- Door Greeters
- General Store
- Harvest Team
- Iron Horse Ministry
- Kids Korral
- Media Team
- Men's Ministry
- MW State Park Ministry
- New Believer's Class
- Prayer Team
- Sound Team
- Worship Team
- Women's Ministry
- Young Adults Group
- Youth Ministry
- Sermons and Bible Study
- Sermons
- Bible Study
- Text Alerts
- Calendar
- Prayer Requests
- Testimonies
- Connect Groups
- Contact
- Laughter & Lemonade RSVP
- Dutch Oven Class RSVP

## Current Gaps

- Some native pages use summarized content until a sync layer can pull the full website body content.
- Sermons, Bible Study, RSVP forms, Prayer Requests, and Calendar need production integrations rather than static summaries.
- Livestream needs an embedded video/player integration or live status feed.
- Giving is intentionally deferred until the secure giving provider is chosen.

## CMS / Database Reality

We can design and build the app content database now, but we cannot make the existing website and app share content automatically unless one of these becomes available:

- FaithConnector admin/API/feed access.
- A calendar/feed endpoint for events.
- Permission to add an app-facing API or webhook to the website.
- A backend importer that is allowed to read and normalize public website content.

The current prototype uses live image URLs from the website, but that is not the same as full automatic sync.

## Recommended Production Sync

1. Create an app backend with structured tables for pages, events, staff, ministries, forms, media, livestream status, and push notifications.
2. Import existing website content into that backend.
3. Sync website changes using the best available source:
   - API/feed if FaithConnector provides one.
   - Teamup/iCal feed for calendar events.
   - Scheduled public website importer for pages/images if no API exists.
4. Cache content on-device so the app opens even if the website is slow.
5. Let approved admins override app-specific content from the app/admin dashboard.

