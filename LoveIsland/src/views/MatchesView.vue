<template>
  <section class="container">
    <h2>Matches</h2>
    <div class="grid-3" v-if="matches.length">
      <div class="card" v-for="m in matches" :key="m.matchId">
        <img :src="m.mainPhoto || '/placeholder.png'" class="photo"/>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
          <div>{{ m.displayName }}</div>
          <router-link class="btn" :to="{ name:'chat', query:{ peer: m.id } }">Chat</router-link>
        </div>
      </div>
    </div>
    <div v-else class="card">No matches yet.</div>
  </section>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useChatStore } from '@/stores/chat'

const chat = useChatStore()
const matches = computed(() => chat.matches)
onMounted(() => chat.loadMatches())
</script>
