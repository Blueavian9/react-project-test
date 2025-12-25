# Memory Bank – HolisticBook Project

## Last Completed Milestone
- Date: [today's date, e.g. Dec 24, 2025]
- Status: Finished PR 1.1 (D1 + Drizzle setup) → pushed to main
- Branch: main
- Commit hash: [paste the latest git commit hash here]

## Current Focus
- Next: PR 1.2 – Modular Hono setup + SSR foundation
- Open questions / blockers: [e.g. "Need to decide on shadcn/ui init command"]

## Key Decisions Made
- Using Drizzle ORM v0.45.1 (or latest stable)
- Field-level AES encryption via crypto-js for PHI (client_info, intake_responses)
- No Husky / pre-commit hooks (manual lint only)
- Database name: holisticbook
- Encryption key handling: temporary in wrangler.toml → secrets in prod

## Folder Structure Snapshot (update when it changes significantly)


## Deployment Reminders
- Local: npx wrangler dev
- Deploy: git push → Cloudflare auto-deploys (if Pages/Workers linked)

## Next PR Titles (suggestions)
- feat: modular Hono + SSR setup (PR 1.2)
- chore: add HIPAA encryption utils + audit log middleware (PR 1.3)
