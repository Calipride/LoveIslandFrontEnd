// src/lib/api.js
import axios from 'axios'
import router from '@/router'   // ← now we will actually use it

const BASE = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false, // JWT via Authorization header only
})

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('li_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global 401 handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    if (status === 401) {
      // clear auth
      localStorage.removeItem('li_token')
      localStorage.removeItem('li_me')

      // Avoid redirect loop if already on login
      const current = router.currentRoute.value
      if (current?.name !== 'login') {
        router.push({
          name: 'login',
          query: { redirect: current?.fullPath || '/' },
        })
      }
    }
    return Promise.reject(err)
  }
)

// Helpers
export async function apiGet(path) {
  const res = await api.get(path)
  return res.data
}
export async function apiSend(path, method, body) {
  const res = await api({ url: path, method, data: body })
  return res.status === 204 ? null : res.data
}
export default api
