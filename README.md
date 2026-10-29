# Ganesh Singare — Portfolio

Next.js 15 · Tailwind CSS v4 · Framer Motion · React Three Fiber

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Edit content
All text (skills, experience, projects, contact links) lives in `data/resume.ts`.
The downloadable resume is `public/Ganesh_Singare_Resume.pdf`.

## AI assistant ("Ask my AI")
The chat widget calls `app/api/chat/route.ts`, which streams answers from Claude.
It only knows what's in `data/resume.ts` (compiled into the prompt by `lib/assistantPrompt.ts`),
so updating that file updates both the site and the bot.

```bash
cp .env.example .env.local   # then paste your key from https://platform.claude.com
```
Optional: set `CHAT_MODEL` (default `claude-opus-5-5`; `claude-haiku-5-5` is much cheaper).
On Vercel, add `ANTHROPIC_API_KEY` under Project → Settings → Environment Variables.

## Deploy
Push to GitHub and import the repo at https://vercel.com/new (zero config).
