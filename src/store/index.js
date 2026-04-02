import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './slices/transactionsSlice';
import uiReducer           from './slices/uiSlice';
import budgetReducer       from './slices/budgetSlice';
import { persistenceMiddleware } from './middleware/persistenceMiddleware';

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    ui:           uiReducer,
    budget:       budgetReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistenceMiddleware),
});
