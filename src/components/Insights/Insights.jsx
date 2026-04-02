import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectInsights } from '../../store/slices/transactionsSlice';
import { selectRole } from '../../store/slices/uiSlice';
import { fmt, fmtShort } from '../../utils/helpers';
import { CategoryHorizBar } from '../Dashboard/Charts';

function InsightCard({ icon, bg, label, value, desc }) {
  return (
    <div className="insight-card">
      <div className="insight-icon" style={{ background: bg }}>{icon}</div>
      <div>
        <div className="insight-lbl">{label}</div>
        <div className="insight-val">{value}</div>
        {desc && <div className="insight-desc">{desc}</div>}
      </div>
    </div>
  );
}

InsightCard.propTypes = {
  icon: PropTypes.string.isRequired,
  bg: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  desc: PropTypes.string,
};

export default function Insights() {
  const data   = useSelector(selectInsights);
  const role   = useSelector(selectRole);
  const isAdmin = role === 'admin';

  const expDiff  = data.thisMonthExpense - data.lastMonthExpense;
  const incDiff  = data.thisMonthIncome  - data.lastMonthIncome;
  const expGood  = expDiff <= 0;
  const maxExp   = data.maxMonthlyExpense || 1;

  const peakMonth = data.monthlyTrend.reduce((a,b) => b.expense > a.expense ? b : a, data.monthlyTrend[0] || {});

  const cards = [
    { icon:'🏆', bg:'rgba(240,165,0,.14)',   label:'Top Spending Category',
      value: data.topCategory?.name || '—',
      desc: data.topCategory ? `${fmt(data.topCategory.amount)} total spent` : '' },
    { icon: expGood?'✅':'⚠️', bg: expGood?'rgba(16,217,160,.12)':'rgba(255,92,124,.12)',
      label:'Expense vs Last Month',
      value: (expDiff >= 0 ? '+' : '') + fmt(expDiff),
      desc: `This month: ${fmt(data.thisMonthExpense)}` },
    { icon: incDiff >= 0 ? '📈' : '📉', bg: incDiff >= 0 ? 'rgba(16,217,160,.12)' : 'rgba(255,92,124,.12)',
      label:'Income vs Last Month',
      value: (incDiff >= 0 ? '+' : '') + fmt(incDiff),
      desc: `This month: ${fmt(data.thisMonthIncome)}` },
    { icon:'📊', bg:'rgba(77,159,255,.12)',   label:'Avg Monthly Expense',
      value: fmt(data.avgMonthlyExpense),  desc:'Across all tracked months' },
    { icon:'💎', bg:'rgba(185,127,255,.12)', label:'Net Savings (All Time)',
      value: fmt(data.netSavings), desc: data.netSavings >= 0 ? 'Great discipline!' : 'Review spending' },
    { icon:'🔥', bg:'rgba(255,92,124,.12)',   label:'Peak Monthly Spend',
      value: fmtShort(peakMonth?.expense || 0), desc:'Highest recorded month' },
  ];

  return (
    <div className="page-enter">
      <div className="sec-hdr">
        <div>
          <h2>Insights</h2>
          <p style={{ display:'flex', alignItems:'center', gap:8 }}>
            Spending patterns & analysis ·&nbsp;
            <span className={`badge badge-${isAdmin?'admin':'viewer'}`}>
              {isAdmin ? '⚙ Admin' : '👁 Viewer'}
            </span>
          </p>
        </div>
      </div>

      <div className="insights-grid">
        {cards.map((c,i) => <InsightCard key={i} {...c} />)}
      </div>

      {/* Monthly bar */}
      <div className="month-bar-card">
        <h3>📅 Monthly Spending — Last 6 Months</h3>
        {data.monthlyTrend.map((m, i) => {
          const pct   = Math.round((m.expense / maxExp) * 100);
          const color = pct > 75 ? 'var(--red)' : pct > 45 ? 'var(--gold)' : 'var(--green)';
          const lbl   = new Date(m.month + '-01').toLocaleDateString('en-IN', { month:'short' });
          return (
            <div key={i} className="mbar-row">
              <div className="mbar-lbl">{lbl}</div>
              <div className="mbar-bg">
                <div className="mbar-fill" style={{ width:`${pct}%`, background:color }} />
              </div>
              <div className="mbar-val" style={{ color }}>{fmtShort(m.expense)}</div>
            </div>
          );
        })}
      </div>

      {/* Horizontal category bar */}
      <div className="chart-card">
        <div className="chart-hdr">
          <div>
            <div className="chart-title">Top Spending Categories</div>
            <div className="chart-sub">All-time breakdown</div>
          </div>
        </div>
        <CategoryHorizBar data={data.categoryBreakdown} />
      </div>
    </div>
  );
}
