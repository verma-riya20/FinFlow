export const CATEGORIES = [
  'Salary', 'Freelance', 'Investment Returns',
  'Food & Dining', 'Transport', 'Shopping',
  'Utilities', 'Healthcare', 'Entertainment',
  'Education', 'Rent', 'Other',
];

export const CATEGORY_ICONS = {
  'Salary': '💼',
  'Freelance': '🖥',
  'Investment Returns': '📈',
  'Food & Dining': '🍜',
  'Transport': '🚗',
  'Shopping': '🛍',
  'Utilities': '⚡',
  'Healthcare': '🏥',
  'Entertainment': '🎬',
  'Education': '📚',
  'Rent': '🏠',
  'Other': '📦',
};

export const CATEGORY_COLORS = {
  'Salary': '#22d3a0',
  'Freelance': '#34d399',
  'Investment Returns': '#4ade80',
  'Food & Dining': '#f59e0b',
  'Transport': '#3b82f6',
  'Shopping': '#ec4899',
  'Utilities': '#8b5cf6',
  'Healthcare': '#06b6d4',
  'Entertainment': '#f97316',
  'Education': '#a78bfa',
  'Rent': '#f43f5e',
  'Other': '#94a3b8',
};

let idCounter = 1;
const mkTx = (date, description, category, type, amount) => ({
  id: `tx-${idCounter++}`,
  date,
  description,
  category,
  type,
  amount,
});

