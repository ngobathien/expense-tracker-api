let currentType = 'income';
let categories = [];
let selectedCategory = null;

const params = new URLSearchParams(window.location.search);
const editId = params.get('id');

/* LOAD CATEGORY */

async function loadCategories() {
  categories = await api('/categories');

  renderCategories();

  if (editId) {
    await loadEditTransaction();
  }
}

/* RENDER CATEGORY */

function renderCategories() {
  const filtered = categories.filter((c) => c.type === currentType);

  let html = '';

  filtered.forEach((c) => {
    html += `
<div class="category-card ${selectedCategory === c._id ? 'active' : ''}"
onclick="selectCategory(event,'${c._id}')">

${c.name}

</div>
`;
  });

  html += `
<div class="category-card category-add"
onclick="openCategoryPage()">

+ Thêm

</div>
`;

  document.getElementById('categoryCards').innerHTML = html;
}

/* SELECT CATEGORY */

function selectCategory(e, id) {
  selectedCategory = id;

  document
    .querySelectorAll('.category-card')
    .forEach((c) => c.classList.remove('active'));

  e.currentTarget.classList.add('active');
}

/* OPEN CATEGORY PAGE */

function openCategoryPage() {
  window.location = 'categories.html?type=' + currentType;
}

/* TAB SWITCH */

function showIncome() {
  currentType = 'income';

  document.getElementById('tabIncome').classList.add('active');
  document.getElementById('tabExpense').classList.remove('active');

  document.getElementById('submitBtn').innerText = '+ Thêm thu';

  renderCategories();
}

function showExpense() {
  currentType = 'expense';

  document.getElementById('tabExpense').classList.add('active');
  document.getElementById('tabIncome').classList.remove('active');

  document.getElementById('submitBtn').innerText = '- Thêm chi';

  renderCategories();
}

/* LOAD TRANSACTION FOR EDIT */

async function loadEditTransaction() {
  if (!editId) return;

  const t = await api('/transactions/' + editId);

  if (!t) return;

  document.getElementById('amount').value = t.amount || '';
  document.getElementById('note').value = t.note || '';
  document.getElementById('date').value = t.date ? t.date.split('T')[0] : '';

  currentType = t.type || 'expense';

  if (currentType === 'income') {
    showIncome();
  } else {
    showExpense();
  }

  selectedCategory = t.categoryId;

  renderCategories();
}

/* SUBMIT FORM */

document
  .getElementById('transactionForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      alert('Chọn danh mục');
      return;
    }

    const amount = Number(document.getElementById('amount').value);
    const note = document.getElementById('note').value;
    const date = document.getElementById('date').value;

    if (editId) {
      await api('/transactions/' + editId, 'PATCH', {
        amount,
        type: currentType,
        categoryId: selectedCategory,
        note,
        date,
      });

      alert('Sửa giao dịch thành công');
    } else {
      await api('/transactions', 'POST', {
        amount,
        type: currentType,
        categoryId: selectedCategory,
        note,
        date,
      });

      alert('Tạo giao dịch thành công');
    }

    window.location = 'report.html';
  });

/* INIT */

loadCategories();
