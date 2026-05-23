# Supabase Edge Functions

These are the production functions to create next once the Supabase project exists.

## `register-push-token`

Authenticated endpoint. Saves or updates the Expo push token for the logged-in user.

Security notes:

- Only accepts `POST`.
- Requires a valid Supabase user token.
- Validates Expo token shape and `ios`/`android` platform.
- Uses the service role so regular users do not need direct table access to `push_tokens`.

Payload:

```json
{
  "expoPushToken": "ExponentPushToken[...]",
  "platform": "ios",
  "deviceName": "Brandon's iPhone"
}
```

## `send-kids-korral-alert`

Authenticated staff-only endpoint. Requires `admin` or `kids_korral` role. Finds users linked to the supplied family number, sends Expo push notifications, writes `notification_audit`.

Security notes:

- Only accepts `POST`.
- Requires `admin` or `kids_korral`.
- Limits family number format and message length.
- Targets only profiles linked to the supplied family number.

Payload:

```json
{
  "familyNumber": "247",
  "message": "Please come to Kids Korral."
}
```

## `send-live-now`

Authenticated admin-only endpoint. Sends a live-now notification to users who opted into live alerts. Kids Korral staff and general users are forbidden.

Security notes:

- Only accepts `POST`.
- Requires `admin`.
- Limits title and message length before sending.

Payload:

```json
{
  "title": "Live Now",
  "message": "Sunday service is live."
}
```

## `submit-app-form`

Shared app/website endpoint for contact messages, app feedback, prayer requests, text-alert requests, connect-group forms, and event signups.

Security notes:

- Accepts anonymous or authenticated submissions.
- Validates allowed form kinds.
- Trims payload fields before saving.
- Stores submissions in `form_submissions`.
- Optionally emails the church office when `RESEND_API_KEY` and `FORM_NOTIFICATION_EMAIL` are configured.
- The website can be tied to the same inbox by posting its forms to this function URL.

Payload:

```json
{
  "kind": "contact",
  "source": "ios_app",
  "sourceUrl": "ppccc://contact",
  "payload": {
    "Name": "Guest",
    "Email": "guest@example.com",
    "Message": "I have a question."
  }
}
```

## `sync-teamup-events`

Scheduled endpoint. Reads Teamup, normalizes events, and upserts into `app_events`.

## `upsert-app-event`

Authenticated admin-only endpoint. Adds or edits one event in the app calendar. This is the app-side admin calendar editor path.

Security notes:

- Only accepts `POST`.
- Requires `admin`.
- Validates required fields and timestamps.

Payload:

```json
{
  "id": "manual-2026-05-24-service",
  "title": "Sunday Worship Service",
  "starts_at": "2026-05-24T10:30:00-05:00",
  "ends_at": "2026-05-24T12:00:00-05:00",
  "location": "2731 S FM 129, Santo, TX 76472",
  "category": "Church Wide"
}
```

## `delete-app-event`

Authenticated admin-only endpoint. Deletes one app calendar event by id.

Security notes:

- Only accepts `POST`.
- Requires `admin`.
- Bounds event id length.

Payload:

```json
{
  "id": "manual-2026-05-24-service"
}
```

## `upsert-media-item`

Authenticated admin-only endpoint. Adds or edits sermon/livestream/replay records. Sermons can be embedded in the app when `youtube_video_id` is present.

Security notes:

- Only accepts `POST`.
- Requires `admin`.
- Validates media type, title length, and YouTube video id shape.

Payload:

```json
{
  "kind": "sermon",
  "title": "Sunday Sermon",
  "speaker": "Pastor Name",
  "youtube_video_id": "abc123",
  "published_at": "2026-05-24T12:00:00-05:00"
}
```

## `sync-website-pages`

Scheduled endpoint or webhook receiver. Normalizes website content into `app_pages`.
