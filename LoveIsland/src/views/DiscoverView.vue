<template>
  <section>
    <div style="display:flex; align-items:center; justify-content:space-between; margin:0 0 14px;">
      <h1>Discover</h1>
      <button class="btn btn-ghost" @click="shuffle">Shuffle</button>
    </div>

    <div class="swipe-stage">
      <SwipeCard
        v-if="current"
        :profile="current"
        :decision="decision"
        @like="like"
        @nope="nope"
      />
      <div v-else class="card" style="padding:24px; text-align:center;">
        <h3>No more profiles</h3>
        <p style="opacity:.85;">Try adjusting your filters or come back later.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import SwipeCard from '../components/SwipeCard.vue'

// TODO: replace with API fetch `/api/users/discover`
const profiles = ref([
  { id:1, name:'Arielle', age:24, photo:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop', bio:'Coffee, code, and city walks.', tags:['Gym','Afro beats','Tech']},
  { id:2, name:'Noah',    age:27, photo:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop', bio:'Traveler. Chef on weekends.', tags:['Foodie','Hiking','Self-care']},
  { id:3, name:'Lina',    age:25, photo:'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1200&auto=format&fit=crop', bio:'Books, art, and sunsets.', tags:['Art','Books','Salsa']},
])

const index = ref(0)
const decision = ref(null)
const current = computed(()=> profiles.value[index.value] || null)

function like(){
  decision.value = 'like'
  setTimeout(next, 280)
}
function nope(){
  decision.value = 'nope'
  setTimeout(next, 280)
}
function next(){
  decision.value = null
  index.value++
}
function shuffle(){
  profiles.value = profiles.value.sort(()=> Math.random() - .5)
  index.value = 0
}
</script>
