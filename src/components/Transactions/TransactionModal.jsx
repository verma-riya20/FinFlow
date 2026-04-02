import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CATEGORIES } from '../../data/transactions';
import { genId } from '../../utils/helpers';

const EMPTY = { description:'', amount:'', date:'', type:'expense', category:'Food & Dining' };

export default function TransactionModal({ open, onClose, onSave, initial }) {
  const [form, setForm]   = useState(EMPTY);
  const [errs, setErrs]   = useState({});
  const [busy, setBusy]   = useState(false);
  const descriptionInputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setForm(initial
      ? { ...initial, amount: String(initial.amount) }
      : { ...EMPTY, date: new Date().toISOString().slice(0,10) }
    );
    setErrs({});
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => descriptionInputRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, [open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !Object.keys(errs).length) {
      handleSave();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Required';
    if (!form.amount || +form.amount <= 0) e.amount = 'Must be > 0';
    if (!form.date) e.date = 'Required';
    setErrs(e);
    return !Object.keys(e).length;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setBusy(true);
    await new Promise(r => setTimeout(r, 180)); // micro UX pause
    const payload = {
      ...form,
      id: initial?.id || genId(),
      amount: parseFloat(form.amount),
    };
    onSave(payload);
    setBusy(false);
    onClose();
  };

  const isFormValid = form.description.trim() && form.amount && +form.amount > 0 && form.date;

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="transaction-modal-title" onKeyDown={handleKeyDown}>
        <div className="modal-hdr">
          <div className="modal-title" id="transaction-modal-title">{initial ? 'Edit Transaction' : 'New Transaction'}</div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="form-grid">
          <div className="form-group form-full">
            <label className="form-label">Description</label>
            <input 
              ref={descriptionInputRef}
              className={`form-input ${errs.description?'err':''}`}
              aria-label="Transaction description"
              aria-invalid={!!errs.description}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="e.g. Grocery shopping" />
            {errs.description && <span className="form-err">{errs.description}</span>}
            {!errs.description && form.description && <span style={{ fontSize: 11, color: 'var(--green)', marginTop: 2 }}>✓ Ready</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input 
              className={`form-input ${errs.amount?'err':''}`}
              aria-label="Transaction amount in rupees"
              aria-invalid={!!errs.amount}
              type="number" min="1" step="0.01"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="0.00" />
            {errs.amount && <span className="form-err">{errs.amount}</span>}
            {!errs.amount && form.amount && <span style={{ fontSize: 11, color: 'var(--green)', marginTop: 2 }}>✓ Valid amount</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input 
              className={`form-input ${errs.date?'err':''}`}
              aria-label="Transaction date"
              aria-invalid={!!errs.date}
              type="date" value={form.date}
              onChange={e => set('date', e.target.value)} />
            {errs.date && <span className="form-err">{errs.date}</span>}
            {!errs.date && form.date && <span style={{ fontSize: 11, color: 'var(--green)', marginTop: 2 }}>✓ Date set</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <select 
              className="form-input" 
              value={form.type} 
              onChange={e => set('type', e.target.value)}
              aria-label="Transaction type (income or expense)"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              className="form-input" 
              value={form.category} 
              onChange={e => set('category', e.target.value)}
              aria-label="Transaction category"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="modal-footer" style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 8, marginBottom: 12 }}>
          <span>Press <kbd>Enter</kbd> to submit, <kbd>Esc</kbd> to cancel</span>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose} disabled={busy}>Cancel</button>
          <button className="btn btn-gold" onClick={handleSave} disabled={busy || !isFormValid}>
            {busy ? '...' : initial ? 'Update' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}

TransactionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initial: PropTypes.shape({
    id: PropTypes.string,
    description: PropTypes.string,
    amount: PropTypes.number,
    date: PropTypes.string,
    type: PropTypes.string,
    category: PropTypes.string,
  }),
};
