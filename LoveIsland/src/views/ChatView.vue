<template>
  <section class="container" style="padding:18px 0 24px;">
    <h2>Chat</h2>

    <div class="chat-grid">
      <!-- Matches list -->
      <aside class="card matches">
        <div class="title">Matches</div>
        <div v-if="loadingMatches" class="muted">Loading…</div>
        <div v-else-if="!matches.length" class="muted">No matches yet.</div>

        <button
          v-for="m in matches"
          :key="m.peerId"
          class="match"
          :class="{ active: m.peerId === peerId }"
          @click="openThread(m.peerId)"
        >
          <img :src="m.photo || '/placeholder.png'" alt="" />
          <div class="meta">
            <div class="name">{{ m.name }}</div>
            <div class="muted">{{ m.lastMessagePreview || 'Say hi 👋' }}</div>
          </div>
        </button>
      </aside>

      <!-- Thread -->
      <main class="card thread">
        <div v-if="!peerId" class="muted">Open a match to start chatting.</div>

        <div v-else class="thread-body" ref="scrollBox">
          <div v-if="loadingThread" class="muted">Loading messages…</div>
          <div v-else-if="!messages.length" class="muted">No messages yet. Start the conversation!</div>

          <div v-else class="messages">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="message"
              :class="{ mine: msg.isMine }"
            >
              <div class="bubble">
                <div class="text">{{ msg.body }}</div>
                <div class="stamp">{{ shortTime(msg.sentAt) }}</div>
              </div>
            </div>
          </div>
        </div>

        <form v-if="peerId" class="composer" @submit.prevent="send">
          <input v-model="draft" placeholder="Type a message…" />
          <button class="btn btn-primary" :disabled="sending || !draft.trim()">Send</button>
        </form>
      </main>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { apiGet, apiSend } from '@/lib/api'

const matches = ref([])
const loadingMatches = ref(false)

const peerId = ref(null)
const messages = ref([])
const loadingThread = ref(false)
const sending = ref(false)
const draft = ref('')
const scrollBox = ref(null)

let pollTimer = null

function shortTime(iso) {
  try { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  catch { return '' }
}

// ---- load matches ----
async function loadMatches() {
  loadingMatches.value = true
  try {
    // expects [{ peerId, name, photo, lastMessagePreview? }]
    matches.value = await apiGet('/matches') || []
  } finally {
    loadingMatches.value = false
  }
}

// ---- open a thread with a match ----
async function openThread(id) {
  if (peerId.value === id) return
  peerId.value = id
  await loadThread()

  // start polling this thread
  clearInterval(pollTimer)
  pollTimer = setInterval(loadThread, 4000)
}

// ---- load thread ----
async function loadThread() {
  if (!peerId.value) return
  loadingThread.value = true
  try {
    // expects [{ id, body, senderId, recipientId, sentAt }]
    const raw = await apiGet(`/messages/thread/${peerId.value}`) || []
    const meId = await getMyId()

    messages.value = raw.map(m => ({
      id: m.id,
      body: m.body,
      sentAt: m.sentAt,
      isMine: m.senderId === meId
    }))

    await nextTick()
    // scroll to bottom
    if (scrollBox.value) scrollBox.value.scrollTop = scrollBox.value.scrollHeight
  } finally {
    loadingThread.value = false
  }
}

// small helper to get my user id (cached via /users/me)
let myIdCache = null
async function getMyId() {
  if (myIdCache) return myIdCache
  const me = await apiGet('/users/me')
  myIdCache = me.id
  return myIdCache
}

// ---- send message ----
async function send() {
  const body = draft.value.trim()
  if (!body || !peerId.value) return
  sending.value = true
  try {
    // POST { recipientId, body }
    const sent = await apiSend('/messages', 'POST', { recipientId: peerId.value, body })
    draft.value = ''
    // optimistic add
    messages.value.push({
      id: sent?.id ?? Math.random(),
      body,
      sentAt: new Date().toISOString(),
      isMine: true
    })
    await nextTick()
    if (scrollBox.value) scrollBox.value.scrollTop = scrollBox.value.scrollHeight
  } finally {
    sending.value = false
  }
}

onMounted(loadMatches)
onBeforeUnmount(() => clearInterval(pollTimer))
</script>

<style scoped>
.chat-grid {
  display: grid;
  grid-template-columns: 320px minmax(360px, 1fr);
  gap: 16px;
}
@media (max-width: 1024px) {
  .chat-grid { grid-template-columns: 1fr; }
}

/* Matches */
.matches .title { font-weight: 600; margin-bottom: 8px; }
.match {
  display: grid; grid-template-columns: 44px 1fr; gap: 10px; align-items: center;
  width: 100%; text-align: left; padding: 8px; border-radius: 10px; cursor: pointer;
  background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12);
}
.match + .match { margin-top: 8px; }
.match.active { outline: 2px solid #a78bfa; }
.match img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }

/* Thread */
.thread { display: grid; grid-template-rows: 1fr auto; }
.thread-body {
  overflow: auto; min-height: 220px; max-height: 56vh; padding: 8px; border-radius: 10px;
  background: rgba(255,255,255,0.04);
}
.messages { display: grid; gap: 8px; }
.message { display: grid; }
.message.mine { justify-content: end; }
.bubble {
  max-width: 70%;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 12px; padding: 8px 12px;
}
.message.mine .bubble { background: #5c4fb6; border-color: #5c4fb6; }
.stamp { opacity: .7; font-size: .75rem; margin-top: 2px; }

.composer {
  display: grid; grid-template-columns: 1fr auto; gap: 8px; margin-top: 10px;
}
.composer input {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  padding: 10px 12px;
  color: #fff;
}
.btn { border-radius: 10px; padding: 8px 12px; cursor: pointer;
  background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14); color:#fff; }
.btn-primary { background: #ea4c89; border-color: #ea4c89; }
.muted { opacity: .75; }
</style>
