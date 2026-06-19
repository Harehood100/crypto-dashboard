# CryptoDash 📈

A real-time cryptocurrency metrics dashboard built with Next.js, Zustand, and Recharts.

🔗 **Live Demo:** https://crypto-dashboard-ebon-iota.vercel.app

## Features

- **Live crypto prices** — Top 20 coins by market cap, auto-refreshes every 60 seconds
- **Interactive charts** — 7-day price history with area chart per coin
- **Animated stats** — Market cap, 24h volume, BTC dominance, gainers counter
- **Search & sort** — Filter coins by name/symbol, sort by rank, price, or 24h change
- **Dark / light mode** — Persisted via global state
- **Responsive design** — Works on mobile, tablet, and desktop

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework, SSR, API routes |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Zustand | Global state management |
| Recharts | Interactive price charts |
| CoinGecko API | Live cryptocurrency data |
| Vercel | Deployment & CI/CD |

## Architecture
## Key Technical Decisions

- **API route as middleware** — The browser never calls CoinGecko directly. All requests go through `/api/crypto` which handles caching and error handling server-side
- **Derived state** — Filtering and sorting are computed from raw data in the store, not stored separately, keeping one source of truth
- **Custom hooks** — `useCountUp` animates stat numbers on load using `setInterval` with cleanup to prevent memory leaks
- **Staggered animations** — Cards animate in sequentially using CSS `animationDelay` tied to array index

## Getting Started

```bash
git clone https://github.com/Harehood100/crypto-dashboard.git
cd crypto-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)