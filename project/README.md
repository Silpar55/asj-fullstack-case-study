# Circuit Labs — Finance Dashboard

## Getting Started

```bash
cd project
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables or additional setup required — all dependencies are declared in `package.json` and all data lives in the `data/` folder.

---

## Mock Credentials

Use the following accounts to log in and test role-based access control.

### Full Access Users (All Roles)

**Admin**

- Email: alex.rivera@circuitlabs.io
- Password: CircuitAdmin2025!

---

### Restricted Access User (Single Role Test)

**Viewer Only**

- Email: viewer.only@circuitlabs.io
- Password: ViewerOnly2025!

## Architecture

### Project Structure

```
src/
│
├── app/
│   ├── layout.tsx                        # Root layout — Tailwind global CSS, fonts, background
│   ├── fonts.ts                          # Two fonts used across the project (Inter, Barlow)
│   ├── globals.css                       # Tailwind initialization
│   ├── page.tsx                          # Root redirect → /login or /dashboard
│   │
│   ├── login/
│   │   └── page.tsx                      # Login form
│   │
│   ├── dashboard/
│   │   ├── layout.tsx                    # Dashboard shell — sidebar, navbar, auth guard
│   │   ├── page.tsx                      # Redirects to /dashboard/transactions
│   │   ├── transactions/
│   │   │   └── page.tsx                  # Transactions tab
│   │   ├── stats/
│   │   │   └── page.tsx                  # Stats tab
│   │   └── custom/
│   │       └── page.tsx                  # Prediction Lab tab
│   │
│   └── api/                              # Next.js server-side API routes
│       ├── auth/
│       │   └── login/
│       │       └── route.ts              # POST /api/auth/login
│       ├── banks/
│       │   ├── amex/transactions/
│       │   │   └── route.ts              # GET /api/banks/amex/transactions (raw)
│       │   ├── boa/transactions/
│       │   │   └── route.ts              # GET /api/banks/boa/transactions (raw)
│       │   └── chase/transactions/
│       │       └── route.ts              # GET /api/banks/chase/transactions (raw)
│       └── transactions/
│           ├── route.ts                  # GET /api/transactions (normalized + filtered)
│           └── [id]/
│               └── route.ts              # GET /api/transactions/:id
│
├── components/
│   └── dashboard/
│       ├── LastUpdated.tsx               # Shared — timestamp component
│       ├── Logout.tsx                    # Shared — logout button
│       ├── Navbar.tsx                    # Shared — top navigation bar
│       ├── Spinner.tsx                   # Shared — loading spinner
│       ├── transactions/
│       │   ├── Table.tsx                 # Transaction table with pagination and star feature
│       │   ├── TableFilters.tsx          # Bank, authBy, currency, date filters + CSV export
│       │   ├── Modal.tsx                 # Transaction detail modal (with bank-specific fields)
│       │   ├── DatePicker.tsx            # Date filter input
│       │   └── ToolTip.tsx               # Authorized By hover tooltip
│       ├── custom/
│       │   ├── SliderCard.tsx            # Growth assumption slider with manual input
│       │   ├── ProjectionKPICard.tsx     # Projected net flow / cash in / cash out card
│       │   ├── CashFlowChart.tsx         # Bar chart — historical vs projected cash flow
│       │   ├── YearOverYearTable.tsx     # Year-by-year summary table (actuals + estimates)
│       │   ├── CategoryPieChart.tsx      # Donut chart — projected spend by category + observed growth rates
│       │   └── MethodologyNote.tsx       # Methodology disclaimer
│       └── stats/
│           ├── KPI/
│           │   ├── CashInCard.tsx
│           │   ├── CashOutCard.tsx
│           │   ├── TopVendorsCard.tsx
│           │   ├── TopVendorsTable.tsx
│           │   ├── TopSpenderCard.tsx
│           │   ├── TopCategoriesCard.tsx
│           │   ├── BankAccBalanceCard.tsx
│           │   └── CashFlowCard.tsx
│           └── charts/
│               ├── bankBalance/
│               │   └── BankAccBalance.tsx   # Line chart — running balance over time
│               ├── cashflow/
│               │   └── CashFlow.tsx         # Bar chart — cash in vs cash out by month
│               ├── spender/
│               │   ├── TopSpender.tsx
│               │   └── SpenderAnimatedBar.tsx
│               └── categories/
│                   ├── TopCategories.tsx
│                   └── CategoryAnimatedBar.tsx
│
├── interfaces/
│   ├── auth/
│   │   ├── user.ts                       # Full user shape from user.json
│   │   ├── userLS.ts                     # Subset stored in localStorage (no password)
│   │   └── tabAccessMatrix.ts            # RBAC tab access rules
│   ├── banks/
│   │   ├── amex.ts                       # Raw Amex transaction shape
│   │   ├── boa.ts                        # Raw BoA transaction shape
│   │   ├── chase.ts                      # Raw Chase transaction shape
│   │   ├── normalized.ts                 # Unified NormalizedTransaction model
│   │   └── transactionRow.ts             # Formatted row shape used by the table
│   └── rates.ts                          # Exchange rates shape
│
└── lib/
    ├── api/
    │   ├── normalize.ts     # Maps each bank's raw shape into NormalizedTransaction
    │   ├── kpi.ts           # All KPI calculations (totals, top vendors, spenders, balance, cashflow)
    │   ├── custom.ts        # Prediction Lab — cash flow by year, categories by year, projections
    │   ├── table.ts         # Table utility functions — filters, currency unification, bank balance
    │   ├── currency.ts      # Exchange rate conversion logic
    │   ├── auth.ts          # localStorage helpers — getUser, saveUser, clearUser
    │   └── rabc.ts          # Tab access check — hasAccess(user, tab)
    ├── db/
    │   ├── banks.ts         # Reads amex.json, boa.json, chase.json as typed async functions
    │   ├── users.ts         # Reads user.json as a typed async function
    │   └── rates.ts         # Reads rates.json as a typed async function
    └── utils/
        ├── formatRows.ts    # Maps NormalizedTransaction → TransactionRow (table display)
        ├── formatStats.ts   # Formatting helpers for stat cards
        ├── formatTime.ts    # Date formatting helpers
        └── csv.ts           # CSV export builder
