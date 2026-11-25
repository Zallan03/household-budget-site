// RumahKas — household data. The Pratama family (Jakarta, 2 adults + 2 children)
// is a worked example: income Rp 12,500,000 a month, and the plan below
// spends it all, including Rp 1,500,000 of saving. All figures in rupiah.
window.RUMAH = (function () {
  var INCOME = {
    salary: 10000000,
    side: 2500000,
    total: 12500000
  };

  // Monthly plan: category, planned amount, short note.
  var PLAN = [
    { key: 'housing', label: 'Housing', plan: 3500000, note: 'Rent + building fees' },
    { key: 'food', label: 'Food & groceries', plan: 2800000, note: 'Market, cooking, school lunches' },
    { key: 'transport', label: 'Transport', plan: 1200000, note: 'Fuel, tolls, bus & ride-hailing' },
    { key: 'education', label: 'Education', plan: 1500000, note: 'School fees + courses' },
    { key: 'utilities', label: 'Utilities', plan: 800000, note: 'Electricity, water, internet' },
    { key: 'health', label: 'Health', plan: 500000, note: 'Clinic, medicines, insurance' },
    { key: 'leisure', label: 'Leisure', plan: 700000, note: 'Eating out, films, weekends' },
    { key: 'savings', label: 'Savings', plan: 1500000, note: 'Pay yourself first' }
  ];

  // Actual spending (excluding savings) per month, Jan-Nov 2026 + Dec planned.
  // The plan for spending is Rp 11,000,000 a month (income minus savings).
  var MONTHS = [
    { m: 'Jan', v: 10850000 }, { m: 'Feb', v: 10420000 }, { m: 'Mar', v: 11300000 },
    { m: 'Apr', v: 10980000 }, { m: 'May', v: 11150000 }, { m: 'Jun', v: 11620000 },
    { m: 'Jul', v: 11050000 }, { m: 'Aug', v: 10760000 }, { m: 'Sep', v: 11400000 },
    { m: 'Oct', v: 11080000 }, { m: 'Nov', v: 11520000 }, { m: 'Dec', v: 11000000, planned: true }
  ];
  var SPEND_BUDGET = 11000000;

  // Recent transactions, November 2026 (seed data; the Tracker adds more).
  var TRANSACTIONS = [
    { date: '2026-11-24', cat: 'food', desc: 'Weekly groceries — market', amount: 486000 },
    { date: '2026-11-23', cat: 'utilities', desc: 'Electricity token', amount: 412000 },
    { date: '2026-11-22', cat: 'education', desc: 'School fees, term 2', amount: 750000 },
    { date: '2026-11-21', cat: 'transport', desc: 'Fuel', amount: 300000 },
    { date: '2026-11-20', cat: 'leisure', desc: 'Family dinner out', amount: 185000 },
    { date: '2026-11-19', cat: 'utilities', desc: 'Internet bill', amount: 350000 },
    { date: '2026-11-18', cat: 'health', desc: 'Pharmacy', amount: 120000 },
    { date: '2026-11-17', cat: 'food', desc: 'Vegetables & fruit', amount: 265000 }
  ];

  var GOALS = [
    { name: 'Emergency fund', target: 30000000, saved: 18600000, note: '6 months of essentials' },
    { name: 'Umrah for two', target: 45000000, saved: 14000000, note: 'Travel + costs, 2028' },
    { name: 'New motorcycle', target: 22000000, saved: 9900000, note: 'Replace the 2016 bike' }
  ];

  var TIPS = [
    { t: 'Pay yourself first', b: 'Move savings out on payday, before any spending. What stays in the account is what you may spend — not the other way round.' },
    { t: 'Use the 50 / 30 / 20 rule', b: 'Aim for about 50% needs, 30% wants and 20% saving. The Pratama plan runs about 70% needs, 18% wants-and-schooling and 12% saving — heavier on needs than the rule, which is normal for a family of four in Jakarta. The preset in the Planner shows the 50 / 30 / 20 shape.' },
    { t: 'Track every rupiah for 30 days', b: 'Write down each expense, however small. Most families find Rp 500,000–1,000,000 a month they did not know they spent.' },
    { t: 'Plan meals, shop once', b: 'A weekly menu and one market trip cut food waste and impulse buys. The Pratamas spend Rp 2.8m a month feeding four this way.' },
    { t: 'Keep 6 months of essentials', b: 'An emergency fund of six months of essential spending means a lost job or a hospital bill does not become debt.' },
    { t: 'Review subscriptions monthly', b: 'Streaming, apps and memberships creep up. Cancel one you have not used in a month and bank the saving.' }
  ];

  return {
    INCOME: INCOME, PLAN: PLAN, MONTHS: MONTHS, SPEND_BUDGET: SPEND_BUDGET,
    TRANSACTIONS: TRANSACTIONS, GOALS: GOALS, TIPS: TIPS
  };
})();
