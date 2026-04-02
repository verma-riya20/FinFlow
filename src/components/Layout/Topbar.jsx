import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, setRole, toggleSidebar, selectTheme, selectRole, selectActivePage } from '../../store/slices/uiSlice';

const TITLES = { dashboard: 'Dashboard', transactions: 'Transactions', insights: 'Insights', budget: 'Budget Planner' };

export default function Topbar() {
  const dispatch   = useDispatch();
  const theme      = useSelector(selectTheme);
  const role       = useSelector(selectRole);
  const activePage = useSelector(selectActivePage);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger" onClick={() => dispatch(toggleSidebar())}>☰</button>
        <div className="topbar-title">{TITLES[activePage]}</div>
      </div>

      <div className="topbar-right">
        <div className="role-toggle">
          <span className="role-toggle-label">Role</span>
          <select value={role} onChange={e => dispatch(setRole(e.target.value))}>
            <option value="admin">⚙ Admin</option>
            <option value="viewer">👁 Viewer</option>
          </select>
        </div>

        <button className="icon-btn" onClick={() => dispatch(toggleTheme())} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <div className="topbar-avatar">{role === 'admin' ? 'A' : 'V'}</div>
      </div>
    </header>
  );
}
