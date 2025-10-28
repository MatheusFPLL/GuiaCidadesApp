// services/api.js
const HOST = 'http://10.0.2.2:3000'; // AVALIAR: mude se usar device físico

export async function register(email, password) {
  const res = await fetch(`${HOST}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${HOST}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function listFavorites(token) {
  const res = await fetch(`${HOST}/api/favorites`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function addFavorite(token, favData) {
  const res = await fetch(`${HOST}/api/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(favData)
  });
  return res.json();
}

export async function deleteFavorite(token, favId) {
  const res = await fetch(`${HOST}/api/favorites/${favId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

// Tips with file upload (FormData)
export async function createTip(token, { cityName, country, text, photoUri }) {
  const form = new FormData();
  form.append('cityName', cityName || '');
  form.append('country', country || '');
  form.append('text', text || '');
  if (photoUri) {
    const filename = photoUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image';
    form.append('photo', { uri: photoUri, name: filename, type });
  }
  const res = await fetch(`${HOST}/api/tips`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    body: form
  });
  return res.json();
}

export async function getMyTips(token) {
  const res = await fetch(`${HOST}/api/tips`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}
