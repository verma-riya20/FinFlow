import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBudget, resetBudgets, selectBudgets } from '../store/slices/budgetSlice';
import { selectInsights } from '../store/slices/transactionsSlice';
import { useToast } from '../components/UI/Toast';

/**
 * Custom hook for budget management and summary
 * Encapsulates budget state and calculations
 */
export const useBudgetSummary = () => {
  const budgets = useSelector(selectBudgets);
  const insights = useSelector(selectInsights);
  const dispatch = useDispatch();
  const toast = useToast();

  const thisMonthMap = insights.thisMonthCatMap || {};
  const categories = Object.keys(budgets);

  // Calculate summary metrics
  const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0);
  const totalSpent = categories.reduce((a, cat) => a + (thisMonthMap[cat] || 0), 0);
  const overCount = categories.filter(cat => (thisMonthMap[cat] || 0) > budgets[cat]).length;
  const onTrackCount = categories.length - overCount;
  const overallPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const remaining = totalBudget - totalSpent;
  const burnRate = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const setBudgetAmount = useCallback((category, amount) => {
    dispatch(setBudget({ category, amount }));
    toast(`Budget for ${category} set to ₹${amount}`, 'success');
  }, [dispatch, toast]);

  const resetAll = useCallback(() => {
    dispatch(resetBudgets());
    toast('Budgets reset to defaults', 'warn');
  }, [dispatch, toast]);

  const getSpent = useCallback((category) => thisMonthMap[category] || 0, [thisMonthMap]);
  const getBudget = useCallback((category) => budgets[category] || 0, [budgets]);
  const isOverBudget = useCallback((category) => getSpent(category) > getBudget(category), [getSpent, getBudget]);
  const getRemaining = useCallback((category) => getBudget(category) - getSpent(category), [getBudget, getSpent]);

  return {
    budgets,
    categories,
    totalBudget,
    totalSpent,
    remaining,
    overallPct,
    burnRate,
    overCount,
    onTrackCount,
    setBudgetAmount,
    resetAll,
    getSpent,
    getBudget,
    isOverBudget,
    getRemaining,
  };
};