```

The separation between `lib/api/`, `lib/db/`, and `lib/utils/` was intentional. Components only import from `lib/api/` (business logic). `lib/api/` calls `lib/db/` for data access and `lib/utils/` for formatting. The UI layer stays thin and the logic stays independently readable.

---

### Key Decisions & Tradeoffs

**1. Authentication — localStorage vs. cookies / JWT**

The spec required `localStorage`, so that is what was used. The acknowledged tradeoff: reading `localStorage` can only happen on the client, which forces every dashboard page to carry a `"use client"` directive just to run the auth check in a `useEffect`. In production, the correct approach is an `httpOnly` cookie carrying a signed JWT. Middleware can verify it on the server before the page renders, dashboard pages stay as Server Components, and the cookie cannot be read or tampered with by JavaScript. Comments calling this out are left in the relevant files.

**2. Database simulation — JSON files as a typed data layer**

All transaction and user data lives in JSON files under `data/`. The `lib/db/` layer wraps each file in a typed `async` function that returns a typed promise — the same contract a real database client (e.g., Prisma + Postgres) would expose. None of the business logic or API routes depend on _how_ the data is fetched, only on the returned type. Switching to a real database requires changing only the three files in `lib/db/`.

**3. Normalization — one model, three different bank shapes**

Each bank encodes the same concepts differently. Chase signs the `amount` field to indicate direction (negative = debit). BoA always returns a positive `amount` and puts direction in a separate `debitCreditMemo` field. Amex uses `amountInCents` where the sign encodes direction, and stores the authorizing employee under `charge.employee` rather than the top-level user. The `lib/api/normalize.ts` file handles each bank in its own function and maps all of this into a single `NormalizedTransaction`. The `source` field on each normalized transaction keeps the original raw object intact, so the detail modal can surface bank-specific fields without re-fetching (e.g., Amex's `rewardEligible`, BoA's `runningBalance`, Chase's `categoryCode`).

---

## Prediction Lab (Bonus Tab)

The third tab is a **cash flow prediction interface** built on top of the transaction data already processed by the core KPI layer. Its purpose is to answer a practical question that the Stats tab cannot: *given what we know about how money moved in the past, what should we expect next year — and what decisions follow from that?*

### What it shows

- **Historical cash flow by year** — actual cash in and cash out per year (2023–2025), sourced directly from normalized transactions across all three banks.
- **Category spend breakdown** — the top five spending categories with their observed year-over-year growth rates (2023→2024 and 2024→2025), derived per category rather than in aggregate. A category accelerating its growth rate signals a strategic shift worth watching.
- **Projection model** — two assumption sliders (revenue growth %, expense growth %) compound the most recent year's actuals forward into 2026 and 2027. The result surfaces projected net flow, category spend estimates, and a visual comparison of historical vs. projected cash flow.

### The reasoning

A finance dashboard that only shows the past is a reporting tool. The value in a CRM context comes from connecting historical patterns to forward-looking decisions: if you expect seasonal demand to increase next year, you expect revenue growth; if you expect revenue growth, you expect to invest more in certain categories. The Prediction Lab makes that chain of reasoning explicit and interactive.

The category growth rates derived from real transaction data give each assumption a factual anchor. Software spending accelerating 24% year-over-year is a different kind of cost pressure than payroll growing 11%. Understanding which categories are accelerating tells you where your cost structure is shifting before you see it in a P&L.

### What is not possible with this data

Bank transaction data alone cannot produce net income, gross margin, or contribution margin. Cash in is not revenue — it can include loans, intercompany transfers, or reimbursements. Cash out is not COGS — it includes capital expenditure, financing, and operating costs that would need to be separated in a real model. The projection here is a scenario tool, not a forecast.

### What would make it a real forecast

With a richer dataset and more time, two improvements would move this from a prediction lab to an actual forecast:

1. **Per-category growth rates as defaults** — instead of a single shared expense growth slider, compute each category's observed compound annual growth rate from the transaction history and use that as the slider default. The user adjusts from an evidence-based starting point rather than an arbitrary one.

2. **An AI agent in the loop** — the sliders are currently manual. An LLM agent with access to the transaction data and external signals (seasonality indexes, industry benchmarks, macroeconomic indicators) could set those assumptions automatically and explain its reasoning. The slider then becomes a confidence adjustment on top of a model output rather than the model itself. That is the direction this tab was designed to grow toward.

---

## AI Tools Used

| Tool                    | How it was used |
| ----------------------- | --------------- |
| **Claude Sonnet**       | Recharts chart design (dark-theme bar and line charts), bank balance logic (per-bank anchor technique), TypeScript interface generation from raw bank JSON, KPI semantic review (debit-only filtering for vendors / spenders / categories), Prediction Lab UI layout and component architecture, and structuring this README from verbal notes |
| **ChatGPT (free tier)** | A brief early look at recharts component patterns before switching to Claude |

The core of the application — normalization rules, RBAC design, currency conversion math, KPI calculation approach, filter pipeline, and overall project structure — was written without AI assistance. AI was used to increase productivity on tasks where the output is not what is being evaluated: chart styling, component boilerplate, and documentation.

Due to time constraints, AI was also used more heavily on the Prediction Lab tab for dashboard layout and visualization design. That was a deliberate tradeoff: the interesting engineering in the custom tab is the data pipeline (`getCashFlowByYear`, `getCategoriesByYear`, `getProjections`) and the decision to derive observed per-category growth rates from real transaction data rather than using a single flat assumption. The visual layer on top of that logic was where AI assistance was most productive, and the result is consistent with the rest of the dashboard's design language.
