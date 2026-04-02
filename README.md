# 💰 FinFlow — Finance Dashboard

A production-grade personal finance dashboard built with **React 18 + Redux Toolkit**, featuring a unique **Smart Budget Planner** with live drag-to-set budget limits and real-time burn-rate gauges.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the app
npm start
# → Opens at http://localhost:3000
```

That's it. No backend needed — all data is managed in Redux with localStorage persistence.

---

## 📁 Project Structure

```
src/
├── index.js                        ← React entry, Redux Provider
├── App.jsx                         ← App shell, page routing
│
├── store/
│   ├── index.js                    ← configureStore
│   └── slices/
│       ├── transactionsSlice.js    ← CRUD + selectors (filter/sort/paginate/summary/insights)
│       ├── uiSlice.js              ← theme, role, page, sidebar
│       └── budgetSlice.js          ← budget limits with localStorage persistence
│
├── data/
│   └── transactions.js             ← 70+ seed transactions, categories, colors, icons
│
├── utils/
│   └── helpers.js                  ← fmt, fmtShort, fmtDate, fmtMonthKey, genId, clamp
│
├── styles/
│   └── global.css                  ← Full design system (CSS variables, dark/light)
│
└── components/
    ├── Layout/
    │   ├── Sidebar.jsx             ← Navigation, logo, user info
    │   └── Topbar.jsx              ← Role toggle, theme toggle
    ├── UI/
    │   └── Toast.jsx               ← Toast notifications (Context)
    ├── Dashboard/
    │   ├── Dashboard.jsx           ← KPI cards + period toggle
    │   └── Charts.jsx              ← Recharts: Area, Bar, Pie, HorizBar
    ├── Transactions/
    │   ├── Transactions.jsx        ← Table, search, filter, sort, pagination, CSV export
    │   └── TransactionModal.jsx    ← Add / Edit form with validation
    ├── Insights/
    │   └── Insights.jsx            ← Insight cards, monthly bar chart
    └── Budget/
        └── BudgetPlanner.jsx       ← 🌟 Unique Feature
```

---

## ✅ Features Checklist

### Core Requirements
| Feature | Status |
|---|---|
| Summary cards — Balance, Income, Expenses, Savings Rate | ✅ |
| Time-based chart — Balance trend (Area chart) | ✅ |
| Categorical chart — Spending donut + horizontal bar | ✅ |
| Income vs Expenses bar chart | ✅ |
| Transactions table — Date, Amount, Category, Type | ✅ |
| Search, filter (type + category), sort | ✅ |
| Role-based UI — Admin can add/edit/delete; Viewer read-only | ✅ |
| Insights — top category, monthly comparison, averages | ✅ |
| State management via Redux Toolkit | ✅ |
| Responsive — mobile sidebar with overlay | ✅ |
| Handles empty/no-data states | ✅ |

### Optional Enhancements (All Implemented)
| Feature | Status |
|---|---|
| Dark / Light mode toggle | ✅ |
| localStorage persistence (transactions + budgets + theme) | ✅ |
| Export to CSV | ✅ |
| Undo delete (toast action + Ctrl/Cmd+Z) | ✅ |
| Animations (page transitions, card hovers, chart fills) | ✅ |
| Advanced filtering + sorting | ✅ |

### Unique Feature 🌟
| Feature | Details |
|---|---|
| **Smart Budget Planner** | Set per-category monthly budget limits via drag sliders. SVG donut gauges show live burn-rate %. Color-coded: green → gold → red as you approach/exceed limits. Hero overview shows total budget health at a glance. Fully persisted in localStorage. Admin-only editing, Viewer sees read-only state. |

---

## 🛠 Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 | Component model, hooks |
| State | Redux Toolkit | Predictable state, RTK's createSlice |
| Charts | Recharts | Composable, Recharts compat with React 18 |
| Styling | CSS Custom Properties | Zero runtime cost, instant dark/light switch |
| Persistence | localStorage | No backend dependency as per brief |
| Fonts | Clash Display + Satoshi | Distinctive, finance-appropriate personality |

---

## �️ Engineering Best Practices

### Reducer Purity
All reducers are **pure functions** with no side effects. localStorage and DOM mutations are handled by:
- **Persistence Middleware** ([src/store/middleware/persistenceMiddleware.js](src/store/middleware/persistenceMiddleware.js)) — watches state changes and writes to localStorage
- **useEffect Hooks** (in [src/App.jsx](src/App.jsx)) — applies theme to DOM, loads persisted state

### Memoized Selectors
Selectors use **createSelector** from [reselect](https://github.com/reduxjs/reselect) for efficient memoization:
- Filtered/sorted transactions are cached until input state changes
- Time-range dashboard summary selector explicitly memoizes by `months` argument
- Prevents unnecessary re-renders and improves performance
- See [src/store/slices/transactionsSlice.js](src/store/slices/transactionsSlice.js)

### Interaction Reliability
- Out-of-range pagination is clamped safely (prevents empty pages after filters/deletes)
- Delete supports **Undo** via toast action and `Ctrl/Cmd+Z`
- Global shortcuts ignore plain typing in form fields to prevent accidental triggers

### Error Handling
- **ErrorBoundary** ([src/components/ErrorBoundary.jsx](src/components/ErrorBoundary.jsx)) catches component crashes
- localStorage failures log errors without breaking the app
- CSV export includes record count in toast notification

### Type Safety
- **PropTypes** validate component props in development
- Key components: [Dashboard](src/components/Dashboard/Dashboard.jsx), [Transactions](src/components/Transactions/Transactions.jsx), [TransactionModal](src/components/Transactions/TransactionModal.jsx), [BudgetPlanner](src/components/Budget/BudgetPlanner.jsx)

### Responsive Design
- Mobile-first breakpoints (1200px, 820px, 520px)
- Transaction table is **horizontally scrollable** on narrow screens
- Sidebar overlay with blur on mobile

---

## �🎨 Design Decisions

- **Deep navy + gold palette** — conveys financial trust and premium feel
- **Clash Display** for headings — geometric authority without being corporate-cold
- **Satoshi** for body — clean, modern, highly legible at small sizes
- **2px gradient top-border on cards** — subtle color-coding without visual noise
- **SVG donut gauges** — hand-crafted, no charting library needed, lightweight
- **Drag slider with live feedback** — tactile, satisfying budget UX

---

## 📝 State Architecture

```
Redux Store
├── transactions
│   ├── items[]          ← All transactions (CRUD, persisted via middleware)
│   └── filters          ← search, type, category, sortBy, sortDir, page
│       └── (computed via memoized selectors with createSelector)
├── ui
│   ├── theme            ← 'dark' | 'light' (persisted via useEffect)
│   ├── role             ← 'admin' | 'viewer'
│   ├── activePage       ← current page
│   └── sidebarOpen      ← mobile sidebar
└── budget
    └── budgets{}        ← { category: amount } (persisted via middleware)
```

**Derived data** (summaries, insights, filtered lists) is computed via **memoized selectors** using `createSelector` from reselect — no redundant state, single source of truth.

**Side effects** (localStorage, DOM manipulation) are handled in middleware and useEffect hooks, NOT in reducers — follows Redux best practices for purity and testability.
