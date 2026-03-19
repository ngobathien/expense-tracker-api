let currentType = 'income';
let categories = [];

/* LOAD */

async function loadCategories() {
  categories = await api('/categories');

  renderCategories();
}

/* RENDER */

function renderCategories() {
  const filtered = categories.filter((c) => c.type === currentType);

  let html = '';

  filtered.forEach((c) => {
    html += `
<div class="card">
<b>${c._id}</b></br>
<b>${c.name}</b>

<div style="margin-top:10px">

<button onclick="editCategory('${c._id}','${c.name}')">
Sửa
</button>

<button onclick="deleteCategory('${c._id}')">
Delete
</button>

</div>

</div>
`;
  });

  document.getElementById('categories').innerHTML = html || 'Chưa có danh mục';
}

/* DELETE */

async function deleteCategory(id) {
  if (!confirm('Xóa danh mục này?')) return;

  await api('/categories/' + id, 'DELETE');

  loadCategories();
}

/* EDIT */

async function editCategory(id, oldName) {
  const name = prompt('Sửa tên danh mục', oldName);

  if (!name) return;

  await api('/categories/' + id, 'PATCH', {
    name,
    type: currentType,
  });

  loadCategories();
}

/* TABS */

function showIncome() {
  currentType = 'income';

  document.getElementById('tabIncome').classList.add('active');
  document.getElementById('tabExpense').classList.remove('active');

  document.getElementById('submitBtn').innerText = '+ Thêm danh mục thu';

  renderCategories();
}

function showExpense() {
  currentType = 'expense';

  document.getElementById('tabExpense').classList.add('active');
  document.getElementById('tabIncome').classList.remove('active');

  document.getElementById('submitBtn').innerText = '+ Thêm danh mục chi';

  renderCategories();
}

/* CREATE */

document
  .getElementById('categoryForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;

    await api('/categories', 'POST', {
      name,
      type: currentType,
    });

    document.getElementById('categoryForm').reset();

    loadCategories();
  });

loadCategories();
