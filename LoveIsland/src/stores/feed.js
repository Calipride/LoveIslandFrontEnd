import { defineStore } from 'pinia'
import { apiGet, apiSend } from '@/lib/api'

export const useFeedStore = defineStore('feed', {
  state: () => ({
    items: [],
    loading:false,
  }),
  actions: {
    async load() {
      this.loading = true
      try {
        this.items = await apiGet('/users/feed')
      } finally {
        this.loading = false
      }
    },
    async like(id) {
      // your backend has Swipe endpoints; simplest:
      // POST /api/swipe  { likeeId, isLike:true }
      await apiSend('/swipe','POST',{ likeeId:id, isLike:true })
      this.items = this.items.filter(x => x.id !== id)
    },
    async pass(id) {
      await apiSend('/swipe','POST',{ likeeId:id, isLike:false })
      this.items = this.items.filter(x => x.id !== id)
    }
  }
})
