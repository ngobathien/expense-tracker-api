function formatMoney(number) {
  return new Intl.NumberFormat('vi-VN').format(number) + 'đ';
}

async function loadStats() {
  try {
    const data = await api('/stats/monthly');

    let html = '';

    data.forEach((m) => {
      html += `
        <div class="card" style="margin-top:10px">
          <h3>📅 Tháng ${m.month}</h3>

          <p style="color:green">
            💰 Thu: +${formatMoney(m.totalIncome)}
          </p>

          <p style="color:red">
            💸 Chi: -${formatMoney(m.totalExpense)}
          </p>

          <p>
            🧾 Balance: <b>${formatMoney(m.balance)}</b>
          </p>
        </div>
      `;
    });

    document.getElementById('stats').innerHTML = html;
  } catch (err) {
    console.error(err);
    document.getElementById('stats').innerHTML = '❌ Lỗi load dữ liệu';
  }
}

loadStats();
