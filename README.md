# 🛒 বাজার দর — BazarDor

A responsive Bengali market-price app. Compare essential grocery prices, see the biggest daily changes, and check prices across different markets in Bangladesh.

## Technologies

Next.js App Router · React · TypeScript · Tailwind CSS · Lucide React · BetterAuth · Drizzle ORM · libSQL/Turso · react-hot-toast

## Features

1. Bengali prices, Dhaka-local date, category navigation and an infinite price ticker.
2. Top six price risers, top six fallers and all 33 products from the assignment API.
3. Category pages with numeric price sorting, including Bengali digits.
4. Protected product details with minimum, maximum, average and market-level prices.
5. BetterAuth email/password accounts and Google/GitHub OAuth integration.
6. A protected profile and separate route to update the user's name.
7. Skeleton loaders, friendly 404s, auth toasts and network error recovery.
8. Responsive layouts for mobile, tablet and desktop, plus keyboard navigation and reduced-motion support.

## Run locally

Requires Node.js 22.13+.

```bash
npm install
cp .env.example .env.local
```

Set `BETTER_AUTH_SECRET` to a random secret of at least 32 characters. Keep `BETTER_AUTH_URL=http://localhost:3000`. Leave Turso values blank to use the local SQLite database.

```bash
npm run db:local
npm run dev
```

Open http://localhost:3000. On Windows, copy `.env.example` manually and rename the copy `.env.local`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `BETTER_AUTH_URL` | Application origin, including `https://` in production |
| `BETTER_AUTH_SECRET` | Random server-only authentication secret |
| `TURSO_DATABASE_URL` | Persistent libSQL database URL for Vercel |
| `TURSO_AUTH_TOKEN` | Server-only database token |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | GitHub OAuth credentials |

Social login requires real OAuth credentials. Without them the buttons show a clear error; email/password authentication still works. There is no email verification or forgot-password flow.

## Google and GitHub OAuth

Create your own OAuth applications and configure these callback URLs:

```text
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/github
https://YOUR_DOMAIN/api/auth/callback/google
https://YOUR_DOMAIN/api/auth/callback/github
```

Google also needs the matching authorized JavaScript origin. Use a separate GitHub OAuth app for local and production if necessary. Add the credentials to `.env.local` locally and to server-side hosting environment variables in production. Never prefix secrets with `NEXT_PUBLIC_` or commit `.env.local`.

## Routes

| Route | Access |
| --- | --- |
| `/` | Public home |
| `/category/[slug]` | Public category and sorting |
| `/product/[slug]` | Signed-in users |
| `/signin`, `/signup` | Authentication |
| `/profile`, `/profile/update` | Signed-in users |
| Unknown route, category or product | Friendly 404 |

The API accepts product IDs; the app resolves a product slug to its ID before requesting the single-product endpoint. Invalid product slugs return 404 before the login check.

## API and prices

Primary: `https://api.api-store.workers.dev/api/bazardor`

Alternative: `https://api.abcz.workers.dev/api/bazardor`

Products and categories come from the API. If both sources are unavailable, a clearly labeled snapshot captured on 9 October 2026 is used. Live results cache for 60 seconds; fallback results retry after 15 seconds. The average is the mean of each market's `(minimum + maximum) / 2`. Markets are listed from lower to higher midpoint price.

## Checks

```bash
npm run typecheck
npm test
npm run build
```

Tests cover Bengali-number parsing, numeric sorting, six-item movers and market-price calculations. Test the real OAuth redirect after supplying provider credentials.

## Deploy on Vercel

1. Push this Next.js project to your own GitHub repository.
2. Create a Turso database and token. Set all required server-side environment variables on Vercel.
3. Apply schema migrations once to that database:
   `node --env-file=.env.local scripts/migrate-local.mjs` with Turso values set locally.
4. Import the GitHub repository on Vercel. Build command: `npm run build`.
5. Set `BETTER_AUTH_URL` to the final production origin and update OAuth callback URLs. Redeploy.
6. Check signup, login, profile update, logout, protected routes and direct page refreshes.

The hosted preview uses the same App Router source with a Workers-compatible build and a D1 database. The downloadable submission project uses standard Next.js and Turso on Vercel.

## Submission

## Submission

- Live Link: https://bazar-dor-assignment-7.vercel.app
- GitHub Repository Link: https://github.com/Mst-Anika-Khatun/bazar-dor-assignment-7

## Assets

Hero illustration, logo and visual reference: Programming Hero B14 Assignment 07 supplied files. Noto Sans Bengali is distributed under the SIL Open Font License; see `public/fonts/OFL.txt`.
