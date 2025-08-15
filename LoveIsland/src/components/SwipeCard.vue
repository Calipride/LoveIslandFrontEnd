<template>
  <div class="card" style="overflow:hidden;">
    <img :src="photoUrl" class="photo" style="width:100%; height:360px; object-fit:cover; border-radius:12px;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
      <div>
        <div style="font-weight:700;">{{ item.name || item.displayName || 'User' }}</div>
        <div style="opacity:.7; font-size:.95rem;">{{ item.city || 'Somewhere' }}</div>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn-ghost" @click="$emit('pass', item.id)">✖</button>
        <button class="btn" @click="$emit('like', item.id)">❤</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ item:{ type:Object, required:true }})
const photoUrl = computed(() => props.item.mainPhoto || props.item.photoUrl || '/placeholder.png')
</script>
