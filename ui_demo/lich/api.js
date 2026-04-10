const BASE_URL = 'http://localhost:3000';

export async function fetchStats(endpoint, month, year) {
  const token = document.getElementById('jwt-token').value;

  const response = await fetch(
    `${BASE_URL}/stats/${endpoint}?month=${month}&year=${year}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) throw new Error('Lỗi kết nối API hoặc Token hết hạn');
  return await response.json();
}
