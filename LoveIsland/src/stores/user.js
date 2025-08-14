import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: ()=> ({
    me: null,
    token: null
  }),
  actions: {
    async fetchMe(){
      // const res = await fetch('/api/users/me', { headers:{ Authorization:`Bearer ${this.token}` }})
      // this.me = await res.json()
    }
  }
})
