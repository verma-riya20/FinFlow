import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectSummary } from '../../store/slices/transactionsSlice';
import { selectRole } from '../../store/slices/uiSlice';
import { fmt, fmtShort } from '../../utils/helpers';
import { TrendChart, IncomeExpenseBar, SpendingDonut } from './Charts';

function StatCard({ label, value, sub, subGood, color, icon }) {
  return (
    <div className={`stat-card c-${color}`}>
      <div className="stat-glow" />
      <div className="stat-top">
        <div className="stat-label">{label}</div>
        <div className="stat-icon-wrap">{icon}</div>
      </div>
      <div className="stat-val">{value}</div>
      <div className="stat-sub">
        <span className={subGood === null ? '' : subGood ? 'up' : 'down'}>
          {subGood !== null && (subGood ? '▲' : '▼')} {sub}
        </span>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  sub: PropTypes.string.isRequired,
  subGood: PropTypes.bool,
  color: PropTypes.oneOf(['gold', 'green', 'red', 'blue']).isRequired,
  icon: PropTypes.string.isRequired,
};

export default function Dashboard() {
  const [months, setMonths] = useState(6);
  const summary = useSelector(s => selectSummary(s, months));
  const role    = useSelector(selectRole);
  const isAdmin = role === 'admin';

  const { income, expense, balance, savingsRate, monthlyBreakdown, categoryBreakdown } = summary;

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="sec-hdr">
        <div>
          <h2>Overview</h2>
          <p style={{ display:'flex', alignItems:'center', gap:8 }}>
            Your financial summary ·&nbsp;
            <span className={`badge badge-${isAdmin?'admin':'viewer'}`}>
              {isAdmin ? '⚙ Admin' : '👁 Viewer'}
            </span>
          </p>
        </div>
        <div className="hdr-actions">
          <div className="period-toggle">
            {[3,6,12].map(m => (
              <button key={m} className={`period-btn ${months===m?'active':''}`} onClick={() => setMonths(m)}>
                {m}M
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <StatCard label="Total Balance"  value={fmt(balance)}  icon="💰" color="gold"
          sub={balance >= 0 ? 'Positive balance' : 'Negative balance'}
          subGood={balance >= 0} />
        <StatCard label="Total Income"   value={fmt(income)}   icon="📈" color="green"
          sub={`${months}M period`} subGood={null} />
        <StatCard label="Total Expenses" value={fmt(expense)}  icon="📉" color="red"
          sub={`${months}M period`} subGood={null} />
        <StatCard label="Savings Rate"   value={`${savingsRate}%`} icon="🎯" color="blue"
          sub={savingsRate >= 20 ? '✓ Healthy (>20%)' : '⚠ Below 20% target'}
          subGood={savingsRate >= 20} />
      </div>

      {/* Row 1 — Trend + Donut */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-hdr">
            <div>
              <div className="chart-title">Balance Trend</div>
              <div className="chart-sub">Net balance over {months} months</div>
            </div>
          </div>
          <TrendChart monthlyBreakdown={monthlyBreakdown} />
        </div>
        <div className="chart-card">
          <div className="chart-hdr">
            <div>
              <div className="chart-title">Spending Breakdown</div>
              <div className="chart-sub">Expenses by category</div>
            </div>
          </div>
          <SpendingDonut categoryBreakdown={categoryBreakdown} />
        </div>
      </div>

      {/* Row 2 — Income vs Expense bar */}
      <div className="chart-card chart-card-full">
        <div className="chart-hdr">
          <div>
            <div className="chart-title">Income vs Expenses</div>
            <div className="chart-sub">Monthly comparison — {months} months</div>
          </div>
        </div>
        <IncomeExpenseBar monthlyBreakdown={monthlyBreakdown} />
      </div>
    </div>
  );
}
