import { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTransaction,
  restoreTransaction,
  updateTransaction,
  deleteTransaction,
  setFilter,
  setPage,
  resetFilters,
  selectAllTransactions,
  selectFilters,
  selectFilteredTransactions,
  selectPaginatedTransactions,
} from '../store/slices/transactionsSlice';
import { useToast } from '../components/UI/Toast';

/**
 * Custom hook for transaction management
 * Encapsulates CRUD operations and filter logic
 */
export const useTransactions = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const allTransactions = useSelector(selectAllTransactions);
  const filters = useSelector(selectFilters);
  const filteredTransactions = useSelector(selectFilteredTransactions);
  const paginated = useSelector(selectPaginatedTransactions);
  const pendingDeleteRef = useRef(null);

  const add = useCallback((payload) => {
    dispatch(addTransaction(payload));
    toast('Transaction added ✅');
  }, [dispatch, toast]);

  const update = useCallback((payload) => {
    dispatch(updateTransaction(payload));
    toast('Transaction updated ✅');
  }, [dispatch, toast]);

  const undoLastDelete = useCallback(() => {
    const pending = pendingDeleteRef.current;
    if (!pending) return false;

    clearTimeout(pending.timeoutId);
    dispatch(restoreTransaction({ transaction: pending.transaction, index: pending.index }));
    pendingDeleteRef.current = null;
    toast('Delete undone', 'success');
    return true;
  }, [dispatch, toast]);

  const delete_ = useCallback((id) => {
    if (!window.confirm('Delete this transaction?')) return;
    const idx = allTransactions.findIndex(t => t.id === id);
    const snapshot = allTransactions[idx];
    if (!snapshot) return;

    dispatch(deleteTransaction(id));
    if (pendingDeleteRef.current?.timeoutId) {
      clearTimeout(pendingDeleteRef.current.timeoutId);
    }

    const timeoutId = setTimeout(() => {
      pendingDeleteRef.current = null;
    }, 5000);

    pendingDeleteRef.current = { transaction: snapshot, index: idx, timeoutId };
    toast('Transaction deleted', 'warn', {
      actionLabel: 'Undo',
      onAction: undoLastDelete,
      duration: 5000,
    });
  }, [dispatch, toast, allTransactions, undoLastDelete]);

  const hasPendingDelete = useCallback(() => !!pendingDeleteRef.current, []);

  const reset = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  return {
    allTransactions,
    filteredTransactions,
    paginated,
    filters,
    add,
    update,
    delete: delete_,
    undoLastDelete,
    hasPendingDelete,
    reset,
  };
};

/**
 * Custom hook for filter management
 * Simplifies filter state mutations
 */
export const useTransactionFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);

  const setSearch = useCallback((search) => {
    dispatch(setFilter({ search }));
  }, [dispatch]);

  const setType = useCallback((type) => {
    dispatch(setFilter({ type }));
  }, [dispatch]);

  const setCategory = useCallback((category) => {
    dispatch(setFilter({ category }));
  }, [dispatch]);

  const setSort = useCallback((sortBy, sortDir) => {
    dispatch(setFilter({ sortBy, sortDir }));
  }, [dispatch]);

  const setPageNumber = useCallback((page) => {
    dispatch(setPage(page));
  }, [dispatch]);

  const resetAllFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  return {
    filters,
    setSearch,
    setType,
    setCategory,
    setSort,
    setPage: setPageNumber,
    resetAllFilters,
  };
};
