import React, { useState, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTransactions, useTransactionFilters } from '../../hooks/useTransactions';
import { useDebounce, useKeyboardShortcuts } from '../../hooks/useUtility';
import TransactionModal from './TransactionModal';
import { fmt, fmtDate } from '../../utils/helpers';

export default function Transactions() {
  const {
    allTransactions,
    filteredTransactions,
    filters,
    paginated,
    add,
    update,
    delete: delete_,
    undoLastDelete,
  } = useTransactions();
  const { setSearch, setType, setCategory, setSort, setPage, resetAllFilters } = useTransactionFilters();
  const { role } = useSelector(s => ({ role: s.ui.role }));
  const isAdmin = role === 'admin';
  const [modal, setModal] = useState({ open: false, data: null });
  const [localSearch, setLocalSearch] = useState(filters.search);
  const searchInputRef = useRef(null);

  // Debounce search input — prevents excessive filtering
  const debouncedSearch = useDebounce(localSearch, 300);
  
  // Update Redux when debounced value changes
  React.useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setSearch(debouncedSearch);
    }
  }, [debouncedSearch, filters.search, setSearch]);

  const shortcutBindings = useMemo(() => {
    const shortcuts = [
      { key: 'k', ctrlKey: true, handler: () => searchInputRef.current?.focus() },
      { key: '/', ctrlKey: false, handler: () => searchInputRef.current?.focus() },
    ];

    if (isAdmin) {
      shortcuts.push({ key: 'n', ctrlKey: true, handler: () => setModal({ open: true, data: null }) });
      shortcuts.push({ key: 'z', ctrlKey: true, handler: () => undoLastDelete() });
    }

    return shortcuts;
  }, [isAdmin, undoLastDelete]);

  // Keyboard shortcuts
  useKeyboardShortcuts(shortcutBindings);

  const cats = useMemo(() => [...new Set(allTransactions.map(t => t.category))].sort(), [allTransactions]);
  const total = filteredTransactions.length;

  const visiblePages = useMemo(() => {
    const radius = 2;
    const start = Math.max(1, paginated.page - radius);
    const end = Math.min(paginated.pages, paginated.page + radius);
    const pages = [];
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [paginated.page, paginated.pages]);

  const toggleSort = (field) => {
    const isSameField = filters.sortBy === field;
    const nextDir = isSameField && filters.sortDir === 'asc' ? 'desc' : 'asc';
    setSort(field, nextDir);
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    resetAllFilters();
  };

  const handleSave = (payload) => {
    if (!isAdmin) return;
    modal.data ? update(payload) : add(payload);
    setModal({ open: false, data: null });
  };

  const exportCSV = () => {
    const rows = [['Date','Description','Category','Type','Amount']];
    filteredTransactions.forEach(t => rows.push([t.date, `"${t.description}"`, t.category, t.type, t.amount]));
    const blob = new Blob([rows.map(r=>r.join(',')).join('\n')], { type:'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'finflow-transactions.csv'; a.click();
    URL.revokeObjectURL(url);
    // Toast would come from useTransactions hook if needed
  };

  return (
    <div className="page-enter">
      <div className="sec-hdr">
        <div>
          <h2>Transactions</h2>
          <p aria-live="polite">{total} record{total !== 1 ? 's' : ''}</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Shortcuts: Ctrl/Cmd+K search · Ctrl/Cmd+N add · Ctrl/Cmd+Z undo delete
          </p>
        </div>
        <div className="hdr-actions">
          <button className="btn" onClick={exportCSV} title="Export filtered transactions to CSV">⬇ Export CSV</button>
          <button 
            className="btn btn-ghost btn-sm" 
            onClick={handleResetFilters}
            title="Reset all filters"
            aria-label="Reset filters"
          >Reset Filters</button>
          {isAdmin && (
            <button 
              className="btn btn-gold" 
              onClick={() => setModal({ open:true, data:null })}
              title="Add new transaction (Cmd+N)"
            >
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      {!isAdmin && (
        <div className="notice">
          🔒 <strong>Viewer mode</strong> — Editing and adding transactions requires Admin access.
        </div>
      )}

      <div className="table-card">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="search-box">
            <span style={{ color:'var(--text-dim)', fontSize:13 }}>🔍</span>
            <input
              ref={searchInputRef}
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Search by name or category… (Cmd+K)"
              aria-label="Search transactions"
            />
            {localSearch && (
              <button 
                style={{ background:'none',border:'none',color:'var(--text-dim)',cursor:'pointer',fontSize:14 }}
                onClick={() => setLocalSearch('')}
                aria-label="Clear search"
              >✕</button>
            )}
          </div>

          <select 
            className="sel" 
            value={filters.type} 
            onChange={e => setType(e.target.value)}
            aria-label="Filter by transaction type"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select 
            className="sel" 
            value={filters.category} 
            onChange={e => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>

          <select 
            className="sel" 
            value={`${filters.sortBy}|${filters.sortDir}`}
            onChange={e => {
              const [sortBy, sortDir] = e.target.value.split('|');
              setSort(sortBy, sortDir);
            }}
            aria-label="Sort transactions"
          >
            <option value="date|desc">Date ↓</option>
            <option value="date|asc">Date ↑</option>
            <option value="amount|desc">Amount ↓</option>
            <option value="amount|asc">Amount ↑</option>
          </select>
        </div>

        {/* Table */}
        {paginated.items.length === 0 ? (
          <div className="empty-state">
            <div className="ei">📭</div>
            <p>No transactions found. Try changing your filters.</p>
          </div>
        ) : (
          <table aria-label="Transactions table">
            <caption className="sr-only">Transactions list with sort, filter, and actions</caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  aria-sort={filters.sortBy === 'date' ? (filters.sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <button
                    type="button"
                    className="sort-btn"
                    onClick={() => toggleSort('date')}
                    aria-label={`Sort by date ${filters.sortBy === 'date' && filters.sortDir === 'asc' ? 'descending' : 'ascending'}`}
                  >
                    Date {filters.sortBy === 'date' && (filters.sortDir === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th scope="col">Description</th>
                <th scope="col">Category</th>
                <th scope="col">Type</th>
                <th
                  scope="col"
                  aria-sort={filters.sortBy === 'amount' ? (filters.sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <button
                    type="button"
                    className="sort-btn"
                    onClick={() => toggleSort('amount')}
                    aria-label={`Sort by amount ${filters.sortBy === 'amount' && filters.sortDir === 'asc' ? 'descending' : 'ascending'}`}
                  >
                    Amount {filters.sortBy === 'amount' && (filters.sortDir === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                {isAdmin && <th scope="col">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.items.map(t => (
                <tr key={t.id}>
                  <td style={{ color:'var(--text-muted)', fontSize:12 }}>{fmtDate(t.date)}</td>
                  <td style={{ fontWeight:500 }}>{t.description}</td>
                  <td><span className="cat-tag">{t.category}</span></td>
                  <td>
                    <span className={`type-chip ${t.type}`}>
                      {t.type === 'income' ? '▲' : '▼'} {t.type.charAt(0).toUpperCase()+t.type.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className={`amt-cell ${t.type}`}>
                      {t.type === 'expense' ? '−' : '+'}{fmt(t.amount)}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button 
                          className="btn btn-sm btn-icon" 
                          title="Edit"
                          onClick={() => setModal({ open:true, data:t })}
                          aria-label={`Edit transaction: ${t.description}`}
                        >✏️</button>
                        <button 
                          className="btn btn-sm btn-icon btn-danger" 
                          title="Delete"
                          onClick={() => delete_(t.id)}
                          aria-label={`Delete transaction: ${t.description}`}
                        >🗑</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {paginated.pages > 1 && (
          <div className="pagination">
            <span>Showing {(paginated.page-1)*10+1}–{Math.min(paginated.page*10,paginated.total)} of {paginated.total}</span>
            <div className="page-btns">
              <button 
                className="pg-btn" 
                onClick={() => setPage(paginated.page-1)} 
                disabled={paginated.page===1}
                aria-label="Previous page"
              >‹</button>
              {visiblePages[0] > 1 && (
                <>
                  <button className="pg-btn" onClick={() => setPage(1)}>1</button>
                  {visiblePages[0] > 2 && <span className="pg-ellipsis">…</span>}
                </>
              )}
              {visiblePages.map((page) => (
                <button 
                  key={page} 
                  className={`pg-btn ${paginated.page===page?'active':''}`}
                  onClick={() => setPage(page)}
                  aria-current={paginated.page===page ? 'page' : undefined}
                >{page}</button>
              ))}
              {visiblePages[visiblePages.length - 1] < paginated.pages && (
                <>
                  {visiblePages[visiblePages.length - 1] < paginated.pages - 1 && <span className="pg-ellipsis">…</span>}
                  <button className="pg-btn" onClick={() => setPage(paginated.pages)}>{paginated.pages}</button>
                </>
              )}
              <button 
                className="pg-btn" 
                onClick={() => setPage(paginated.page+1)} 
                disabled={paginated.page===paginated.pages}
                aria-label="Next page"
              >›</button>
            </div>
          </div>
        )}
      </div>

      <TransactionModal
        open={modal.open}
        onClose={() => setModal({ open:false, data:null })}
        onSave={handleSave}
        initial={modal.data}
      />
    </div>
  );
}
