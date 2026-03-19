const content = document.getElementById('reportContent');

function setTab(id) {
  document
    .querySelectorAll('.tab')
    .forEach((t) => t.classList.remove('active'));

  document.getElementById(id).classList.add('active');
}

/* SUMMARY */

async function showSummary() {
  setTab('tabSummary');

  const data = await api('/stats/summary');

  content.innerHTML = `

<div class="card">

<h2>Tổng quan</h2>

<p class="income">Tổng thu: ${data.totalIncome.toLocaleString()} đ</p>

<p class="expense">Tổng chi: ${data.totalExpense.toLocaleString()} đ</p>

<p><b>Số dư: ${data.balance.toLocaleString()} đ</b></p>

</div>

`;
}

/* MONTHLY */

let stats = [];
let currentMonth = new Date().getMonth() + 1;
let currentTab = 'income';

async function showMonthly() {
  setTab('tabMonthly');

  stats = await api('/stats/monthly');

  content.innerHTML = `

<div class="card">

<h2>Báo cáo theo tháng</h2>

<div class="header">
<button onclick="prevMonth()">← Tháng trước</button>
<h3 id="monthTitle"></h3>
<button onclick="nextMonth()">Tháng sau →</button>
</div>

<div id="summary"></div>

<div class="tabs">
<div id="tabIncome" class="tab active" onclick="showIncomeReport()">Thu</div>
<div id="tabExpense" class="tab" onclick="showExpenseReport()">Chi</div>
</div>

<div id="transactionList"></div>

</div>

`;

  renderMonthly();
}

function renderMonthly() {
  const month = stats.find((m) => m.month === currentMonth);

  document.getElementById('monthTitle').innerText = 'Tháng ' + currentMonth;

  if (!month) {
    document.getElementById('summary').innerHTML = '';
    document.getElementById('transactionList').innerHTML = 'Không có dữ liệu';
    return;
  }

  document.getElementById('summary').innerHTML = `
  
<span class="income">Thu: ${month.totalIncome.toLocaleString()} đ</span> |
<span class="expense">Chi: ${month.totalExpense.toLocaleString()} đ</span> |
<b>Số dư: ${month.balance.toLocaleString()} đ</b>

`;

  renderList();
}

function renderList() {
  const month = stats.find((m) => m.month === currentMonth);

  if (!month) return;

  let list =
    currentTab === 'income'
      ? month.incomeTransactions
      : month.expenseTransactions;
  // 🔥 DEBUG CHỖ NÀY
  console.log('transaction list:', list);

  let html = '';

  list.forEach((t) => {
    html += `

<div class="transaction"
onclick="editTransaction('${t._id || t.id}')"

<span>${t.name || 'Giao dịch'}</span>

<span class="${currentTab}">
${currentTab === 'income' ? '+' : '-'}
${t.amount.toLocaleString()} đ
</span>

</div>

`;
  });

  document.getElementById('transactionList').innerHTML =
    html || 'Không có giao dịch';
}

function showIncomeReport() {
  currentTab = 'income';

  document.getElementById('tabIncome').classList.add('active');
  document.getElementById('tabExpense').classList.remove('active');

  renderList();
}

function showExpenseReport() {
  currentTab = 'expense';

  document.getElementById('tabExpense').classList.add('active');
  document.getElementById('tabIncome').classList.remove('active');

  renderList();
}

function prevMonth() {
  if (currentMonth > 1) {
    currentMonth--;
    renderMonthly();
  }
}

function nextMonth() {
  if (currentMonth < 12) {
    currentMonth++;
    renderMonthly();
  }
}

function editTransaction(id) {
  window.location = 'transactions.html?id=' + id;
}

/* CATEGORY */

async function showCategory() {
  setTab('tabCategory');

  const data = await api('/stats/category');

  content.innerHTML = `<div class="card"><h2>Chi tiêu theo danh mục</h2>`;

  data.forEach((c) => {
    content.innerHTML += `

<div class="transaction">

<span>${c.categoryName}</span>

<span class="expense">
${c.total.toLocaleString()} đ
</span>

</div>

`;
  });

  content.innerHTML += `</div>`;
}

showSummary();
