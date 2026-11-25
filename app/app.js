// RumahKas — router, views and tools. All rendering is client-side from
// window.RUMAH (data.js). No network requests. Your own entries (planner
// amounts, tracker rows, goal savings) are kept in this browser's
// localStorage only; the seeded example figures always load first.
(function () {
  var D = window.RUMAH;
  var view = document.getElementById('view');
  var COLORS = {
    housing: '#14532d', food: '#166534', transport: '#15803d', education: '#65a30d',
    utilities: '#ca8a04', health: '#d97706', leisure: '#92400e', savings: '#0e7490'
  };

  function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  var plan = load('rumahkas-plan', null) || (function () {
    var o = {}; D.PLAN.forEach(function (c) { o[c.key] = c.plan; }); return o;
  })();
  var income = load('rumahkas-income', D.INCOME.total);
  var txns = load('rumahkas-tx', null) || D.TRANSACTIONS.slice();
  var goals = load('rumahkas-goals', null) || D.GOALS.map(function (g) { return { name: g.name, target: g.target, saved: g.saved, note: g.note }; });

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function rp(n) { return 'Rp ' + Math.round(n).toLocaleString('id-ID'); }
  function catLabel(key) {
    var c = D.PLAN.find(function (x) { return x.key === key; });
    return c ? c.label : key;
  }
  function planTotal() { return Object.keys(plan).reduce(function (a, k) { return a + (+plan[k] || 0); }, 0); }
  function spendPlan() { return planTotal() - (+plan.savings || 0); }
  function savePlan() { store('rumahkas-plan', plan); store('rumahkas-income', income); }
  function saveTx() { store('rumahkas-tx', txns); }
  function saveGoals() { store('rumahkas-goals', goals); }

  function donut() {
    var cats = D.PLAN.filter(function (c) { return c.key !== 'savings'; });
    var total = cats.reduce(function (a, c) { return a + (+plan[c.key] || 0); }, 0);
    var r = 80, C = 2 * Math.PI * r, off = 0;
    var rings = cats.map(function (c) {
      var len = (+plan[c.key] || 0) / total * C;
      var el = '<circle cx="110" cy="110" r="' + r + '" fill="none" stroke="' + COLORS[c.key] +
        '" stroke-width="34" stroke-dasharray="' + len.toFixed(1) + ' ' + (C - len).toFixed(1) +
        '" stroke-dashoffset="' + (-off).toFixed(1) + '"/>';
      off += len;
      return el;
    }).join('');
    var legend = cats.map(function (c) {
      return '<span><i style="background:' + COLORS[c.key] + '"></i>' + esc(c.label) + ' ' + rp(plan[c.key]) + '</span>';
    }).join('');
    return '<div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap">' +
      '<svg width="220" height="220" viewBox="0 0 220 220" role="img" aria-label="Planned spending by category">' + rings +
      '<text x="110" y="104" font-size="24" font-weight="bold" fill="#14532d" text-anchor="middle" font-family="Arial">Rp 11.0m</text>' +
      '<text x="110" y="128" font-size="13" fill="#5f6b5a" text-anchor="middle" font-family="Arial">planned / month</text></svg>' +
      '<div class="legend" style="flex:1;min-width:220px">' + legend + '</div></div>';
  }
  function monthBars() {
    var W = 760, H = 250, PL = 58, PR = 10, PT = 16, PB = 30;
    var max = 12500000;
    function X(i) { return PL + i * (W - PL - PR) / 12 + 8; }
    function Y(v) { return PT + (max - v) * (H - PT - PB) / max; }
    var bw = (W - PL - PR) / 12 - 16;
    var grid = '';
    [0, 4000000, 8000000, 12000000].forEach(function (g) {
      grid += '<line x1="' + PL + '" y1="' + Y(g) + '" x2="' + (W - PR) + '" y2="' + Y(g) + '" stroke="#e9e7db" stroke-width="1"/>' +
        '<text x="' + (PL - 6) + '" y="' + (Y(g) + 4) + '" font-size="11.5" fill="#5f6b5a" text-anchor="end" font-family="Arial">Rp ' + (g / 1000000) + 'm</text>';
    });
    var bars = D.MONTHS.map(function (mo, i) {
      var over = mo.v > D.SPEND_BUDGET;
      return '<rect x="' + X(i) + '" y="' + Y(mo.v) + '" width="' + bw + '" height="' + (Y(0) - Y(mo.v)) +
        '" rx="3" fill="' + (over ? '#d97706' : '#166534') + '"' + (mo.planned ? ' opacity="0.45"' : '') + '/>' +
        '<text x="' + (X(i) + bw / 2) + '" y="' + (H - 8) + '" font-size="12" fill="#5f6b5a" text-anchor="middle" font-family="Arial">' + mo.m + '</text>';
    }).join('');
    var lineY = Y(D.SPEND_BUDGET);
    var budgetLine = '<line x1="' + PL + '" y1="' + lineY + '" x2="' + (W - PR) + '" y2="' + lineY +
      '" stroke="#b3261e" stroke-width="2" stroke-dasharray="6 4"/>' +
      '<text x="' + (W - PR) + '" y="' + (lineY - 6) + '" font-size="12" font-weight="bold" fill="#b3261e" text-anchor="end" font-family="Arial">Plan: Rp 11.0m</text>';
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Monthly spending, January to December 2026">' +
      grid + bars + budgetLine + '</svg>' +
      '<p class="note">Amber bars ran over the Rp 11.0m spending plan; December is planned, shown faded. Saving is separate: Rp 1.5m a month on top of this.</p>';
  }

  function vDashboard() {
    var rate = Math.round((+plan.savings || 0) / income * 100);
    var recent = txns.slice(0, 5).map(function (t) {
      return '<tr><td>' + esc(t.date) + '</td><td>' + esc(catLabel(t.cat)) + '</td><td>' + esc(t.desc) +
        '</td><td class="num">' + rp(t.amount) + '</td></tr>';
    }).join('');
    return '<p class="kicker">Keluarga Pratama · Jakarta · November 2026</p><h1>Your money, at a glance</h1>' +
      '<p class="lede">Two adults, two children, one salary plus a side income. This month\u2019s ' +
      'plan spends Rp 11.0m, saves Rp 1.5m — and the tracker shows where it actually went.</p>' +
      '<div class="grid"><div class="card kpi"><div class="num">' + rp(income) + '</div>' +
      '<div class="lbl">Monthly income (salary + side work)</div></div>' +
      '<div class="card kpi"><div class="num">' + rp(spendPlan()) + '</div>' +
      '<div class="lbl">Planned spending this month</div></div>' +
      '<div class="card kpi"><div class="num">' + rp(plan.savings) + '</div>' +
      '<div class="lbl">Planned saving this month</div><div class="sub good">Saving rate ' + rate + '% of income</div></div>' +
      '<div class="card kpi"><div class="num">' + rp(11520000) + '</div>' +
      '<div class="lbl">Actual spending, November so far</div><div class="sub warn">Rp 520,000 over the Rp 11.0m plan</div></div></div>' +
      '<div class="grid two"><div class="card"><h2>Where the plan goes</h2>' + donut() + '</div>' +
      '<div class="card"><h2>Spending by month, 2026</h2>' + monthBars() + '</div></div>' +
      '<div class="card"><h2>Recent spending</h2><table><thead><tr><th>Date</th><th>Category</th><th>What</th><th class="num">Amount</th></tr></thead>' +
      '<tbody>' + recent + '</tbody></table><p class="note"><a href="#/tracker">See every transaction &rarr;</a></p></div>';
  }
  function vPlanner() {
    var total = planTotal(), rest = income - total;
    var rate = Math.round((+plan.savings || 0) / income * 100);
    var rows = D.PLAN.map(function (c) {
      var pct = Math.round((+plan[c.key] || 0) / income * 100);
      return '<div class="plan-row"><div class="cat"><b>' + esc(c.label) + '</b><span>' + esc(c.note) + '</span></div>' +
        '<div><label for="in-' + c.key + '" style="position:absolute;left:-9999px">' + esc(c.label) + ' amount</label>' +
        '<input id="in-' + c.key + '" type="number" min="0" step="50000" value="' + (+plan[c.key] || 0) +
        '" data-cat="' + c.key + '" aria-label="' + esc(c.label) + ' amount in rupiah"></div>' +
        '<div class="pct" style="text-align:right;font-weight:700;color:#14532d">' + pct + '%</div></div>';
    }).join('');
    var status = rest === 0
      ? '<p class="good"><strong>Balanced.</strong> Every rupiah has a job.</p>'
      : rest > 0
        ? '<p class="warn"><strong>' + rp(rest) + ' unassigned.</strong> Give it a job — extra saving is the easy win.</p>'
        : '<p class="bad"><strong>Over budget by ' + rp(-rest) + '.</strong> Trim a category before the month starts.</p>';
    return '<p class="kicker">Planner</p><h1>Plan the month before it spends you</h1>' +
      '<p class="lede">Set each category, watch the total follow. The plan is yours: change a ' +
      'number and the balance, the saving rate and the dashboard update at once.</p>' +
      '<div class="card" style="margin-bottom:14px"><label for="in-income">Monthly income (Rp)</label>' +
      '<input id="in-income" type="number" min="0" step="100000" value="' + income + '" style="max-width:280px">' +
      '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">' +
      '<button data-preset="pratama" class="ghost">Pratama plan</button>' +
      '<button data-preset="fifty" class="ghost">Apply 50 / 30 / 20</button>' +
      '<button data-preset="reset" class="ghost">Reset my changes</button></div></div>' +
      '<div class="card">' + rows + '</div>' +
      '<div class="card" style="margin-top:14px"><h2>Balance</h2>' +
      '<p>Planned total <strong>' + rp(total) + '</strong> of ' + rp(income) + ' income · ' +
      'Saving <strong>' + rp(plan.savings) + ' (' + rate + '%)</strong></p>' + status +
      '<p class="note">Tip: keep saving at 20% if you can — the 50 / 30 / 20 preset sets needs to ' +
      'Rp 6.25m, wants to Rp 3.75m and saving to Rp 2.5m.</p></div>';
  }
  function vTracker() {
    var total = txns.reduce(function (a, t) { return a + t.amount; }, 0);
    var byCat = {};
    txns.forEach(function (t) { byCat[t.cat] = (byCat[t.cat] || 0) + t.amount; });
    var catLines = Object.keys(byCat).sort(function (a, b) { return byCat[b] - byCat[a]; }).map(function (k) {
      return '<span><i style="background:' + COLORS[k] + '"></i>' + esc(catLabel(k)) + ' ' + rp(byCat[k]) + '</span>';
    }).join('');
    var rows = txns.map(function (t, i) {
      return '<tr><td>' + esc(t.date) + '</td><td>' + esc(catLabel(t.cat)) + '</td><td>' + esc(t.desc) +
        '</td><td class="num">' + rp(t.amount) + '</td>' +
        '<td><button class="danger" data-del="' + i + '">Delete</button></td></tr>';
    }).join('');
    var opts = D.PLAN.filter(function (c) { return c.key !== 'savings'; }).map(function (c) {
      return '<option value="' + c.key + '">' + esc(c.label) + '</option>';
    }).join('');
    return '<p class="kicker">Tracker</p><h1>Every rupiah, written down</h1>' +
      '<p class="lede">Add what you spend as you spend it. The table and the category totals ' +
      'update at once — and stay in your browser for next time.</p>' +
      '<div class="card" style="margin-bottom:14px"><h2>Add an expense</h2><div class="form-grid">' +
      '<div><label for="f-date">Date</label><input id="f-date" type="date" value="2026-11-26"></div>' +
      '<div><label for="f-cat">Category</label><select id="f-cat">' + opts + '</select></div>' +
      '<div><label for="f-desc">What was it?</label><input id="f-desc" type="text" placeholder="e.g. Weekly groceries" maxlength="60"></div>' +
      '<div><label for="f-amt">Amount (Rp)</label><input id="f-amt" type="number" min="1000" step="1000" placeholder="150000"></div>' +
      '<div class="full"><button id="f-add">Add expense</button> <span class="note" id="f-msg"></span></div></div></div>' +
      '<div class="card"><h2>November 2026 — ' + txns.length + ' entries, ' + rp(total) + ' in all</h2>' +
      '<div class="legend" style="margin-bottom:10px">' + catLines + '</div>' +
      '<table><thead><tr><th>Date</th><th>Category</th><th>What</th><th class="num">Amount</th><th></th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>';
  }
  function vGoals() {
    var cards = goals.map(function (g, i) {
      var pct = Math.min(100, Math.round(g.saved / g.target * 100));
      var left = Math.max(0, g.target - g.saved);
      return '<div class="card"><h2>' + esc(g.name) + '</h2><p class="note">' + esc(g.note) + '</p>' +
        '<div class="goal-bar"><div class="goal-top"><span><strong>' + rp(g.saved) + '</strong> saved</span>' +
        '<span>of ' + rp(g.target) + ' · ' + pct + '%</span></div>' +
        '<div class="meter' + (pct >= 100 ? '' : '') + '" style="margin-top:6px"><span style="width:' + pct + '%"></span></div>' +
        '<p class="note">' + (left > 0 ? rp(left) + ' to go.' : 'Goal reached — well done!') + '</p></div>' +
        '<button class="small" data-add="' + i + '" data-amt="100000">+ Rp 100.000</button> ' +
        '<button class="small ghost" data-add="' + i + '" data-amt="500000">+ Rp 500.000</button></div>';
    }).join('');
    return '<p class="kicker">Goals</p><h1>Save for something real</h1>' +
      '<p class="lede">Three goals the Pratamas are working towards. Tap a button to add ' +
      'saving — the bars move at once and your progress is kept in your browser.</p>' +
      '<div class="grid three">' + cards + '</div>' +
      '<div class="card"><h2>Start a new goal</h2><div class="form-grid">' +
      '<div><label for="g-name">Goal name</label><input id="g-name" type="text" placeholder="e.g. New fridge" maxlength="40"></div>' +
      '<div><label for="g-target">Target (Rp)</label><input id="g-target" type="number" min="100000" step="100000" placeholder="5000000"></div>' +
      '<div class="full"><button id="g-add">Add goal</button> <span class="note" id="g-msg"></span></div></div></div>';
  }
  function vLearn() {
    var cards = D.TIPS.map(function (tip, i) {
      return '<div class="card"><div class="tip-num">' + (i + 1) + '</div><h2>' + esc(tip.t) + '</h2><p>' + esc(tip.b) + '</p></div>';
    }).join('');
    return '<p class="kicker">Learn</p><h1>Six habits that keep a budget working</h1>' +
      '<p class="lede">A budget is not a diet — it is a plan you can keep. These six habits are ' +
      'the ones that make the Pratama plan stick, month after month.</p>' +
      '<div class="grid two">' + cards + '</div>' +
      '<div class="card"><h2>The 50 / 30 / 20 rule, in rupiah</h2><p>On Rp 12,500,000 a month: ' +
      '<strong>Rp 6,250,000</strong> for needs (housing, food, transport, utilities, health), ' +
      '<strong>Rp 3,750,000</strong> for wants (leisure, schooling extras, eating out) and ' +
      '<strong>Rp 2,500,000</strong> for saving. Try it in the <a href="#/planner">Planner</a> — one tap applies it.</p></div>';
  }

  var ROUTES = { '': vDashboard, planner: vPlanner, tracker: vTracker, goals: vGoals, learn: vLearn };
  function route() {
    var r = (location.hash || '#/').replace(/^#\/?/, '').split('?')[0];
    return ROUTES[r] ? r : '';
  }
  function render() {
    var r = route();
    view.innerHTML = ROUTES[r]();
    document.querySelectorAll('.nav a').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-route') === r);
    });
    var inc = document.getElementById('in-income');
    if (inc) inc.addEventListener('input', function () { income = +inc.value || 0; savePlan(); render(); });
    view.querySelectorAll('[data-cat]').forEach(function (el) {
      el.addEventListener('input', function () { plan[el.getAttribute('data-cat')] = +el.value || 0; savePlan(); });
      el.addEventListener('change', function () { render(); });
    });
    view.querySelectorAll('[data-preset]').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = b.getAttribute('data-preset');
        if (p === 'fifty') {
          plan = { housing: 2500000, food: 2000000, transport: 800000, education: 1500000, utilities: 600000, health: 350000, leisure: 2250000, savings: 2500000 };
          income = 12500000;
        } else if (p === 'pratama') {
          plan = {}; D.PLAN.forEach(function (c) { plan[c.key] = c.plan; }); income = D.INCOME.total;
        } else {
          try { localStorage.removeItem('rumahkas-plan'); localStorage.removeItem('rumahkas-income'); } catch (e) {}
          plan = {}; D.PLAN.forEach(function (c) { plan[c.key] = c.plan; }); income = D.INCOME.total;
        }
        savePlan(); render();
      });
    });
    var add = document.getElementById('f-add');
    if (add) add.addEventListener('click', function () {
      var amt = +document.getElementById('f-amt').value;
      var desc = document.getElementById('f-desc').value.trim();
      var msg = document.getElementById('f-msg');
      if (!amt || amt <= 0) { msg.textContent = 'Enter an amount first.'; return; }
      if (!desc) { msg.textContent = 'Say what it was.'; return; }
      txns.unshift({ date: document.getElementById('f-date').value || '2026-11-26', cat: document.getElementById('f-cat').value, desc: desc, amount: amt });
      saveTx(); render();
    });
    view.querySelectorAll('[data-del]').forEach(function (b) {
      b.addEventListener('click', function () { txns.splice(+b.getAttribute('data-del'), 1); saveTx(); render(); });
    });
    view.querySelectorAll('[data-add]').forEach(function (b) {
      b.addEventListener('click', function () {
        var g = goals[+b.getAttribute('data-add')];
        g.saved = Math.min(g.target, g.saved + (+b.getAttribute('data-amt')));
        saveGoals(); render();
      });
    });
    var gadd = document.getElementById('g-add');
    if (gadd) gadd.addEventListener('click', function () {
      var name = document.getElementById('g-name').value.trim();
      var target = +document.getElementById('g-target').value;
      var msg = document.getElementById('g-msg');
      if (!name) { msg.textContent = 'Name the goal first.'; return; }
      if (!target || target <= 0) { msg.textContent = 'Set a target amount.'; return; }
      goals.push({ name: name, target: target, saved: 0, note: 'Added by you' });
      saveGoals(); render();
    });
  }
  window.addEventListener('hashchange', render);
  render();
})();
