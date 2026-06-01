# KrishiMitra — Frontend

React 18 + Vite + Tailwind 3 SPA for [KrishiMitra](https://krishimitrakdp.netlify.app/), a weather-driven farming advisor for Indian farmers. Mobile-first, multilingual, voice-enabled.

> The Python backend lives in a separate repo: [`krishimitra`](https://github.com/KMaruthi2002/krishimitra).

## Run

```bash
npm install
npm run dev          # http://localhost:5173 — proxies /api to localhost:8000
npm run build        # production bundle in dist/
npm run preview      # serve the built bundle
```

## Structure

```
.
├── README.md
├── .gitignore
├── index.html
├── netlify.toml                Build + /api proxy to Render backend
├── package.json · package-lock.json
├── postcss.config.js · tailwind.config.js · vite.config.js
└── src/
    ├── App.jsx                 Main shell + tab routing
    ├── main.jsx
    ├── index.css               Design tokens (CSS variables) + component classes
    ├── components/
    │   ├── Header.jsx          Sticky header with language + voice toggles
    │   ├── BottomNav.jsx       Tab bar with SVG icons
    │   ├── HomeView.jsx        Dashboard tiles
    │   ├── ChatView.jsx        Voice / text chat with suggestion chips
    │   ├── WeatherWidget.jsx
    │   ├── CropCard.jsx
    │   ├── PestCard.jsx
    │   ├── FertCard.jsx
    │   ├── IrrigCard.jsx
    │   └── UI.jsx              Button, Select, Card, Chip, MetricTile, ProgressBar
    ├── hooks/
    │   └── useVoice.js         Web Speech API (synth + recognition)
    └── lib/
        ├── api.js              fetch helpers
        └── constants.js        CROPS, SOILS, LOCATIONS, STAGES, LANGUAGES, TABS
```

## Design tokens

All colours, surfaces, radii, shadows, and motion live as CSS variables in
`src/index.css` under `:root`. To re-theme, change the variables — components
read them via `var(--name)` or Tailwind arbitrary values.

## Languages

Voice in and out via the Web Speech API: English · हिन्दी · తెలుగు · ಕನ್ನಡ · தமிழ் · मराठी.

## Deploy (Netlify)

Connect this repo as a Netlify site. `netlify.toml` already sets:

- `build.command = "npm run build"`
- `build.publish = "dist"`
- Rewrite `/api/*` → `https://krishimitra-s4v4.onrender.com/api/:splat`
- SPA fallback to `index.html`

So pushing to `main` deploys automatically.
