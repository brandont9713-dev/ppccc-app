# GitHub And Release Setup

## Current GitHub Connector State

Codex can see the GitHub login `brandont9713-dev`, but the GitHub app currently has no installed repositories available in this workspace. That means Codex cannot push until a repository exists and the GitHub app is installed for that repository/account.

## Fastest GitHub Path

1. Create a new GitHub repository, for example `ppccc-app`.
2. Install/authorize the Codex GitHub app on that repository.
3. Come back to Codex and say: `Push this workspace to brandont9713-dev/ppccc-app`.

## What To Commit

Commit the full workspace except ignored files:

- `public/` web prototype
- `native-app/` Expo app
- `docs/`
- `server.mjs`
- `tools/import-teamup-events.mjs`
- `tools/import-teamup-ics.mjs`

Do not commit:

- `native-app/node_modules/`
- `tools/node-v24.16.0-win-x64/`
- `.env`
- Apple certificates/keys
- Supabase service role keys

The `.gitignore` is already set for that.
