const BASE = import.meta.env.VITE_API_URL

function buildHeaders(token, extra = {}) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra
  }
}

export async function apiGet(path, token) {
  const res = await fetch(`${BASE}${path}`, { headers: buildHeaders(token) })
  if (!res.ok) throw new Error(await res.text() || res.statusText)
  return res.json()
}

export async function apiSend(path, method, body, token) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: buildHeaders(token),
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(await res.text() || res.statusText)
  // some endpoints return 204; return null in that case
  return res.status === 204 ? null : res.json()
}
