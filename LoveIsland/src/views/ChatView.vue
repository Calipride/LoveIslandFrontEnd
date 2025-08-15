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
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { apiGet, apiSend } from "@/lib/api";

const route = useRoute();
const peerId = ref(Number(route.params.peerId));
const messages = ref([]);
const body = ref("");
const error = ref("");
const loading = ref(false);

async function loadThread() {
  try {
    // GET /api/messages/thread/{peerId}
    messages.value = await apiGet(`/messages/thread/${peerId.value}`);
  } catch (e) {
    error.value = e?.response?.data ?? e.message;
  }
}

async function send() {
  if (!body.value.trim()) return;
  try {
    // POST /api/messages/{peerId}  body: { body }
    const msg = await apiSend(`/messages/${peerId.value}`, "POST", { body: body.value });
    messages.value.push(msg);
    body.value = "";
  } catch (e) {
    alert(e?.response?.data ?? e.message);
  }
}

onMounted(loadThread);
watch(() => route.params.peerId, (v) => {
  peerId.value = Number(v);
  loadThread();
});
</script>
