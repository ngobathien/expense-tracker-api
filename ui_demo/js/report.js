/* ================= FILE: js/report.js ================= */
const content = document.getElementById('reportContent');

/* ================= BIẾN TOÀN CỤC (STATE) ================= */
let stats = []; // Dữ liệu cho tab Monthly
let calendarData = null; // Dữ liệu cho tab Calendar
let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();
let currentTab = 'income'; // Mặc định cho tab Monthly (Thu hoặc Chi)

let calendarMonth = new Date().getMonth() + 1;
let calendarYear = new Date().getFullYear();
let monthlyChart = null; // 👈 thêm ở đây
/* ================= HÀM TIỆN ÍCH ================= */
function setTab(id) {
  document
    .querySelectorAll('.tab')
    .forEach((t) => t.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

function formatMoney(amount) {
  return (amount || 0).toLocaleString() + ' đ';
}

/* ================= 1. TỔNG QUAN (SUMMARY) ================= */
async function showSummary() {
  setTab('tabSummary');
  const data = await api('/stats/summary');

  content.innerHTML = `
<div class="card">
  <h2>Tổng quan tài chính</h2>

  <div class="summary-box">
    <p class="income">Thu nhập<br>${formatMoney(data.totalIncome)}</p>
    <p class="expense">Chi tiêu<br>${formatMoney(data.totalExpense)}</p>
    <p><b>Số dư<br>${formatMoney(data.balance)}</b></p>
  </div>
</div>
`;
}

/* ================= 2. THEO THÁNG (MONTHLY) ================= */
async function showMonthly() {
  setTab('tabMonthly');
  stats = await api(`/stats/monthly?year=${currentYear}`);

  content.innerHTML = `
<div class="card">
  <h2>Báo cáo tháng</h2>

  <div class="header">
    <button onclick="prevMonth()">←</button>
    <h3 id="monthTitle"></h3>
    <button onclick="nextMonth()">→</button>
  </div>

  <div id="summary"></div>

  <canvas id="monthlyChart"></canvas>

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
  const monthData = stats.find((m) => m.month === currentMonth);
  document.getElementById('monthTitle').innerText =
    `Tháng ${currentMonth}/${currentYear}`;

  const summaryDiv = document.getElementById('summary');
  if (!monthData) {
    summaryDiv.innerHTML = 'Không có dữ liệu tháng này';
    document.getElementById('transactionList').innerHTML = '';
    return;
  }

  summaryDiv.innerHTML = `
    <span class="income">Thu: ${formatMoney(monthData.totalIncome)}</span> | 
    <span class="expense">Chi: ${formatMoney(monthData.totalExpense)}</span> | 
    <b>Dư: ${formatMoney(monthData.balance)}</b>
  `;
  renderList();
  renderChart(); // 👈 thêm dòng này
}

function renderList() {
  const monthData = stats.find((m) => m.month === currentMonth);
  if (!monthData) return;

  const list =
    currentTab === 'income'
      ? monthData.incomeTransactions
      : monthData.expenseTransactions;
  let html = '';

  list.forEach((t) => {
    html += `
<div class="transaction" onclick="editTransaction('${t._id}')">
  <span>${t.name || t.categoryName}</span>
  <span class="${currentTab}">
    ${currentTab === 'income' ? '+' : '-'}${formatMoney(t.amount)}
  </span>
</div>
`;
  });

  document.getElementById('transactionList').innerHTML =
    html ||
    '<p style="text-align:center; color: #999;">Không có giao dịch nào</p>';
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
  } else {
    currentMonth = 12;
    currentYear--;
  }
  renderMonthly();
}

function nextMonth() {
  if (currentMonth < 12) {
    currentMonth++;
  } else {
    currentMonth = 1;
    currentYear++;
  }
  renderMonthly();
}

/* ================= 3. THEO DANH MỤC (CATEGORY) ================= */
async function showCategory() {
  setTab('tabCategory');
  const data = await api('/stats/category');

  let html = `<div class="card"><h2>Chi tiêu theo danh mục</h2>`;
  if (!data || data.length === 0) {
    html += `<p>Chưa có dữ liệu chi tiêu.</p>`;
  } else {
    data.forEach((c) => {
      html += `
        <div class="transaction">
          <span>${c.categoryName}</span>
          <span class="expense">${formatMoney(c.total)}</span>
        </div>
      `;
    });
  }
  html += `</div>`;
  content.innerHTML = html;
}

/* ================= 4. LỊCH GIAO DỊCH (CALENDAR) ================= */
async function showCalendar() {
  setTab('tabCalendar');
  await reloadCalendarData();
}

async function reloadCalendarData() {
  const data = await api(
    `/stats/calendar?month=${calendarMonth}&year=${calendarYear}`,
  );
  // Dữ liệu từ NestJS thường bọc trong mảng nếu dùng aggregate
  calendarData = data[0] ||
    data || {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      calendar: [],
      daily: [],
    };

  content.innerHTML = `
    <div class="card">
      <div class="header">
        <button onclick="prevCalendarMonth()">←</button>
        <h3 id="calendarTitle">Tháng ${calendarMonth}/${calendarYear}</h3>
        <button onclick="nextCalendarMonth()">→</button>
      </div>

      <div class="calendar-summary" style="display: flex; justify-content: space-around; margin-bottom: 15px; background: #f9f9f9; padding: 10px; border-radius: 8px;">
         <div class="income">Thu: ${formatMoney(calendarData.totalIncome)}</div>
         <div class="expense">Chi: ${formatMoney(calendarData.totalExpense)}</div>
         <div style="font-weight:bold">Dư: ${formatMoney(calendarData.balance)}</div>
      </div>

  <div class="calendar-header-days">
  <div>T2</div><div>T3</div><div>T4</div>
  <div>T5</div><div>T6</div><div>T7</div><div>CN</div>
</div>
      <div id="calendarGrid" class="calendar-grid"></div>
      <div id="calendarDetail" style="margin-top: 20px;"></div>
    </div>
  `;
  renderCalendar();
}

function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';

  // 1. Tính toán ngày bắt đầu (Offset)
  // GetDay(): 0=CN, 1=T2... Chuyển về 0=T2
  let firstDay = new Date(calendarYear, calendarMonth - 1, 1).getDay();
  let startOffset = firstDay === 0 ? 6 : firstDay - 1;

  // 2. Tính số ngày trong tháng
  let daysInMonth = new Date(calendarYear, calendarMonth, 0).getDate();

  // 3. Vẽ ô trống đầu tháng
  for (let i = 0; i < startOffset; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'day empty';
    grid.appendChild(emptyDiv);
  }

  // 4. Vẽ các ngày có dữ liệu
  const today = new Date();
  const isThisMonth =
    today.getMonth() + 1 === calendarMonth &&
    today.getFullYear() === calendarYear;

  for (let i = 1; i <= daysInMonth; i++) {
    // Format date khớp với data API (YYYY-MM-DD hoặc DD)
    const dayStr = `${calendarYear}-${String(calendarMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dayData = calendarData.calendar.find((d) =>
      d.date.includes(dayStr),
    ) || { income: 0, expense: 0 };

    const dayDiv = document.createElement('div');
    dayDiv.className = `day ${isThisMonth && today.getDate() === i ? 'today' : ''}`;

    dayDiv.innerHTML = `
  <b>${i}</b>
  <div style="margin-top:4px; font-size:10px;">
    ${dayData.income > 0 ? `<div class="income">● ${Math.round(dayData.income / 1000)}k</div>` : ''}
    ${dayData.expense > 0 ? `<div class="expense">● ${Math.round(dayData.expense / 1000)}k</div>` : ''}
  </div>
`;

    dayDiv.onclick = () => {
      // Xóa highlight cũ, thêm mới
      document
        .querySelectorAll('.day')
        .forEach((d) => d.classList.remove('selected'));
      dayDiv.classList.add('selected');
      showCalendarDetail(dayStr);
    };
    grid.appendChild(dayDiv);
  }
}

function showCalendarDetail(date) {
  const daily = calendarData.daily.find((d) => d.date.includes(date));
  const container = document.getElementById('calendarDetail');

  if (!daily) {
    container.innerHTML = `<div style="border-top: 1px solid #eee; padding-top:10px;"><h3>📅 ${date}</h3><p>Không có giao dịch</p></div>`;
    return;
  }

  let html = `
    <div style="border-top: 2px solid #eee; padding-top: 15px;">
        <h3>📅 Chi tiết ngày ${date}</h3>
        <div style="display: flex; gap: 20px; margin-bottom: 10px;">
            <span class="income">Thu: ${formatMoney(daily.totalIncome)}</span>
            <span class="expense">Chi: ${formatMoney(daily.totalExpense)}</span>
        </div>
    </div>
  `;

  daily.transactions.forEach((t) => {
    html += `
      <div class="transaction" onclick="editTransaction('${t._id}')">
        <span>${t.type === 'INCOME' ? '🟢' : '🔴'} ${t.categoryName}: ${t.name || ''}</span>
        <span class="${t.type === 'INCOME' ? 'income' : 'expense'}">
          ${formatMoney(t.amount)}
        </span>
      </div>
    `;
  });

  container.innerHTML = html;
}

async function nextCalendarMonth() {
  if (calendarMonth === 12) {
    calendarMonth = 1;
    calendarYear++;
  } else {
    calendarMonth++;
  }
  await reloadCalendarData();
}

async function prevCalendarMonth() {
  if (calendarMonth === 1) {
    calendarMonth = 12;
    calendarYear--;
  } else {
    calendarMonth--;
  }
  await reloadCalendarData();
}

function editTransaction(id) {
  window.location = 'transactions.html?id=' + id;
}

function renderChart() {
  const monthData = stats.find((m) => m.month === currentMonth);
  if (!monthData) return;

  const totalIncome = monthData.totalIncome || 0;
  const totalExpense = monthData.totalExpense || 0;

  const canvas = document.getElementById('monthlyChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Xóa chart cũ
  if (monthlyChart && typeof monthlyChart.destroy === 'function') {
    monthlyChart.destroy();
  }

  monthlyChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Thu nhập', 'Chi tiêu'],
      datasets: [
        {
          data: [totalIncome, totalExpense],
          backgroundColor: ['#4caf50', '#f44336'],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const value = context.raw;
              const percent = total ? ((value / total) * 100).toFixed(1) : 0;

              return `${context.label}: ${value.toLocaleString()} đ (${percent}%)`;
            },
          },
        },
      },
    },
  });
}
/* ================= KHỞI TẠO MẶC ĐỊNH ================= */
showSummary();
