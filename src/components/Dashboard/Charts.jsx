import React from 'react';
import PropTypes from 'prop-types';
import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { fmtShort, fmtMonthKey, fmt } from '../../utils/helpers';
import { CATEGORY_COLORS } from '../../data/transactions';

const TT_STYLE = {
  contentStyle: {
    background: 'var(--bg2)',
    border: '1px solid var(--border2)',
    borderRadius: 10,
    fontSize: 13,
    fontFamily: 'Satoshi, sans-serif',
    boxShadow: '0 8px 32px rgba(0,0,0,.4)',
  },
  labelStyle: { color: 'var(--text-muted)', marginBottom: 4, fontSize: 11 },
};

export const TrendChart = React.memo(function TrendChart({ monthlyBreakdown }) {
  const data = Object.entries(monthlyBreakdown || {}).map(([key, val]) => ({
    name:    fmtMonthKey(key),
    Balance: val.income - val.expense,
  }));
  return (
    <ResponsiveContainer width="100%" height={230}>
      <AreaChart data={data} margin={{ top:5,right:5,left:0,bottom:0 }}>
        <defs>
          <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f0a500" stopOpacity={0.32}/>
            <stop offset="100%" stopColor="#f0a500" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
        <XAxis dataKey="name" tick={{fill:'var(--text-muted)',fontSize:11}} axisLine={false} tickLine={false}/>
        <YAxis tickFormatter={fmtShort} tick={{fill:'var(--text-muted)',fontSize:11}} axisLine={false} tickLine={false} width={58}/>
        <Tooltip {...TT_STYLE} formatter={(v,n)=>[fmt(v),n]}/>
        <Area type="monotone" dataKey="Balance" stroke="#f0a500" strokeWidth={2.5}
          fill="url(#gradBalance)" dot={{fill:'#f0a500',r:4,strokeWidth:0}}
          activeDot={{r:6,fill:'#fbbf24'}}/>
      </AreaChart>
    </ResponsiveContainer>
  );
});

export const IncomeExpenseBar = React.memo(function IncomeExpenseBar({ monthlyBreakdown }) {
  const data = Object.entries(monthlyBreakdown || {}).map(([key, val]) => ({
    name: fmtMonthKey(key), Income: val.income, Expense: val.expense,
  }));
  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart data={data} margin={{top:5,right:5,left:0,bottom:0}} barCategoryGap="32%">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false}/>
        <XAxis dataKey="name" tick={{fill:'var(--text-muted)',fontSize:11}} axisLine={false} tickLine={false}/>
        <YAxis tickFormatter={fmtShort} tick={{fill:'var(--text-muted)',fontSize:11}} axisLine={false} tickLine={false} width={58}/>
        <Tooltip {...TT_STYLE} formatter={(v,n)=>[fmt(v),n]}/>
        <Legend wrapperStyle={{fontSize:12,color:'var(--text-muted)',paddingTop:12}} iconType="circle" iconSize={8}/>
        <Bar dataKey="Income"  fill="#10d9a0" radius={[5,5,0,0]}/>
        <Bar dataKey="Expense" fill="#ff5c7c" radius={[5,5,0,0]}/>
      </BarChart>
    </ResponsiveContainer>
  );
});

const RADIAN = Math.PI / 180;
function PctLabel({cx,cy,midAngle,innerRadius,outerRadius,percent}) {
  if (percent < 0.055) return null;
  const r = innerRadius + (outerRadius-innerRadius)*0.5;
  const x = cx + r*Math.cos(-midAngle*RADIAN);
  const y = cy + r*Math.sin(-midAngle*RADIAN);
  return <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>{`${(percent*100).toFixed(0)}%`}</text>;
}

export const SpendingDonut = React.memo(function SpendingDonut({ categoryBreakdown }) {
  const data = Object.entries(categoryBreakdown||{}).map(([name,value])=>({name,value}))
    .sort((a,b)=>b.value-a.value).slice(0,8);
  if (!data.length) return <div className="empty-state"><div className="ei">📊</div><p>No expense data yet</p></div>;
  return (
    <div style={{display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
      <div style={{flexShrink:0}}>
        <PieChart width={200} height={200}>
          <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={54} outerRadius={94} labelLine={false} label={<PctLabel/>}>
            {data.map((item,i)=><Cell key={i} fill={CATEGORY_COLORS[item.name]||`hsl(${i*37},65%,55%)`} stroke="none"/>)}
          </Pie>
          <Tooltip {...TT_STYLE} formatter={v=>[fmt(v),'Spent']}/>
        </PieChart>
      </div>
      <div style={{flex:1,minWidth:110}}>
        {data.map((item,i)=>(
          <div key={item.name} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <div style={{width:8,height:8,borderRadius:'50%',background:CATEGORY_COLORS[item.name]||`hsl(${i*37},65%,55%)`,flexShrink:0}}/>
            <span style={{fontSize:12,color:'var(--text-muted)',flex:1}}>{item.name}</span>
            <span style={{fontSize:12,fontWeight:700,fontFamily:'Clash Display,sans-serif'}}>{fmtShort(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

export const CategoryHorizBar = React.memo(function CategoryHorizBar({ data }) {
  const sorted = [...(data||[])].sort((a,b)=>b.amount-a.amount).slice(0,8);
  return (
    <ResponsiveContainer width="100%" height={270}>
      <BarChart layout="vertical" data={sorted} margin={{top:0,right:20,left:10,bottom:0}}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false}/>
        <XAxis type="number" tickFormatter={fmtShort} tick={{fill:'var(--text-muted)',fontSize:11}} axisLine={false} tickLine={false}/>
        <YAxis type="category" dataKey="name" width={100} tick={{fill:'var(--text-muted)',fontSize:12}} axisLine={false} tickLine={false}/>
        <Tooltip {...TT_STYLE} formatter={v=>[fmt(v),'Spent']} cursor={{fill:'rgba(255,255,255,.04)'}}/>
        <Bar dataKey="amount" radius={[0,6,6,0]} barSize={17}>
          {sorted.map((item,i)=><Cell key={i} fill={CATEGORY_COLORS[item.name]||`hsl(${i*37},65%,55%)`}/>)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
});

// PropTypes
TrendChart.propTypes = {
  monthlyBreakdown: PropTypes.object.isRequired,
};

IncomeExpenseBar.propTypes = {
  monthlyBreakdown: PropTypes.object.isRequired,
};

SpendingDonut.propTypes = {
  categoryBreakdown: PropTypes.object.isRequired,
};

CategoryHorizBar.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  })),
};
