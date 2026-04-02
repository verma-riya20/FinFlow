import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { SEED_TRANSACTIONS } from '../../data/transactions';

// Load from localStorage or use seed data
const loadState = () => {
  try {
    const saved = localStorage.getItem('finflow_transactions');
    return saved ? JSON.parse(saved) : SEED_TRANSACTIONS;
  } catch { return SEED_TRANSACTIONS; }
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: loadState(),
    filters: {
      search: '',
      type: 'all',
      category: 'all',
      sortBy: 'date',
      sortDir: 'desc',
      page: 1,
    },
  },
  reducers: {
    addTransaction(state, action) {
      state.items.unshift(action.payload);
    },
    restoreTransaction(state, action) {
      const { transaction, index } = action.payload;
      const safeIndex = Math.max(0, Math.min(index, state.items.length));
      state.items.splice(safeIndex, 0, transaction);
    },
    updateTransaction(state, action) {
      const idx = state.items.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteTransaction(state, action) {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage(state, action) {
      state.filters.page = action.payload;
    },
    resetFilters(state) {
      state.filters = { search: '', type: 'all', category: 'all', sortBy: 'date', sortDir: 'desc', page: 1 };
    },
  },
});

export const {
  addTransaction, restoreTransaction, updateTransaction, deleteTransaction,
  setFilter, setPage, resetFilters,
} = transactionsSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────
const selectAllTransactionsRaw = s => s.transactions.items;
const selectFiltersRaw = s => s.transactions.filters;

export const selectAllTransactions = selectAllTransactionsRaw;
export const selectFilters = selectFiltersRaw;

// Memoized selector for filtered AND sorted transactions
export const selectFilteredTransactions = createSelector(
  [selectAllTransactionsRaw, selectFiltersRaw],
  (items, filters) => {
    const { search, type, category, sortBy, sortDir } = filters;
    let data = [...items];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(t =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    if (type !== 'all')     data = data.filter(t => t.type === type);
    if (category !== 'all') data = data.filter(t => t.category === category);

    data.sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy];
      if (sortBy === 'amount') { va = +va; vb = +vb; }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }
);

// Memoized selector for paginated results
export const selectPaginatedTransactions = createSelector(
  [selectFilteredTransactions, selectFiltersRaw],
  (filtered, filters) => {
    const { page } = filters;
    const PAGE_SIZE = 10;
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(Math.max(page, 1), pages);
    const items = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
    return { items, total, pages, page: safePage };
  }
);

const selectSummaryMonths = (_, months = 6) => months;

export const selectSummary = createSelector(
  [selectAllTransactionsRaw, selectSummaryMonths],
  (items, months) => {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    const data = items.filter(t => t.date >= cutoffStr);

    const income  = data.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
    const expense = data.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
    const balance = income - expense;
    const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

    // Monthly breakdown
    const monthMap = {};
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i);
      monthMap[d.toISOString().slice(0, 7)] = { income: 0, expense: 0 };
    }
    data.forEach(t => {
      const key = t.date.slice(0, 7);
      if (monthMap[key]) {
        monthMap[key][t.type] += t.amount;
      }
    });

    // Category breakdown (expenses only)
    const catMap = {};
    data.filter(t => t.type === 'expense').forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });

    return { income, expense, balance, savingsRate, monthlyBreakdown: monthMap, categoryBreakdown: catMap };
  }
);

export const selectInsights = createSelector(
  [selectAllTransactionsRaw],
  (all) => {
    const catMap = {};
    const expByMonth = {};
    const incByMonth = {};

    all.forEach(t => {
      const key = t.date.slice(0, 7);
      if (t.type === 'expense') {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
        expByMonth[key] = (expByMonth[key] || 0) + t.amount;
      } else {
        incByMonth[key] = (incByMonth[key] || 0) + t.amount;
      }
    });

    const sortedCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    const thisM = new Date().toISOString().slice(0, 7);
    const prev  = new Date(); prev.setMonth(prev.getMonth() - 1);
    const lastM = prev.toISOString().slice(0, 7);

    const totalIncome  = all.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
    const totalExpense = all.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
    const months6 = [];
    const maxExp  = Math.max(...Object.values(expByMonth), 1);

    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i);
      const key = d.toISOString().slice(0, 7);
      months6.push({ month: key, expense: expByMonth[key] || 0, income: incByMonth[key] || 0 });
    }

    return {
      topCategory:      sortedCats[0] ? { name: sortedCats[0][0], amount: sortedCats[0][1] } : null,
      thisMonthExpense: expByMonth[thisM] || 0,
      lastMonthExpense: expByMonth[lastM] || 0,
      thisMonthIncome:  incByMonth[thisM] || 0,
      lastMonthIncome:  incByMonth[lastM] || 0,
      avgMonthlyExpense: Math.round(totalExpense / Math.max(Object.keys(expByMonth).length, 1)),
      netSavings:       totalIncome - totalExpense,
      categoryBreakdown: sortedCats.slice(0, 8).map(([name, amount]) => ({ name, amount })),
      monthlyTrend:     months6,
      maxMonthlyExpense: maxExp,
      thisMonthCatMap:  Object.fromEntries(
        all.filter(t => t.date.startsWith(thisM) && t.type === 'expense')
           .reduce((m, t) => { m.set(t.category, (m.get(t.category) || 0) + t.amount); return m; }, new Map())
      ),
    };
  }
);

export default transactionsSlice.reducer;