export const SEED_TRANSACTIONS = [
  // November 2025
  mkTx('2025-11-01', 'Salary – November', 'Salary', 'income', 85000),
  mkTx('2025-11-02', 'Rent – November', 'Rent', 'expense', 20000),
  mkTx('2025-11-05', 'Grocery Shopping', 'Food & Dining', 'expense', 4200),
  mkTx('2025-11-08', 'Electricity Bill', 'Utilities', 'expense', 1850),
  mkTx('2025-11-10', 'Freelance – UI Design', 'Freelance', 'income', 18000),
  mkTx('2025-11-12', 'Amazon Shopping', 'Shopping', 'expense', 6300),
  mkTx('2025-11-14', 'Metro Card Recharge', 'Transport', 'expense', 500),
  mkTx('2025-11-18', 'Diwali Gifts', 'Shopping', 'expense', 8500),
  mkTx('2025-11-20', 'Doctor Visit', 'Healthcare', 'expense', 1200),
  mkTx('2025-11-22', 'Netflix + Spotify', 'Entertainment', 'expense', 768),
  mkTx('2025-11-25', 'Mutual Fund SIP', 'Investment Returns', 'expense', 10000),
  mkTx('2025-11-28', 'Restaurant Dinner', 'Food & Dining', 'expense', 2400),
  mkTx('2025-11-30', 'Uber Rides', 'Transport', 'expense', 1200),

  // December 2025
  mkTx('2025-12-01', 'Salary – December', 'Salary', 'income', 85000),
  mkTx('2025-12-01', 'Rent – December', 'Rent', 'expense', 20000),
  mkTx('2025-12-03', 'Year-end Bonus', 'Salary', 'income', 25000),
  mkTx('2025-12-05', 'Christmas Shopping', 'Shopping', 'expense', 12000),
  mkTx('2025-12-08', 'Zomato Orders', 'Food & Dining', 'expense', 3100),
  mkTx('2025-12-10', 'Freelance – App Dev', 'Freelance', 'income', 30000),
  mkTx('2025-12-12', 'Internet Bill', 'Utilities', 'expense', 999),
  mkTx('2025-12-15', 'Stock Dividend', 'Investment Returns', 'income', 5500),
  mkTx('2025-12-18', 'Online Course', 'Education', 'expense', 4999),
  mkTx('2025-12-20', 'New Year Trip Booking', 'Entertainment', 'expense', 15000),
  mkTx('2025-12-22', 'Water & Gas Bill', 'Utilities', 'expense', 1200),
  mkTx('2025-12-25', 'Gym Membership', 'Healthcare', 'expense', 2000),
  mkTx('2025-12-28', 'Car Fuel', 'Transport', 'expense', 3200),

  // January 2026
  mkTx('2026-01-01', 'Salary – January', 'Salary', 'income', 85000),
  mkTx('2026-01-01', 'Rent – January', 'Rent', 'expense', 20000),
  mkTx('2026-01-05', 'Freelance – Dashboard', 'Freelance', 'income', 22000),
  mkTx('2026-01-07', 'Grocery Run', 'Food & Dining', 'expense', 3800),
  mkTx('2026-01-10', 'New Year Shopping', 'Shopping', 'expense', 9200),
  mkTx('2026-01-12', 'Electricity Bill', 'Utilities', 'expense', 2100),
  mkTx('2026-01-15', 'Insurance Premium', 'Healthcare', 'expense', 6000),
  mkTx('2026-01-18', 'Book Purchase', 'Education', 'expense', 850),
  mkTx('2026-01-20', 'Mutual Fund SIP', 'Investment Returns', 'expense', 10000),
  mkTx('2026-01-22', 'Movie Tickets', 'Entertainment', 'expense', 1200),
  mkTx('2026-01-25', 'Swiggy Orders', 'Food & Dining', 'expense', 2700),
  mkTx('2026-01-28', 'Cab Rides', 'Transport', 'expense', 1800),

  // February 2026
  mkTx('2026-02-01', 'Salary – February', 'Salary', 'income', 85000),
  mkTx('2026-02-01', 'Rent – February', 'Rent', 'expense', 20000),
  mkTx('2026-02-03', 'Valentine Shopping', 'Shopping', 'expense', 4500),
  mkTx('2026-02-05', 'Freelance – Branding', 'Freelance', 'income', 15000),
  mkTx('2026-02-07', 'Grocery Shopping', 'Food & Dining', 'expense', 4100),
  mkTx('2026-02-10', 'Mobile Recharge', 'Utilities', 'expense', 599),
  mkTx('2026-02-12', 'Stock Dividend', 'Investment Returns', 'income', 8000),
  mkTx('2026-02-14', 'Restaurant – Valentine', 'Food & Dining', 'expense', 3800),
  mkTx('2026-02-18', 'Metro Pass', 'Transport', 'expense', 900),
  mkTx('2026-02-20', 'Mutual Fund SIP', 'Investment Returns', 'expense', 10000),
  mkTx('2026-02-22', 'Online Course – React', 'Education', 'expense', 2999),
  mkTx('2026-02-25', 'Gym Membership', 'Healthcare', 'expense', 2000),
  mkTx('2026-02-28', 'Streaming Services', 'Entertainment', 'expense', 649),

  // March 2026
  mkTx('2026-03-01', 'Salary – March', 'Salary', 'income', 85000),
  mkTx('2026-03-01', 'Rent – March', 'Rent', 'expense', 20000),
  mkTx('2026-03-04', 'Freelance – Website', 'Freelance', 'income', 28000),
  mkTx('2026-03-06', 'Grocery Run', 'Food & Dining', 'expense', 3600),
  mkTx('2026-03-09', 'Amazon Shopping', 'Shopping', 'expense', 7200),
  mkTx('2026-03-11', 'Electricity Bill', 'Utilities', 'expense', 1950),
  mkTx('2026-03-14', 'Doctor Visit', 'Healthcare', 'expense', 800),
  mkTx('2026-03-16', 'Book Club Purchase', 'Education', 'expense', 1200),
  mkTx('2026-03-18', 'Stock Sale Profit', 'Investment Returns', 'income', 12000),
  mkTx('2026-03-20', 'Mutual Fund SIP', 'Investment Returns', 'expense', 10000),
  mkTx('2026-03-22', 'Swiggy + Zomato', 'Food & Dining', 'expense', 2900),
  mkTx('2026-03-25', 'Concert Tickets', 'Entertainment', 'expense', 3500),
  mkTx('2026-03-28', 'Car Fuel', 'Transport', 'expense', 3000),

  // April 2026
  mkTx('2026-04-01', 'Salary – April', 'Salary', 'income', 85000),
  mkTx('2026-04-01', 'Rent – April', 'Rent', 'expense', 20000),
  mkTx('2026-04-02', 'Freelance – Mobile App', 'Freelance', 'income', 35000),
  mkTx('2026-04-03', 'Grocery Shopping', 'Food & Dining', 'expense', 4400),
  mkTx('2026-04-05', 'Internet + Mobile', 'Utilities', 'expense', 1598),
  mkTx('2026-04-07', 'Stock Dividend', 'Investment Returns', 'income', 6500),
  mkTx('2026-04-09', 'Shopping Haul', 'Shopping', 'expense', 5800),
  mkTx('2026-04-11', 'Doctor + Medicine', 'Healthcare', 'expense', 2400),
  mkTx('2026-04-14', 'OTT Subscriptions', 'Entertainment', 'expense', 1200),
  mkTx('2026-04-16', 'Udemy Course', 'Education', 'expense', 3499),
  mkTx('2026-04-18', 'Mutual Fund SIP', 'Investment Returns', 'expense', 10000),
  mkTx('2026-04-20', 'Restaurant Lunch', 'Food & Dining', 'expense', 1800),
  mkTx('2026-04-22', 'Cab Rides', 'Transport', 'expense', 2200),
];

export const DEFAULT_BUDGETS = {
  'Food & Dining': 8000,
  'Transport': 4000,
  'Shopping': 10000,
  'Utilities': 5000,
  'Healthcare': 5000,
  'Entertainment': 4000,
  'Education': 5000,
  'Rent': 20000,
  'Other': 3000,
};
