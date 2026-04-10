// Giả lập dữ liệu từ API getMonthly và getCalendar
const mockMonthlyData = {
  totalIncome: 3000000,
  totalExpense: 215000,
  transactions: [
    {
      date: '17/03 (Th 3)',
      dailyTotal: -165000,
      items: [
        { icon: 'fa-magic', cat: 'Mỹ phẩm', note: 'Son phấn', amount: 150000 },
        { icon: 'fa-utensils', cat: 'Ăn uống', note: 'Cháo', amount: 15000 },
      ],
    },
    {
      date: '16/03 (Th 2)',
      dailyTotal: -25000,
      items: [
        { icon: 'fa-utensils', cat: 'Ăn uống', note: 'Ăn cơm', amount: 25000 },
      ],
    },
  ],
};

const mockCalendarDays = [
  { day: 1, inc: 0, exp: 0 },
  { day: 7, inc: 3000000, exp: 25000 },
  { day: 16, inc: 0, exp: 25000 },
  { day: 17, inc: 0, exp: 165000 },
];

function initApp() {
  renderCalendar();
  renderSummary();
  renderTransactions();
}

function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  // Render 31 ngày (đơn giản hóa)
  for (let i = 1; i <= 31; i++) {
    const dayData = mockCalendarDays.find((d) => d.day === i);
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    dayEl.innerHTML = `
            <span class="day-number">${i}</span>
            <span class="cal-inc">${dayData?.inc > 0 ? dayData.inc.toLocaleString() : ''}</span>
            <span class="cal-exp">${dayData?.exp > 0 ? dayData.exp.toLocaleString() : ''}</span>
        `;
    grid.appendChild(dayEl);
  }
}

function renderSummary() {
  document.getElementById('total-income').innerText =
    mockMonthlyData.totalIncome.toLocaleString() + 'đ';
  document.getElementById('total-expense').innerText =
    mockMonthlyData.totalExpense.toLocaleString() + 'đ';
  document.getElementById('total-balance').innerText =
    (
      mockMonthlyData.totalIncome - mockMonthlyData.totalExpense
    ).toLocaleString() + 'đ';
}

function renderTransactions() {
  const list = document.getElementById('transaction-list');
  mockMonthlyData.transactions.forEach((group) => {
    let groupHtml = `
            <div class="day-group">
                <div class="day-group-header">
                    <span>${group.date}</span>
                    <span>${group.dailyTotal.toLocaleString()}đ</span>
                </div>
        `;

    group.items.forEach((item) => {
      groupHtml += `
                <div class="transaction-item">
                    <div class="icon-box"><i class="fas ${item.icon}"></i></div>
                    <div class="info">
                        <div class="cat">${item.cat} <span class="note">${item.note}</span></div>
                    </div>
                    <div class="amount">${item.amount.toLocaleString()}đ</div>
                </div>
            `;
    });

    groupHtml += `</div>`;
    list.innerHTML += groupHtml;
  });
}

initApp();
