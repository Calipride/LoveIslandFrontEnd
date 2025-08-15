<template>
  <section class="container">
    <h2>Chat</h2>

    <div class="card" style="margin-bottom:12px;">
      <label>Peer ID:</label>
      <input class="field" v-model.number="peerId" type="number" placeholder="Select from Matches page or enter ID"/>
      <button class="btn" @click="open">Open thread</button>
    </div>

    <div v-if="thread.length" class="card">
      <div v-for="m in thread" :key="m.id" style="margin:8px 0;">
        <div style="font-size:.9rem; opacity:.7;">{{ m.senderId === me.id ? 'Me' : 'Them' }}</div>
        <div class="card" style="padding:10px;">{{ m.body }}</div>
      </div>
      <form @submit.prevent="sendMsg" style="display:flex; gap:8px; margin-top:8px;">
        <input class="field" v-model="text" placeholder="Type message…"/>
        <button class="btn">Send</button>
      </form>
    </div>
    <div v-else class="card">Open a thread to start chatting.</div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
import { useRoute } from 'vue-router'

const chat = useChatStore()
const user = useUserStore()
const me = computed(() => user.me)

const route = useRoute()
const peerId = ref(Number(route.query.peer || 0))
const text = ref('')

async function open(){
  if(!peerId.value) return
  await chat.openThread(peerId.value)
}

async function sendMsg(){
  if(!text.value || !peerId.value) return
  await chat.send(peerId.value, text.value)
  text.value = ''
}

const thread = computed(() => chat.thread)

onMounted(() => {
  if(route.query.peer) open()
})
</script>
