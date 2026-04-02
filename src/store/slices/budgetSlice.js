import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_BUDGETS } from '../../data/transactions';

const loadBudgets = () => {
  try {
    const saved = localStorage.getItem('finflow_budgets');
    return saved ? JSON.parse(saved) : DEFAULT_BUDGETS;
  } catch { return DEFAULT_BUDGETS; }
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState: {
    budgets: loadBudgets(),
  },
  reducers: {
    setBudget(state, action) {
      const { category, amount } = action.payload;
      state.budgets[category] = amount;
    },
    resetBudgets(state) {
      state.budgets = { ...DEFAULT_BUDGETS };
    },
  },
});

export const { setBudget, resetBudgets } = budgetSlice.actions;
export const selectBudgets = s => s.budget.budgets;
export default budgetSlice.reducer;
