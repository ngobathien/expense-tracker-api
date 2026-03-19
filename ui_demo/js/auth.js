const API = 'http://localhost:3000/api/v1/auth';

// 🔥 nếu đã login thì đá sang dashboard luôn
const token = localStorage.getItem('accessToken');
if (token && window.location.pathname.includes('login')) {
  window.location.href = 'dashboard.html';
}

const form = document.getElementById('loginForm');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(API + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // ❗ check lỗi
      if (!res.ok) {
        alert(data.message || 'Login failed');
        return;
      }

      // ✅ lưu token
      localStorage.setItem('accessToken', data.accessToken);

      // ✅ redirect
      window.location.href = 'dashboard.html';
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  });
}

// 🔥 Google login
function googleLogin() {
  window.location.href = API + '/google';
}
