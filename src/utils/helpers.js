export const fmt = n =>
  '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });

export const fmtShort = n => {
  if (n >= 100000) return '₹' + (n / 100000).toFixed(1) + 'L';
  if (n >= 1000)   return '₹' + (n / 1000).toFixed(1) + 'K';
  return '₹' + n;
};

export const fmtDate = s =>
  new Date(s + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: '2-digit',
  });

export const fmtMonthKey = key => {
  const [y, m] = key.split('-');
  return new Date(+y, +m - 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
};

export const genId = () => `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
