<template>
  <div class="card" style="width:min(560px, 100%); overflow:hidden; position:relative;">
    <div style="aspect-ratio: 4/5; background:#1c0933; position:relative;">
      <img v-if="profile.photo" :src="profile.photo" alt="" style="width:100%;height:100%;object-fit:cover;">
      <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,.6));"></div>

      <!-- Like/Nope banners -->
      <div v-if="decision==='like'" style="position:absolute;top:16px;left:16px;padding:8px 12px;border:2px solid #37ff9f;color:#37ff9f;border-radius:10px;font-weight:700;letter-spacing:2px;">
        LIKE
      </div>
      <div v-if="decision==='nope'" style="position:absolute;top:16px;right:16px;padding:8px 12px;border:2px solid #ff6b6b;color:#ff6b6b;border-radius:10px;font-weight:700;letter-spacing:2px;">
        NOPE
      </div>
    </div>

    <div style="padding:14px 16px;">
      <h2>{{ profile.name }}, {{ profile.age }}</h2>
      <p style="opacity:.9; margin:6px 0 12px;">{{ profile.bio }}</p>
      <div>
        <span v-for="t in profile.tags" :key="t" class="tag">{{ t }}</span>
      </div>

      <div style="display:flex; gap:10px; margin:16px 0 6px;">
        <button class="btn btn-ghost" @click="$emit('nope')">Nope</button>
        <button class="btn btn-primary" @click="$emit('like')">Like</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  profile: { type: Object, required: true },
  decision: { type: String, default: null } // 'like' | 'nope' | null
})
</script>
