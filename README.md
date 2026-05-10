# GRE Verbal Prep — AI-Powered Adaptive Learning

A full-stack GRE Verbal preparation app with AI-driven adaptive question generation, built with React, Vite, Express, and Google Gemini.

![GRE Verbal Prep](https://img.shields.io/badge/GRE-Verbal%20Prep-gold?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![Gemini](https://img.shields.io/badge/Google-Gemini%202.5-4285F4?style=flat-square&logo=google)

## Features

### 📖 Vocabulary System
- **7-day progressive curriculum** with themed word clusters
- **95+ GRE words** with definitions, examples, and test-specific tips
- **Cross-day browsing** — review all previous days from any day
- **Cluster filtering** — group words by semantic category

### ⚔️ Adaptive Practice Engine
- **Contrast Recall** — Match word pairs from all days (client-side, instant)
- **Day Recall** — Type the word from its definition (AI-generated)
- **Text Completion** — GRE-format TC with blanks and pivot words (AI-generated)
- **Sentence Equivalence** — Pick 2 synonymous answers from 6 options (AI-generated)

### 🤖 AI Integration (Google Gemini)
- Adaptive question generation calibrated to weak words and past scores
- Production-quality prompts with strict JSON output constraints
- AI Tutor chat for on-demand word explanations and strategy tips

### 📊 Progress Tracking
- Per-day, per-section score tracking
- Weak word identification and prioritization
- Persistent state via localStorage

## Architecture

```
├── server/index.js              # Express API (Gemini proxy)
├── src/
│   ├── App.jsx                  # Shell: sidebar + tabs + routing
│   ├── data/days.js             # Vocabulary data (add new days here)
│   ├── components/              # Reusable UI components
│   │   ├── AiTutor.jsx          # Gemini chat interface
│   │   ├── StemRenderer.jsx     # Parses [B1]/[B2] blank markers
│   │   └── ...
│   └── phases/                  # Practice components
│       ├── ContrastRecall.jsx   # Client-side cumulative recall
│       ├── DrillSection.jsx     # AI day recall
│       ├── TCSection.jsx        # AI text completion
│       ├── SESection.jsx        # AI sentence equivalence
│       └── ...
```

## Quick Start

```bash
# Install dependencies
npm install

# Set your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env

# Terminal 1 — Backend
npm run server

# Terminal 2 — Frontend
npm run dev
```

Get a free API key at [Google AI Studio](https://aistudio.google.com/apikey).

## Adding New Days

Edit `src/data/days.js` and add a new day object:

```js
{
  day: 8,
  date: 'May 11, 2026',
  theme: 'Your Theme',
  patterns: ['Pattern 1', 'Pattern 2'],
  words: [
    { w: 'WORD', pos: 'adj', cluster: 'Cluster',
      def: 'Definition.',
      ex: 'Example sentence.',
      tip: 'GRE-specific tip.' },
  ],
}
```

No other files need to change — the sidebar, practice, and progress tracking auto-wire.

## Tech Stack

- **Frontend:** React 19, Vite 8
- **Backend:** Express.js
- **AI:** Google Gemini 2.5 Flash (`@google/genai`)
- **Styling:** CSS-in-JS with centralized theme tokens
- **State:** React hooks + localStorage persistence

## License

MIT
