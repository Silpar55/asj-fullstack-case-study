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
│   │       └── page.tsx                  # Bonus tab (in progress)
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

## What Was Skipped / In Progress

All core requirements are implemented. The only outstanding item is the **Custom tab** (bonus). The plan is a **Prediction Dashboard**: using the KPI data already computed (cash in, cash out, spend by category, top vendors across 2023–2025), project future spending based on configurable growth assumptions. For example: "If revenue grows 15% year-over-year, how does the spend breakdown look next year?" The data range is wide enough to build a simple trend model, and the KPI functions are already in place to feed it.

---

## AI Tools Used

| Tool                    | How it was used                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Claude Sonnet**       | Recharts styling (line and bar chart dark-theme design), bank balance logic (anchoring each bank to its reported closing/current balance), TypeScript interface generation from raw bank JSON, KPI semantic review (identifying that top vendors / top spenders / top categories should filter to debits only), and writing this README for structuring correctly my ideas |
| **ChatGPT (free tier)** | A brief early look at recharts component patterns before switching to Claude                                                                                                                                                                                                                                                                                               |

The core of the application — normalization rules, RBAC design, currency conversion math, KPI calculation approach, filter pipeline, and overall project structure — was written without AI assistance. AI was used to increase productivity on tasks where the output is not what is being evaluated: styling, interface boilerplate, and documentation.
