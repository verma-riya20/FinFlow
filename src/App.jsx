import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTheme, selectActivePage } from './store/slices/uiSlice';
import { setTheme } from './store/slices/uiSlice';
import Sidebar   from './components/Layout/Sidebar';
import Topbar    from './components/Layout/Topbar';
import Dashboard    from './components/Dashboard/Dashboard';
import Transactions from './components/Transactions/Transactions';
import Insights     from './components/Insights/Insights';
import BudgetPlanner from './components/Budget/BudgetPlanner';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/global.css';

const PAGES = {
  dashboard:    <Dashboard />,
  transactions: <Transactions />,
  insights:     <Insights />,
  budget:       <BudgetPlanner />,
};

export default function App() {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const activePage = useSelector(selectActivePage);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('finflow_theme') || 'dark';
    if (savedTheme !== theme) {
      dispatch(setTheme(savedTheme));
    }
  }, []);

  // Apply theme to DOM on mount and change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('finflow_theme', theme);
  }, [theme]);

  return (
    <ErrorBoundary>
      <div className="app-shell">
        <Sidebar />
        <div className="main-area">
          <Topbar />
          <div className="page-content">
            {PAGES[activePage]}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
