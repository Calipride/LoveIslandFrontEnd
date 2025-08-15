<script setup>
import { ref, onMounted } from 'vue'
import { apiGet, apiSend } from '@/lib/api'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const loading = ref(false)
const feed = ref([])

async function loadFeed() {
  loading.value = true
  try {
    const items = await apiGet('/users/feed')  // ← backend route
    feed.value = items || []
  } finally {
    loading.value = false
  }
}

async function decide(idx, isLike) {
  const item = feed.value[idx]
  if (!item) return

  // optimistic: remove from UI immediately
  const [removed] = feed.value.splice(idx, 1)

  try {
    await apiSend('/swipe', 'POST', { targetId: removed.id, isLike })
    // nothing else to do; if a match happens, your Matches page will pick it up
  } catch (err) {
    // put it back if server failed
    feed.value.splice(idx, 0, removed)
    console.error('Swipe failed', err)
  }
}

onMounted(loadFeed)
</script>

<template>
  <section>
    <h2>Discover</h2>

    <div v-if="loading" class="card">Loading…</div>
    <div v-else-if="!feed.length" class="card">No more profiles right now. Come back later.</div>

    <div v-else class="stack">
      <div v-for="(p, i) in feed" :key="p.id" class="card profile-card">
        <img :src="p.mainPhoto || '/placeholder.png'" alt="" class="photo" />
        <div class="meta">
          <div class="name">{{ p.name }}</div>
        </div>
        <div class="row" style="gap:10px;margin-top:10px;">
          <button class="btn btn-ghost" @click="decide(i, false)">Pass</button>
          <button class="btn btn-primary" @click="decide(i, true)">Accept</button>
        </div>
      </div>
    </div>
  </section>
</template>
