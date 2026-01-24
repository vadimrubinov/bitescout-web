# BiteScout Web

World's most complete trophy fishing database. Powered by AI.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Hosting:** Render

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

Auto-deploys on push to `main` branch via Render.

## Environment Variables

```
BOT_API_URL=https://rng-telegram-bot.onrender.com
```

## Structure

```
app/
├── layout.tsx      # Root layout
├── page.tsx        # Home page with chat
├── about/page.tsx  # About page
└── api/chat/       # Chat API endpoint
components/
├── Logo.tsx        # Replaceable logo
├── Header.tsx      # Site header
└── Footer.tsx      # Site footer
```
