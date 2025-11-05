// services/api.js
// Ajuste HOST conforme seu ambiente:
// - Android emulator (AVD): 10.0.2.2
// - Android Expo Go on physical device: http://<IP-DA-SUA-MAQUINA>:3000
// - iOS simulator: http://localhost:3000
// - Expo web: http://localhost:3000
export const HOST = "http://192.168.1.3:3000";; // alterar conforme necessidade

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    // padroniza erro
    const message = payload?.message || payload?.error || payload || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

/* ---------------------------
   Auth: register / login
   - register expects an object: { name, email, password }
   - login(email, password)
   --------------------------- */

export async function register({ name, email, password }) {
  const res = await fetch(`${HOST}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
}

export async function login(email, password) {
  const res = await fetch(`${HOST}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

/* ---------------------------
   Favorites
   --------------------------- */

export async function listFavorites(token) {
  const res = await fetch(`${HOST}/api/favorites`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  return handleResponse(res);
}

export async function addFavorite(token, favData) {
  const res = await fetch(`${HOST}/api/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: JSON.stringify(favData),
  });
  return handleResponse(res);
}

export async function deleteFavorite(token, favId) {
  const res = await fetch(`${HOST}/api/favorites/${favId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  return handleResponse(res);
}

/* ---------------------------
   Tips (dicas) - supports image upload
   - createTip(token, { cityName, country, text, photoUri })
   - When sending FormData in React Native, DO NOT set Content-Type header:
     fetch will set the correct multipart boundary for you.
   --------------------------- */

export async function createTip(token, { cityName, country, text, photoUri }) {
  const form = new FormData();
  form.append("cityName", cityName || "");
  form.append("country", country || "");
  form.append("text", text || "");

  if (photoUri) {
    // On Android/iOS the uri returned by Expo ImagePicker can be:
    // - file:///...  or content://...; both are fine
    const uri = photoUri;
    const filename = uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const ext = match ? match[1].toLowerCase() : "jpg";
    const mime = ext === "jpg" || ext === "jpeg" ? `image/jpeg` : `image/${ext}`;

    // React Native expects { uri, name, type }
    form.append("photo", {
      uri,
      name: filename,
      type: mime,
    });
  }

  const res = await fetch(`${HOST}/api/tips`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      // IMPORTANT: do NOT set 'Content-Type' header when sending FormData in RN
    },
    body: form,
  });
  return handleResponse(res);
}

export async function getMyTips(token) {
  const res = await fetch(`${HOST}/api/tips`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  return handleResponse(res);
}
