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
    async login(email, password) {
      const data = await apiSend('/auth/login', 'POST', { email, password })
      this.token = data.token
      this.me = data.user
      localStorage.setItem('li_token', this.token)
      localStorage.setItem('li_me', JSON.stringify(this.me))
    },
    logout() {
      this.token = null
      this.me = null
      localStorage.removeItem('li_token')
      localStorage.removeItem('li_me')
    },
    async fetchMe() {
      this.me = await apiGet('/users/me', this.token)
      localStorage.setItem('li_me', JSON.stringify(this.me))
    },
    async updateMe(payload) {
      const updated = await apiSend('/users/me', 'PUT', payload, this.token)
      // if API returns nothing (204), optimistically merge
      this.me = updated || { ...(this.me || {}), ...payload }
      localStorage.setItem('li_me', JSON.stringify(this.me))
      return this.me
    }
  }
})
