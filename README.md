# ARVYX — Intelligence in Harmony

ARVYX is an AI platform for yoga studios. **ARVI**, the built-in assistant, helps teachers answer student enquiries, plan classes, write follow-ups and keep their studio organised.

**Live site:** https://anandhu058.github.io/arvyx/

## Features

- **Dashboard** — time-aware greeting, daily summary, quick prompts for ARVI
- **Smart Inbox** — student messages sorted by category, with suggested replies
- **Students** — simple student CRM with filters and profiles
- **Classes** — schedule and capacity at a glance
- **Follow-ups** — grouped tasks with ready-to-send message drafts
- **ARVI Assistant** — chat in English, Malayalam or Hindi, with copy-for-WhatsApp, save as follow-up and voice input
- **Export Centre** — download students, inbox, classes and follow-ups as CSV, or everything as a ZIP
- **Light and dark mode** — dark mode switches on automatically in the evening

## How it works

- A single static page (`index.html`) hosted on GitHub Pages, no build step.
- ARVI calls Supabase Edge Functions in `backend/`: **Gemini** first, **OpenRouter** as fallback.
- Sample data is stored in the browser only (`localStorage`).

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app (HTML, CSS, JavaScript) |
| `hero_lotus-1.png` | ARVI lotus (light theme) |
| `neon_lotus.png` | ARVI lotus (dark theme and thinking state) |
| `side_logo.png` | ARVYX logo |
| `favicon.png` | Browser tab icon |
| `backend/jarvis-gemini.ts` | Supabase Edge Function for Gemini |
| `backend/jarvis-openrouter.ts` | Supabase Edge Function for OpenRouter |

## Security

- API keys for Gemini and OpenRouter live **only** in Supabase secrets. Never commit keys to this repo.
- The page uses only Supabase's public publishable key.
- Do not enter real student data until sign-in (Supabase Auth) and row-level security are set up.

## Brand

| Colour | Hex |
| --- | --- |
| Deep Lotus Green | `#16473A` |
| Soft Cream | `#F6EFDC` |
| Temple Gold | `#C9A24B` |
| Aqua Light | `#2DD4CF` |

Fonts: Inter (interface), Cormorant Garamond (wordmark and quotes).

## Roadmap

- Lead pipeline (ARVYX Leads) and message templates
- Memberships and renewals
- Sign-in and a Supabase database for real student data
- WhatsApp connection
