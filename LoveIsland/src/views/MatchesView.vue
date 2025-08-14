<template>
  <section>
    <h1 style="margin-bottom:14px;">Matches</h1>
    <div class="card" style="padding:12px;">
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap:12px;">
        <div v-for="m in matches" :key="m.id" class="card" style="overflow:hidden;">
          <img :src="m.photo" alt="" style="width:100%;aspect-ratio:1/1;object-fit:cover;">
          <div style="padding:10px;">
            <strong>{{ m.name }}</strong>
            <div style="margin-top:8px;">
              <RouterLink class="btn btn-primary" :to="{name:'chat', query:{ with:m.id }}">Chat</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { apiGet } from '../lib/api'

const user = useUserStore()
const matches = ref([])

onMounted(load)

async function load(){
  try {
    const apiMatches = await apiGet('/matches', user.token)
    matches.value = apiMatches.length ? apiMatches : fallbackMatches()
  } catch(e){
    console.error(e)
    matches.value = fallbackMatches()
  }
}

function fallbackMatches(){
  return [
    { id: 101, name: 'Arielle', photo:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop' },
    { id: 102, name: 'Noah',    photo:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop' },
  ]
}
</script>
