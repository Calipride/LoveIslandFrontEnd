import { defineStore } from 'pinia'
import { apiGet, apiSend } from '@/lib/api'

export const useChatStore = defineStore('chat', {
  state: () => ({
    matches: [],
    thread: [],
    activePeer: null,
  }),
  actions: {
    async loadMatches() {
      this.matches = await apiGet('/matches')  // GET /api/matches
    },
    async openThread(peerId) {
      this.activePeer = peerId
      this.thread = await apiGet(`/matches/messages/${peerId}`)
    },
    async send(peerId, body) {
      const msg = await apiSend(`/matches/messages/${peerId}`,'POST',{ body })
      this.thread.push(msg)
    }
  }
})
