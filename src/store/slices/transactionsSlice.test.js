import transactionsReducer, {
  addTransaction,
  deleteTransaction,
  restoreTransaction,
  setFilter,
  setPage,
  selectSummary,
  selectPaginatedTransactions,
} from './transactionsSlice';

const baseState = {
  transactions: {
    items: [
      { id: '1', description: 'Salary', amount: 50000, type: 'income', category: 'Salary', date: '2026-04-01' },
      { id: '2', description: 'Rent', amount: 15000, type: 'expense', category: 'Rent', date: '2026-03-10' },
      { id: '3', description: 'Groceries', amount: 5000, type: 'expense', category: 'Food & Dining', date: '2025-10-05' },
    ],
    filters: {
      search: '',
      type: 'all',
      category: 'all',
      sortBy: 'date',
      sortDir: 'desc',
      page: 1,
    },
  },
};

describe('transactionsSlice reducers', () => {
  test('restoreTransaction inserts item back at original index', () => {
    const deleted = baseState.transactions.items[1];
    const afterDelete = transactionsReducer(baseState.transactions, deleteTransaction('2'));

    const afterRestore = transactionsReducer(
      afterDelete,
      restoreTransaction({ transaction: deleted, index: 1 })
    );

    expect(afterRestore.items[1].id).toBe('2');
    expect(afterRestore.items).toHaveLength(3);
  });

  test('setFilter resets page to 1', () => {
    const withPage = transactionsReducer(baseState.transactions, setPage(3));
    const filtered = transactionsReducer(withPage, setFilter({ type: 'expense' }));
    expect(filtered.filters.page).toBe(1);
  });

  test('addTransaction prepends item', () => {
    const next = transactionsReducer(
      baseState.transactions,
      addTransaction({ id: 'new', description: 'Bonus', amount: 1000, type: 'income', category: 'Salary', date: '2026-04-02' })
    );
    expect(next.items[0].id).toBe('new');
  });
});

describe('transactions selectors', () => {
  test('selectSummary respects months argument', () => {
    const summary3m = selectSummary(baseState, 3);
    const summary12m = selectSummary(baseState, 12);

    // Old expense should be excluded in 3M and included in 12M.
    expect(summary3m.expense).toBe(15000);
    expect(summary12m.expense).toBe(20000);
  });

  test('selectPaginatedTransactions clamps out-of-range page', () => {
    const state = {
      transactions: {
        ...baseState.transactions,
        filters: {
          ...baseState.transactions.filters,
          page: 999,
        },
      },
    };

    const paginated = selectPaginatedTransactions(state);
    expect(paginated.page).toBe(paginated.pages);
    expect(paginated.items.length).toBeGreaterThan(0);
  });
});
