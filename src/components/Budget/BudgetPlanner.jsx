import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { selectRole } from '../../store/slices/uiSlice';
import { fmt, clamp } from '../../utils/helpers';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../data/transactions';
import { useBudgetSummary } from '../../hooks/useBudgetSummary';

// ── SVG Donut Gauge ───────────────────────────────────────────────────────
function DonutGauge({ pct, color }) {
  const r    = 26;
  const circ = 2 * Math.PI * r;
  const clamped = clamp(pct, 0, 100);
  const offset  = circ - (clamped / 100) * circ;

  const gaugeColor = clamped >= 100 ? 'var(--red)' : clamped >= 80 ? 'var(--gold)' : color || 'var(--green)';
  const label      = clamped >= 100 ? 'OVER' : `${Math.round(clamped)}%`;

  return (
    <div className="gauge-wrap">
      <svg className="gauge-svg" width="64" height="64" viewBox="0 0 64 64">
        <circle className="gauge-track" cx="32" cy="32" r={r} />
        <circle
          className="gauge-fill"
          cx="32" cy="32" r={r}
          stroke={gaugeColor}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-label" style={{ color: gaugeColor, fontSize: clamped >= 100 ? 9 : 11 }}>
        {label}
      </div>
    </div>
  );
}

DonutGauge.propTypes = {
  pct: PropTypes.number.isRequired,
  color: PropTypes.string,
};

// ── Budget Card ───────────────────────────────────────────────────────────
const BudgetCard = React.memo(function BudgetCard({ category, budget, spent, isAdmin, onChange }) {
  const pct        = budget > 0 ? (spent / budget) * 100 : 0;
  const color      = CATEGORY_COLORS[category] || 'var(--green)';
  const remaining  = budget - spent;
  const overBudget = spent > budget;

  const sliderBg = `linear-gradient(90deg, var(--gold) ${clamp((budget/100000)*100,0,100)}%, var(--bg5) 0%)`;

  return (
    <div className="budget-card" style={{ borderColor: overBudget ? 'rgba(255,92,124,.3)' : undefined }}>
      {/* Top row */}
      <div className="budget-card-top">
        <div className="budget-cat">
          <span className="budget-cat-icon">{CATEGORY_ICONS[category] || '📦'}</span>
          <span className="budget-cat-name">{category}</span>
        </div>
        <DonutGauge pct={pct} color={color} />
      </div>

      {/* Amounts */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4 }}>
          <span className="budget-spent">{fmt(spent)}</span>
          <span className="budget-limit">/ {fmt(budget)}</span>
        </div>
        <div style={{ fontSize:12, color: overBudget ? 'var(--red)' : 'var(--text-muted)' }}>
          {overBudget
            ? `⚠ Over by ${fmt(Math.abs(remaining))}`
            : `${fmt(remaining)} remaining`}
        </div>
      </div>

      {/* Spend progress bar */}
      <div className="budget-status-bar" style={{ marginTop:10 }}>
        <div className="budget-status-fill" style={{
          width: `${clamp(pct, 0, 100)}%`,
          background: overBudget ? 'var(--red)' : pct > 80 ? 'var(--gold)' : color,
        }} />
      </div>

      {/* Drag slider — Admin only */}
      {isAdmin && (
        <div className="budget-slider-wrap">
          <div className="budget-slider-lbl">
            <span>Set budget limit</span>
            <span style={{ color:'var(--gold)', fontWeight:700 }}>{fmt(budget)}</span>
          </div>
          <input
            type="range"
            className="budget-slider"
            min={1000}
            max={100000}
            step={500}
            value={budget}
            onChange={e => onChange(parseInt(e.target.value))}
            style={{ background: sliderBg }}
          />
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'var(--text-dim)', marginTop:3 }}>
            <span>₹1K</span><span>₹1L</span>
          </div>
        </div>
      )}
    </div>
  );
});

