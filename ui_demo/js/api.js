 const BASE_URL = 'http://localhost:3000/api/v1';

function getToken() {
  return localStorage.getItem('accessToken');
}

async function api(url, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  };

  if (data) options.body = JSON.stringify(data);

  const res = await fetch(BASE_URL + url, options);
  return res.json();
}
function logout() {
  localStorage.removeItem('accessToken');

  window.location = 'index.html';
}
