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
import { ref } from 'vue'

const messages = ref([
  { text: 'Hey! Nice to match 😊', when:'18:20', me:false },
  { text: 'Hey you! How’s your day?', when:'18:21', me:true },
])
const draft = ref('')

function send(){
  if(!draft.value.trim()) return
  messages.value.push({ text: draft.value, when: new Date().toLocaleTimeString().slice(0,5), me:true })
  draft.value = ''
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
