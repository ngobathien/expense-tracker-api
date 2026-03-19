const API_STATS = 'http://localhost:3000/api/v1/stats/monthly';
const API_TRANS = 'http://localhost:3000/api/v1/transactions';

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OWI3OTg4ZjBlZDQ5YzZkZTI1OTkxNTMiLCJpYXQiOjE3NzM2NjQwNjEsImV4cCI6MTc3NjI1NjA2MX0.07YRs14WmPYESIEg9BteFqt0jBmhR7AY9bEZNsZHZSg';

let statsData = [];
let currentMonthIndex = 0;
let currentTab = 'income';

async function loadStats() {
  const res = await fetch(API_STATS, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  statsData = await res.json();

  if (statsData.length > 0) {
    currentMonthIndex = statsData.length - 1;
    render();
  }
}

function render() {
  const month = statsData[currentMonthIndex];

  document.getElementById('monthTitle').innerText = 'Tháng ' + month.month;

  document.getElementById('incomeTotal').innerText =
    month.totalIncome.toLocaleString() + ' đ';

  document.getElementById('expenseTotal').innerText =
    month.totalExpense.toLocaleString() + ' đ';

  document.getElementById('balanceTotal').innerText =
    month.balance.toLocaleString() + ' đ';

  renderTransactions();
}

function renderTransactions() {
  const month = statsData[currentMonthIndex];

  let list =
    currentTab === 'income'
      ? month.incomeTransactions
      : month.expenseTransactions;

  let html = '';

  list?.forEach((t) => {
    html += `
<div class="transaction">
<span>${t.name}</span>
<span class="${currentTab}">
${currentTab === 'income' ? '+' : '-'}${t.amount.toLocaleString()} đ
</span>
</div>`;
  });

  document.getElementById('transactionList').innerHTML =
    html || 'Không có giao dịch';
}

function showIncome() {
  currentTab = 'income';
  document.getElementById('tabIncome').classList.add('active');
  document.getElementById('tabExpense').classList.remove('active');
  renderTransactions();
}

function showExpense() {
  currentTab = 'expense';
  document.getElementById('tabExpense').classList.add('active');
  document.getElementById('tabIncome').classList.remove('active');
  renderTransactions();
}

function prevMonth() {
  if (currentMonthIndex > 0) {
    currentMonthIndex--;
    render();
  }
}

function nextMonth() {
  if (currentMonthIndex < statsData.length - 1) {
    currentMonthIndex++;
    render();
  }
}

loadStats();

// CRUD FORM

document
  .getElementById('transactionForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById('name').value,
      amount: Number(document.getElementById('amount').value),
      type: document.getElementById('type').value,
      date: document.getElementById('date').value,
      categoryId: document.getElementById('categoryId').value,
    };

    await fetch(API_TRANS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    alert('Đã thêm giao dịch');

    loadStats();
  });
