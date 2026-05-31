# Love Help AI

Production-ready Telegram Mini App for romantic communication coaching — chat analysis, reply generation, dating advice, and profile insights.

## Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, shadcn-style UI
- **Backend:** Next.js API Routes, Prisma, PostgreSQL
- **AI:** OpenAI GPT-4o (text + vision)
- **Auth:** Telegram `initData` validation + JWT session cookie

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env.local` and set:

   - `DATABASE_URL` — PostgreSQL connection string
   - `OPENAI_API_KEY` — OpenAI API key
   - `TELEGRAM_BOT_TOKEN` — from [@BotFather](https://t.me/BotFather)
   - `JWT_SECRET` — at least 32 random characters
   - `NEXT_PUBLIC_APP_URL` — your Vercel URL (e.g. `https://love-help-ai.vercel.app`)

3. **Database**

   ```bash
   npx prisma db push
   ```

4. **Run locally**

   ```bash
   npm run dev
   ```

## Telegram Mini App

1. Create a bot via BotFather.
2. Set the Mini App URL to your deployed domain (Menu Button or `/setmenubutton`).
3. Enable the Web App in BotFather if required.

The client sends `x-telegram-init-data` on API requests; `/api/auth` validates it and sets an HTTP-only session cookie.

## Deploy (Vercel)

1. Import the repo on [Vercel](https://vercel.com).
2. Add all env vars from `.env.example`.
3. Use a hosted PostgreSQL (Neon, Supabase, etc.) for `DATABASE_URL`.
4. Run `prisma db push` against production once, or use `prisma migrate deploy` if you add migrations.

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth` | POST | Telegram auth + session |
| `/api/analyze` | POST | Chat screenshot analysis (vision) |
| `/api/reply` | POST | Reply generation by style |
| `/api/coach` | POST | Dating scenario advice |
| `/api/profile-analysis` | POST | Profile screenshot analysis |
| `/api/memory` | GET/POST/PATCH/DELETE | Relationship memory |
| `/api/history` | GET | Past chat analyses |

## Language

- UI default: **Russian** (`/locales/ru.json`)
- Secondary: **English** (`/locales/en.json`)
- AI system prompts are in English; user-facing AI output follows the language of the user’s input.

## Architecture

- All AI logic lives in `/app/api/*` — no OpenAI calls from the frontend.
- Frontend pages only render UI and call APIs via `apiFetch`.
- Relationship memory is injected into analyze, reply, and coach prompts.

## License

Private — all rights reserved.
