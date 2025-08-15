// src/stores/user.js
import { defineStore } from 'pinia'
import { apiGet, apiSend } from '../lib/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('li_token') || null,
    me: JSON.parse(localStorage.getItem('li_me') || 'null'),
  }),

  getters: {
    isAuthed: (s) => !!s.token,
  },

  actions: {
    // --- LOGIN ---
    // Your backend returns { token } only -> we fetch /users/me next.
    async login(email, password) {
      const data = await apiSend('/auth/login', 'POST', { email, password })

      // save token first so axios interceptor attaches it to the next call
      this.token = data.token
      localStorage.setItem('li_token', this.token)

      // now fetch the current user
      await this.fetchMe()
      localStorage.setItem('li_me', JSON.stringify(this.me))
    },

    // --- LOGOUT ---
    logout() {
      this.token = null
      this.me = null
      localStorage.removeItem('li_token')
      localStorage.removeItem('li_me')
    },

    // --- FETCH PROFILE ---
    async fetchMe() {
      try {
        const me = await apiGet('/users/me')
        this.me = me
        localStorage.setItem('li_me', JSON.stringify(this.me))
      } catch (err) {
        // If token is bad/expired, clean up
        if (err?.response?.status === 401) this.logout()
        throw err
      }
    },

    // --- UPDATE PROFILE ---
    async updateMe(payload) {
      const updated = await apiSend('/users/me', 'PUT', payload)
      // some endpoints return 204; merge locally in that case
      this.me = updated || { ...(this.me || {}), ...payload }
      localStorage.setItem('li_me', JSON.stringify(this.me))
      return this.me
    },

    // --- OPTIONAL: refresh me on app boot if we have a token ---
    async init() {
      if (this.token && !this.me) {
        try { await this.fetchMe() } catch { /* ignore: token might be stale */ }
      }
    }
  }
})
