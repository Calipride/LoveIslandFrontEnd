<template>
  <section class="container" style="padding:18px 0 24px;">
    <h2>Discover</h2>

    
    <form class="card row" @submit.prevent="applyFilters" style="gap:10px;margin:12px 0;">
      <label class="field">
        <span>Gender</span>
        <select v-model="filters.gender">
          <option value="any">any</option>
          <option value="female">female</option>
          <option value="male">male</option>
          <option value="other">other</option>
        </select>
      </label>

      <label class="field">
        <span>Min age</span>
        <input type="number" v-model.number="filters.minAge" min="18" max="99" />
      </label>

      <label class="field">
        <span>Max age</span>
        <input type="number" v-model.number="filters.maxAge" min="18" max="99" />
      </label>

      <button class="btn btn-primary" type="submit" :disabled="loading">Apply</button>
      <button class="btn btn-ghost" type="button" @click="resetFilters" :disabled="loading">Reset</button>
    </form>

    
    <div v-if="loading" class="card">Loading…</div>
    <div v-else-if="!feed.length" class="card">No more profiles right now. Come back later.</div>

    <div v-else class="stack">
      <div v-for="(p, i) in feed" :key="p.id" class="card profile-card">
        <img :src="p.mainPhoto || '/placeholder.png'" alt="" class="photo" />
        <div class="meta">
          <div class="name">{{ p.name }}</div>
          <div class="muted" v-if="p.city">{{ p.city }}</div>
        </div>
        <div class="row" style="gap:10px;margin-top:10px;">
          <button class="btn btn-ghost" @click="decide(i, false)">Pass</button>
          <button class="btn btn-primary" @click="decide(i, true)">Accept</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiGet, apiSend } from '@/lib/api'

const loading = ref(false)
const feed = ref([])

const filters = ref({
  gender: 'any',
  minAge: 18,
  maxAge: 99
})

async function loadFeed() {
  loading.value = true
  try {
    const qs = new URLSearchParams({
      gender: filters.value.gender,
      minAge: String(filters.value.minAge),
      maxAge: String(filters.value.maxAge)
    }).toString()

    // backend returns [{ id, name, mainPhoto, city? }]
    const items = await apiGet(`/users/feed?${qs}`)
    feed.value = items || []
  } catch (err) {
    console.error('Could not load discover list', err)
    feed.value = []
  } finally {
    loading.value = false
  }
}

function applyFilters() { loadFeed() }
function resetFilters() {
  filters.value = { gender: 'any', minAge: 18, maxAge: 99 }
  loadFeed()
}

async function decide(index, isLike) {
  const item = feed.value[index]
  if (!item) return

  
  const [removed] = feed.value.splice(index, 1)

  try {
    await apiSend('/swipes', 'POST', { targetId: removed.id, isLike })

  } catch (err) {
    
    feed.value.splice(index, 0, removed)
    alert('Swipe failed: ' + (err?.response?.data || err?.message))
  }
}

onMounted(loadFeed)
</script>

<style scoped>
.stack { display: grid; gap: 16px; }
.profile-card { display: grid; grid-template-columns: 180px 1fr; gap: 12px; align-items: center; }
.profile-card .photo { width: 180px; height: 180px; object-fit: cover; border-radius: 12px; }
.field { display: grid; gap: 6px; }
.field > input, .field > select {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  padding: 10px 12px;
  color: #fff;
  outline: none;
}
.btn { border-radius: 10px; padding: 8px 12px; cursor: pointer;
  background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14); color:#fff; }
.btn:hover { background: rgba(255,255,255,.12); }
.btn-primary { background: #ea4c89; border-color: #ea4c89; }
.btn-ghost { background: rgba(255,255,255,.06); }
</style>
