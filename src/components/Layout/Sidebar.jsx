import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActivePage, closeSidebar, selectActivePage, selectSidebarOpen } from '../../store/slices/uiSlice';
import { selectRole } from '../../store/slices/uiSlice';

const NAV_ITEMS = [
  { id: 'dashboard',    icon: '📊', label: 'Dashboard' },
  { id: 'transactions', icon: '💳', label: 'Transactions' },
  { id: 'insights',     icon: '💡', label: 'Insights' },
  { id: 'budget',       icon: '🎯', label: 'Budget Planner', badge: 'NEW' },
];

export default function Sidebar() {
  const dispatch    = useDispatch();
  const activePage  = useSelector(selectActivePage);
  const sidebarOpen = useSelector(selectSidebarOpen);
  const role        = useSelector(selectRole);

  return (
    <>
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => dispatch(closeSidebar())}
      />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="logo">
          <div className="logo-mark">F</div>
          <div className="logo-name">Fin<span>Flow</span></div>
        </div>

        {/* Nav */}
        <div className="nav-group">
          <span className="nav-group-label">Navigation</span>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`nav-btn ${activePage === item.id ? 'active' : ''}`}
              onClick={() => dispatch(setActivePage(item.id))}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </div>

        {/* User */}
        <div className="sidebar-user">
          <div className="user-avatar">{role === 'admin' ? 'A' : 'V'}</div>
          <div>
            <div className="user-name">{role === 'admin' ? 'Admin User' : 'Riya (Viewer)'}</div>
            <div className="user-role">finflow@zorvyn.in</div>
          </div>
        </div>
      </aside>
    </>
  );
}
