# Security And Legal Beta Review

## Current Beta Guardrails
- No ads or ad tracking are intentionally included.
- Kids Korral links are beta/local until real Supabase Auth is connected.
- Admin preview is local TestFlight-only and must not be treated as production authorization.
- Prayer requests, contact forms, feedback, and signups submit to Supabase `form_submissions` from the app.
- Existing website forms still submit wherever FaithConnector currently sends them until website form integration is configured.
- Sermon embeds use public YouTube/FaithConnector media sources.
- Calendar data uses public Teamup sources and device calendar permission.

## Must Be Completed Before Public Launch
- Replace local account preview with real Supabase Auth.
- Enforce admin and Kids Korral permissions on the backend for every privileged action.
- Store the least possible child data: family number, confirmation name, linked account, and audit metadata only.
- Require admin MFA for role changes, live notifications, and Kids Korral staff permissions.
- Add rate limits for auth, forms, password resets, and notification sends.
- Add moderation/office workflow for prayer requests and app feedback.
- Publish privacy policy, support URL, and data deletion/contact instructions.
- Confirm permission to poll/sync FaithConnector public pages or obtain official API/webhook access.
- Use a licensed source for CSB daily verse text.
- Confirm giving/tithing link goes only to the trusted provider.
- Triage the current Expo dependency audit finding before public launch. `npm audit --omit=dev` reports moderate `uuid` advisory exposure through Expo build tooling, and npm's forced fix would downgrade Expo, so this needs a careful package update rather than `--force`.

## Legal Notes
- Do not imply the app replaces emergency contact, medical instructions, or custody verification.
- Do not store sensitive child details unless church leadership formally approves the data policy.
- Do not hardcode copyrighted Bible translation content beyond licensed/API-approved use.
- Do not use third-party logos/assets unless they are official brand links, public embeds, or the church has permission.
