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

Planned features, grouped by priority. Checked items are done.

### Next up
- [ ] **Lead Pipeline (ARVYX Leads)** — track enquiries from New to Contacted, Trial booked, Joined or Lost
- [ ] **Message Templates** — saved WhatsApp replies for fees, timings, trials and renewals, with ARVI personalisation and English / Malayalam / Hindi versions
- [ ] **Sign-in and database** — Supabase Auth, row-level security and a real student database

### Studio management
- [ ] **Memberships and renewals** — plan type, expiry and payment status, with a "renewals due this week" list
- [ ] **Attendance check-in** — tap-to-mark class attendance that feeds the inactive-students list
- [ ] **Class booking and waitlist** — let students reserve spots and join a waitlist when a class is full
- [ ] **Multiple teachers and roles** — separate logins for owner, teacher and front desk
- [ ] **Student notes and goals** — injuries, preferences and progress per student

### ARVI intelligence
- [ ] **Studio Insights** — weekly summary: new students, class fill rate, inactive students, best-performing class, with one recommendation from ARVI
- [ ] **Daily brief** — morning card on Home with replies waiting, renewals due and class availability
- [ ] **Class sequence library** — save sequences and themes; ARVI suggests flows by level and duration
- [ ] **Content planner** — monthly Instagram captions and workshop posts, tied to dates such as Onam, Vishu and International Yoga Day
- [ ] **Voice replies in Malayalam** — speak a question and hear the answer

### Messaging and growth
- [ ] **WhatsApp connection** — send and receive messages inside ARVYX
- [ ] **Automated reminders** — class reminders, renewal nudges and win-back messages for inactive students
- [ ] **Birthday and milestone messages** — for example, a student's 50th class
- [ ] **Lead capture form** — a public enquiry link or QR code that feeds the Smart Inbox
- [ ] **Reviews and referrals** — request reviews and track referral rewards

### Payments and reports
- [ ] **UPI / payment links** — collect fees and mark payments automatically
- [ ] **Revenue and retention reports** — monthly charts and PDF export
- [ ] **Scheduled exports** — weekly CSV to email

### Product polish
- [ ] **Command search** — jump to any student, class or page
- [ ] **Installable app (PWA)** — add ARVYX to the phone home screen, with offline support
- [ ] **Notifications** — in-app and push alerts for new messages and due follow-ups
- [ ] **Accessibility and language pass** — screen-reader labels and full Malayalam interface

### Done
- [x] Dashboard, Smart Inbox, Students, Classes, Follow-ups
- [x] ARVI chat with Gemini and OpenRouter fallback
- [x] Export Centre (CSV and ZIP)
- [x] Light and dark mode with automatic evening switch
