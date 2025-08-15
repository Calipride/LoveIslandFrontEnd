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
import { ref, onMounted } from "vue";
import { apiGet, apiSend } from "@/lib/api";

const loading = ref(false);
const error = ref("");
const cards = ref([]); // feed items

async function loadFeed() {
  loading.value = true;
  error.value = "";
  try {
    // GET /api/users/feed
    cards.value = await apiGet("/users/feed");
  } catch (e) {
    error.value = e?.response?.data ?? e.message;
  } finally {
    loading.value = false;
  }
}

// like or pass (adjust endpoint to your SwipeController route if different)
async function decide(targetId, like) {
  try {
    // example: POST /api/swipe/decision  body: { targetId, like }
    await apiSend("/swipe/decision", "POST", { targetId, like });
    // remove card from list
    cards.value = cards.value.filter(c => c.id !== targetId);
  } catch (e) {
    alert(e?.response?.data ?? e.message);
  }
}

onMounted(loadFeed);
</script>
