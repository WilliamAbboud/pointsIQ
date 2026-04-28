# Kaivion

Your entire loyalty portfolio, finally worth what it should be.

Kaivion tracks every mile, point, and loyalty balance you own across banks, airlines, and hotels. It values them in real dollars, catches expirations before they happen, and shows you exactly where to redeem for peak value.

## Stack

- Next.js 16 (App Router, TypeScript, Tailwind v4)
- Supabase (Postgres + Auth, Row Level Security)
- Resend (transactional email)
- Vercel (hosting and CI)

## Local development

```bash
# Install dependencies
npm install

# Add your env vars (copy and fill in)
cp .env.local.example .env.local

# Run the dev server
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000).

Required env vars (in `.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_FROM_NAME`

## Database schema

The schema is in `supabase/schema.sql`. Run it once in the Supabase SQL Editor to create the `user_programs` table and Row Level Security policies.

## Legacy

The original static-HTML prototype lives in `legacy/`. Pages: landing, dashboard demo, signup, login, lean canvas, and the original React reference component. Kept for reference; not built or deployed.

## Revenue model

1. Subscription. About nine dollars per month or seventy-nine dollars per year. Unlocks the optimizer, alerts, unlimited programs, and availability search.
2. Credit card affiliate commissions. Two hundred to nine hundred dollars per approved card. Recommendations based on portfolio gaps.
3. Concierge booking service (Year 2). Fifty to one hundred dollars per ticket for redemption support.
4. Transfer bonus placement fees (Year 2 onward).
5. Business to business licensing (later). Portfolio layer for issuers or travel brands.

Expected mix in Year 2: about forty-five percent subscription, forty-five percent affiliate, ten percent concierge. See `legacy/lean-canvas.html` for the original business plan.

## Status

Phase 1 closing. Real auth, manual program entry, dashboard reading user data, transactional email through Resend on a verified domain. Daily expiration alert cron is the last Phase 1 task.
