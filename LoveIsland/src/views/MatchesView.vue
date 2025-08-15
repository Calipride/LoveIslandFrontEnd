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
import { ref, onMounted } from "vue";
import { apiGet } from "@/lib/api";
import { useRouter } from "vue-router";

const matches = ref([]);
const error = ref("");
const loading = ref(false);
const router = useRouter();

async function load() {
  loading.value = true;
  error.value = "";
  try {
    // GET /api/matches
    matches.value = await apiGet("/matches");
  } catch (e) {
    error.value = e?.response?.data ?? e.message;
  } finally {
    loading.value = false;
  }
}

function openChat(peerId) {
  router.push({ name: "chat", params: { peerId } });
}

onMounted(load);
</script>

