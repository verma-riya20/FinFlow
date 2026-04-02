// Middleware to handle localStorage persistence
export const persistenceMiddleware = store => next => action => {
  const result = next(action);
  const state = store.getState();

  // Persist transactions on transaction changes
  if (action.type.startsWith('transactions/')) {
    try {
      localStorage.setItem('finflow_transactions', JSON.stringify(state.transactions.items));
    } catch (e) {
      console.error('Failed to persist transactions:', e);
    }
  }

  // Persist budget on budget changes
  if (action.type.startsWith('budget/')) {
    try {
      localStorage.setItem('finflow_budgets', JSON.stringify(state.budget.budgets));
    } catch (e) {
      console.error('Failed to persist budgets:', e);
    }
  }

  return result;
};
