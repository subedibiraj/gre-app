<div align="center">

# GRE Complete

**AI-powered GRE prep for Verbal 165+ and Quant 165+**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=flat-square&logo=google)](https://aistudio.google.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=flat-square&logo=vercel)](https://vercel.com)

</div>

---

## What This Is

A full-featured GRE study app with:
- **30-day verbal curriculum** — 445+ words with definitions, examples, GRE tips, TC patterns, and SE twin-pair strategy
- **AI-generated adaptive practice** — TC, SE, RC, and Quant questions calibrated to your weak spots
- **Spaced repetition engine** — SM-2 algorithm tracks every word across sessions
- **Full mock exams** — Verbal (20Q / 30min) and Quant (20Q / 35min) with accurate ETS-curve scoring
- **Formula quick-test** — Active recall for all GRE Quant formulas
- **Google OAuth + cloud sync** — Progress syncs across all devices via Supabase
- **Streak, XP, achievements** — Gamification to maintain daily consistency

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8 |
| Styling | CSS-in-JS with centralized theme tokens |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase (Postgres) — progress sync |
| AI | Google Gemini 2.5 Flash |
| API | Vercel Serverless Functions (`/api/`) |
| Deploy | Vercel (GitHub connected) |

---

## Quick Start (Local)

### 1. Clone and install

```bash
git clone https://github.com/your-username/gre-app.git
cd gre-app
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=AIza...   # optional — users can add their own key in Settings
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run this SQL in the Supabase SQL Editor:

```sql
-- Progress sync table
create table if not exists public.user_progress (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  data     jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- Only the owning user can read/write their progress
alter table public.user_progress enable row level security;

create policy "Users can manage their own progress"
  on public.user_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

3. Enable Google OAuth in Supabase → Authentication → Providers → Google
   - Add your Google OAuth credentials (Client ID + Secret from [Google Cloud Console](https://console.cloud.google.com))
   - Add your Vercel domain to "Redirect URLs": `https://your-app.vercel.app`

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

> **Gemini key:** Go to Settings (⚙️) and paste your API key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey). It's free and takes 30 seconds.

---

## Deploy to Vercel

### Option A — GitHub (recommended)

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → select your repo
3. Add environment variables in Vercel → Project Settings → Environment Variables:

```
VITE_SUPABASE_URL        → https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY   → your-anon-key
SUPABASE_SERVICE_KEY     → your-service-role-key (for Stripe webhooks)
GEMINI_API_KEY           → AIza...  (optional fallback)
STRIPE_SECRET_KEY        → sk_test_...
STRIPE_WEBHOOK_SECRET    → whsec_...
STRIPE_PRICE_MONTHLY     → price_...
STRIPE_PRICE_ANNUAL      → price_...
```

4. Deploy. That's it — Vercel auto-detects Vite and the `/api/` serverless functions.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

---

## Stripe Integration Setup

1. Add the subscription columns to your Supabase `user_progress` table:
```sql
ALTER TABLE user_progress ADD COLUMN plan text DEFAULT 'free';
ALTER TABLE user_progress ADD COLUMN stripe_customer_id text;
ALTER TABLE user_progress ADD COLUMN plan_expires timestamptz;
```

2. Create two products in Stripe (e.g., "GRE Complete Pro") with Monthly and Annual prices.
3. Add the Price IDs to `STRIPE_PRICE_MONTHLY` and `STRIPE_PRICE_ANNUAL` in Vercel.
4. Add your Stripe Secret Key (`sk_...`) to Vercel.
5. In Stripe Dashboard, go to Developers → Webhooks and add an endpoint pointing to `https://your-app.vercel.app/api/stripe-webhook`.
   - Events to listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
6. Reveal the webhook secret (`whsec_...`) and add it to `STRIPE_WEBHOOK_SECRET` in Vercel.
7. Add your `SUPABASE_SERVICE_KEY` to Vercel (found in Supabase → Project Settings → API). This is required for the webhook to update user plans.

---

## Project Structure

```
├── api/                          # Vercel serverless functions
│   ├── _prompts.js               # Shared GRE prompt fragments
│   ├── generate.js               # POST /api/generate      — Verbal practice
│   ├── mock-exam.js              # POST /api/mock-exam     — Verbal mock
│   ├── quant-generate.js         # POST /api/quant-generate — Quant practice
│   ├── quant-mock.js             # POST /api/quant-mock    — Quant mock
│   └── chat.js                   # POST /api/chat          — AI tutor
│
├── src/
│   ├── lib/
│   │   ├── supabase.js           # Supabase client + progress sync
│   │   ├── auth.jsx              # Auth context, Google OAuth, AuthButton
│   │   └── gemini.js            # Gemini key management + apiFetch helper
│   │
│   ├── data/
│   │   ├── days.js               # 30-day vocabulary curriculum (445+ words)
│   │   ├── formulas.js           # GRE Quant formula reference
│   │   ├── quant-concepts.js     # Worked examples + strategies
│   │   ├── quant-topics.js       # Topic metadata + traps + QC tips
│   │   └── roots.js              # Greek/Latin roots database
│   │
│   ├── engine/
│   │   ├── spaced.js             # SM-2 spaced repetition engine
│   │   ├── streak.js             # Daily streak tracker
│   │   ├── xp.js                 # XP, levels, achievements
│   │   └── history.js            # Score history for trend analysis
│   │
│   ├── components/               # Reusable UI components
│   │   ├── SettingsPanel.jsx     # Settings: Gemini key, auth, test date
│   │   ├── WarmupModal.jsx       # Daily warm-up: agenda + flashcards
│   │   ├── AiTutor.jsx           # Gemini chat tutor
│   │   └── ...
│   │
│   ├── phases/                   # Feature screens
│   │   ├── VocabView.jsx         # Words + TC Patterns + SE Strategy panels
│   │   ├── PracticeView.jsx      # VIC + TC + SE + RC practice
│   │   ├── MockExam.jsx          # Full verbal mock exam
│   │   ├── ProgressDashboard.jsx # Score tracking + estimates
│   │   ├── DailyRoadmap.jsx      # Study plan for today
│   │   └── quant/
│   │       ├── FormulaSheet.jsx  # Formula reference + Quick Test mode
│   │       ├── ConceptLearn.jsx  # Concept cards with worked examples
│   │       ├── QuantPractice.jsx # QC + MC + NE practice
│   │       └── QuantMock.jsx     # Full quant mock exam
│   │
│   ├── App.jsx                   # Root: layout, routing, sidebar
│   ├── theme.js                  # Design tokens (colors)
│   └── utils.js                  # Cluster colors, helpers
│
├── .env.example                  # Template for environment variables
├── vercel.json                   # Vercel deployment config
└── vite.config.js                # Vite config with /api proxy for dev
```

---

## Adding Vocabulary Days

Edit `src/data/days.js`. Each day object:

```js
{
  day: 31,
  theme: 'Your Theme',
  date: 'Jun 3, 2026',
  patterns: [
    'TC pattern 1',
    'TC pattern 2',
  ],
  seStrategy: [
    'SE twins for X: WORD ↔ WORD — explanation',
    'TRAP: word ↔ word are NOT SE twins because...',
  ],
  words: [
    {
      w: 'WORD',
      pos: 'adj',
      cluster: 'ClusterName',
      def: 'Full definition.',
      ex: 'Example sentence using the word.',
      tip: 'GRE-specific tip — what the exam tests about this word.',
    },
  ],
}
```

No other files need to change. The sidebar, practice engine, and SR system auto-wire.

---

## Gemini API Key

The app works in two modes:

| Mode | How |
|------|-----|
| **User key** | User pastes their own key in ⚙️ Settings. Stored in localStorage. Sent as `x-gemini-key` header. |
| **Server key** | Set `GEMINI_API_KEY` in Vercel env vars. Used as fallback when no user key is provided. |

Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). The free tier supports ~60 requests/minute, which is more than enough for study sessions.

---

## Score Estimation

The Progress Dashboard estimates GRE scores using a non-linear 18-bucket scale that matches ETS's actual scoring curve — not a simple linear formula. A 90% accuracy rate maps to approximately 165, matching real GRE percentile distributions.

---

## License

MIT — use it, fork it, improve it.
