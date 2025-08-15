import { defineStore } from 'pinia'
import { apiGet, apiSend } from '@/lib/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('li_token') || null,
    me: JSON.parse(localStorage.getItem('li_me') || 'null'),
  }),
  getters: {
    isAuthed: (s) => !!s.token,
    // 🔽 admin getter from profile
    isAdmin: (s) => s.me?.role === 'admin',
  },
  actions: {
    async login(email, password) {
      const data = await apiSend('/auth/login','POST',{ email, password })
      this.token = data.token
      localStorage.setItem('li_token', this.token)
      await this.fetchMe()
    },
    logout() {
      this.token = null
      this.me = null
      localStorage.removeItem('li_token')
      localStorage.removeItem('li_me')
    },
    async fetchMe() {
      const me = await apiGet('/users/me')
      this.me = me
      localStorage.setItem('li_me', JSON.stringify(me))
    },
    async updateMe(payload) {
      const updated = await apiSend('/users/me','PUT', payload)
      this.me = updated || { ...(this.me||{}), ...payload }
      localStorage.setItem('li_me', JSON.stringify(this.me))
    },
    async updatePrefs(pref) {
      await apiSend('/users/preferences','PUT', pref)
    }
  }
})
