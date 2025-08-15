<template>
  <section>
    <h1 style="margin-bottom:14px;">Chat</h1>

    <div class="card" style="display:grid; grid-template-rows: 1fr auto; min-height: 60vh;">
      <div style="padding:14px; overflow:auto; display:flex; flex-direction:column; gap:10px;">
        <div v-for="(m,i) in messages" :key="i" :style="bubbleStyle(m.me)">
          <div style="font-size:13px; opacity:.8; margin-bottom:4px;">{{ m.when }}</div>
          <div>{{ m.text }}</div>
        </div>
      </div>

      <form @submit.prevent="send" style="display:flex; gap:10px; padding:10px; border-top:1px solid rgba(255,255,255,.1);">
        <input v-model="draft" placeholder="Type a message…" style="flex:1; border-radius:10px; border:1px solid rgba(255,255,255,.15); background:rgba(0,0,0,.2); color:#fff; padding:12px;">
        <button class="btn btn-primary">Send</button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { apiGet, apiSend } from '../lib/api'
import { useUserStore } from '../stores/user'

const route = useRoute()
const user = useUserStore()

const peerId = ref(route.query.with ? Number(route.query.with) : null)
const messages = ref([])
const draft = ref('')

watch(() => route.query.with, (v)=> {
  peerId.value = v ? Number(v) : null
  load()
})

onMounted(load)

async function load(){
  if(!peerId.value) return
  try{
    // GET /api/messages/thread/{peerId}
    const raw = await apiGet(`/messages/thread/${peerId.value}`, user.token)
    // Map backend fields -> UI shape
    messages.value = raw.map(m => ({
      text: m.body,                                      // Body -> text
      when: new Date(m.sentAt).toLocaleTimeString().slice(0,5), // SentAt -> when
      me:   m.senderId === (user.me?.id ?? user.me?.Id)  // SenderId -> me
    }))
  }catch(e){
    console.error(e)
  }
}

async function send(){
  if(!draft.value.trim() || !peerId.value) return
  try{
    // POST /api/messages/{peerId}  body: { body: '...' }
    const res = await apiSend(`/messages/${peerId.value}`, 'POST', { body: draft.value }, user.token)
    // res is your saved entity; map and append
    messages.value.push({
      text: res.body,
      when: new Date(res.sentAt).toLocaleTimeString().slice(0,5),
      me:   true
    })
    draft.value = ''
  }catch(e){
    alert('Send failed: ' + e.message)
  }
}

function bubbleStyle(isMe){
  return {
    alignSelf: isMe ? 'flex-end' : 'flex-start',
    background: isMe ? 'linear-gradient(90deg,var(--accent-1),var(--accent-2))' : 'rgba(255,255,255,.08)',
    color: isMe ? '#12021e' : '#fff',
    padding: '10px 12px',
    borderRadius: '14px',
    maxWidth: '78%'
  }
}
</script>
