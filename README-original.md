# PointsIQ

Your entire loyalty portfolio, finally worth what it should be.

PointsIQ tracks every mile, point, and loyalty balance you own across banks, airlines, and hotels. It values them in real dollars, catches expirations before they happen, and shows you exactly where to redeem for peak value.

## What is in this repo

| File | Purpose |
| --- | --- |
| `index.html` | Marketing landing page |
| `pointsiq.html` | Live dashboard demo |
| `signup.html` | Account creation page |
| `login.html` | Log in page |
| `lean-canvas.html` | Business plan (Lean Canvas) |
| `pointsiq.jsx` | Original React component the dashboard was derived from |

All pages are self-contained single-file HTML. No build step, no dependencies. Open `index.html` in any browser to view the full product.

## Local preview

```bash
# From the repo root
open index.html
# Or serve with any static server
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Deployed version

Once GitHub Pages is enabled for this repo (Settings → Pages → Deploy from main branch, root folder), the site will be live at:

`https://WilliamAbboud.github.io/points-iq/`

Share this URL via WhatsApp, email, or anywhere else.

## Revenue model

1. **Subscription.** $9 per month or $79 per year. Unlocks the optimizer, alerts, unlimited programs, and availability search.
2. **Credit card affiliate commissions.** $200 to $900 per approved card. Recommendations based on portfolio gaps.
3. **Concierge booking service** *(Year 2).* $50 to $100 per ticket for redemption support.
4. **Transfer bonus placement fees** *(Year 2 onward).*
5. **Business to business licensing** *(later).* Portfolio layer for issuers or travel brands.

Expected mix in Year 2: about 45% subscription, 45% affiliate, 10% concierge. See `lean-canvas.html` for the full business plan.

## Status

Pre-launch. All data in the dashboard is illustrative.