BudgetCard.propTypes = {
  category: PropTypes.string.isRequired,
  budget: PropTypes.number.isRequired,
  spent: PropTypes.number.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

// ── Budget Planner Page ───────────────────────────────────────────────────




export default function BudgetPlanner() {
  const role = useSelector(selectRole);
  const isAdmin = role === 'admin';
  const {
    budgets,
    categories,
    totalBudget,
    totalSpent,
    remaining,
    overallPct,
    overCount,
    onTrackCount,
    setBudgetAmount,
    resetAll,
    getSpent,
  } = useBudgetSummary();
  const handleChange = (category, amount) => {
    setBudgetAmount(category, amount);
  };

  const handleReset = () => {
    resetAll();
  };

  return (
    <div className="page-enter">
      <div className="sec-hdr">
        <div>
          <h2>Budget Planner</h2>
          <p>
            {isAdmin
              ? 'Drag sliders to set monthly limits · Live burn-rate tracking'
              : 'View your monthly budget allocations and spending'}
          </p>
        </div>
        <div className="hdr-actions">
          {isAdmin && (
            <button className="btn btn-ghost btn-sm" onClick={handleReset}>↺ Reset Defaults</button>
          )}
        </div>
      </div>

      {/* Hero summary */}
      <div className="budget-hero">
        <div style={{ flex:1 }}>
          <div className="budget-hero-text">
            <h3>
              {overallPct >= 100 ? '🚨 Over Budget!' : overallPct >= 80 ? '⚠️ Approaching Limits' : '✅ On Track'}
            </h3>
            <p>
              This month you've spent <strong>{fmt(totalSpent)}</strong> of your <strong>{fmt(totalBudget)}</strong> total budget.
              {overCount > 0 ? ` ${overCount} categor${overCount>1?'ies':'y'} over limit.` : ' All categories within limits.'}
            </p>
          </div>
          <div className="budget-summary">
            <div className="budget-sum-item">
              <div className="budget-sum-val" style={{ color:'var(--green)' }}>{onTrackCount}</div>
              <div className="budget-sum-lbl">On Track</div>
            </div>
            <div className="budget-sum-item">
              <div className="budget-sum-val" style={{ color: overCount > 0 ? 'var(--red)' : 'var(--text-muted)' }}>{overCount}</div>
              <div className="budget-sum-lbl">Over Limit</div>
            </div>
            <div className="budget-sum-item">
              <div className="budget-sum-val" style={{ color:'var(--gold)' }}>{overallPct}%</div>
              <div className="budget-sum-lbl">Overall Used</div>
            </div>
            <div className="budget-sum-item">
              <div className="budget-sum-val">{fmt(totalBudget - totalSpent)}</div>
              <div className="budget-sum-lbl">Remaining</div>
            </div>
          </div>
        </div>

        {/* Big gauge */}
        <div style={{ position:'relative' }}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform:'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg4)" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="50" fill="none"
              stroke={overallPct >= 100 ? 'var(--red)' : overallPct >= 80 ? 'var(--gold)' : 'var(--green)'}
              strokeWidth="10" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 50}
              strokeDashoffset={2 * Math.PI * 50 * (1 - clamp(overallPct, 0, 100) / 100)}
              style={{ transition:'stroke-dashoffset .8s cubic-bezier(.4,0,.2,1), stroke .3s' }}
            />
          </svg>
          <div style={{
            position:'absolute', inset:0, display:'grid', placeItems:'center',
            fontFamily:'Clash Display,sans-serif', fontWeight:700,
          }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:26 }}>{overallPct}%</div>
              <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>used</div>
            </div>
          </div>
        </div>
      </div>

      {!isAdmin && (
        <div className="notice">
          🔒 <strong>Viewer mode</strong> — Budget adjustment is available to Admins only.
        </div>
      )}

      {/* Category cards */}
      <div className="budget-grid">
        {categories.map(cat => (
          <BudgetCard
            key={cat}
            category={cat}
            budget={budgets[cat] || 0}
            spent={getSpent(cat)}
            isAdmin={isAdmin}
            onChange={amount => handleChange(cat, amount)}
          />
        ))}
      </div>
    </div>
  );
}
