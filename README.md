# How Long Will My Money Last

A responsive web calculator that projects how long a nest egg lasts under
regular, inflation-indexed withdrawals — with room for one-off lump-sum
withdrawals and windfalls in any year.

**Live URL:** [How Long Will My Money Last](https://money-last.vercel.app)

## Setup

Requirements: Node.js 20.9+ (Next.js 16 minimum).

```bash
npm install
npm run dev          # local dev at http://localhost:3000
npm run build        # production build
npm run start        # serve the production build
```

## Deploying to Vercel

Push this repo to GitHub / GitLab / Bitbucket and import it at
[vercel.com/new](https://vercel.com/new). No environment variables are needed
— the calculator runs entirely client-side.

## Project layout

```
src/
├── lib/
│   ├── calc.ts             Pure calculation engine (no React)
│   └── format.ts           Currency + compact-number formatters
└── app/
│   ├── layout.tsx          Root layout, loads Poppins + Tiempos fonts
│   ├── page.tsx            Route entry — renders <Calculator />
│   └── globals.css         Theme tokens, ambient glow, keyframes
└── components/
    ├── Calculator.tsx      Composition root: state + page shape
    ├── AssumptionsCard.tsx Inputs panel (sticky on desktop)
    ├── ResultCard.tsx      Depletion / survives headline card
    ├── BalanceChart.tsx    Recharts area chart
    ├── LumpSumsCard.tsx    Collapsible year-by-year lump-sum editor
    ├── DrawdownTable.tsx   Full year-by-year drawdown table
    ├── AnimatedAmount.tsx  Tween hook + display component
    ├── Card.tsx            Frosted-glass surface primitive
    └── NumField.tsx        Number-input controls (large + inline)
```

Each sub-card is self-contained and receives only the props it needs;
`Calculator.tsx` owns all state and passes callbacks down.

## Calculation

The calc engine reproduces the supplied Excel model exactly. Per year:

```
rm      = (1 + annualReturn)^(1/12) - 1     // monthly compounding rate
end     = start * (1+rm)^12
        - (regular/12) * ((1+rm)^12 - 1) / rm     // Excel's FV(rm, 12, regular/12, -start)
        - lumpOut
        + windfall
```

- `regular` starts at `monthlyWithdrawal * 12` and is multiplied by
  `(1 + annualInflation)` each subsequent year (matching the Excel).
- Once the closing balance goes below zero, the next year opens at zero and
  the withdrawal for that year resets to zero (mirrors the sheet's
  `IF(prevEnd<0, 0, ...)` guard).
- `todayValue = start / (1 + annualInflation)^year`.
- `depletionYear` is the first year whose closing balance is negative.

Verified against the reference scenario in the supplied file
(**$1,650,000** starting balance, **7.5%** average return, **3%** inflation,
**$10,000** monthly withdrawal, windfalls at years 1/5/9): all 51 rows and 6
columns match the Excel cached values **to the cent**, and depletion occurs
in **year 21** as the brief specifies.

## Tech

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** with strict mode
- **Tailwind CSS v4** — theme tokens defined in `globals.css`
- **Recharts** — area chart
- **Poppins** (Google Fonts) for body, **Tiempos Headline** (local .woff2)
  for headings — pulled from Q Wealth's website

No database, no API routes, no auth. The whole calculator runs in the
browser.