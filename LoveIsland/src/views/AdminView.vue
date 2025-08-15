<script setup>
import { ref, onMounted } from 'vue'
import { apiGet, apiSend } from '@/lib/api'

const users = ref([])
const loading = ref(false)
const err = ref('')

async function load(){
  loading.value = true; err.value = ''
  try { users.value = await apiGet('/admin/users') }
  catch(e){ err.value = e?.response?.data || 'Failed to load users' }
  finally{ loading.value = false }
}

async function verify(id){
  await apiSend(`/admin/verify/${id}`,'PUT',{})
  await load()
}
async function ban(id, value=true){
  await apiSend(`/admin/ban/${id}?value=${value}`,'PUT',{})
  await load()
}
async function removeUser(id){
  await apiSend(`/admin/users/${id}`,'DELETE')
  await load()
}

onMounted(load)
</script>

<template>
  <section class="container">
    <h2>Admin – Users</h2>
    <div class="card" v-if="err" style="color:var(--danger)">{{ err }}</div>
    <div class="card" v-if="loading">Loading…</div>

    <div v-for="u in users" :key="u.id" class="card" style="margin-top:10px;">
      <div style="display:flex; gap:12px; align-items:center;">
        <img :src="u.mainPhoto || '/placeholder.png'" class="photo" style="width:64px; height:64px;"/>
        <div style="flex:1;">
          <div style="font-weight:700">{{ u.displayName }}</div>
          <div style="opacity:.7">{{ u.email }} — role: {{ u.role }} — verified: {{ u.isVerified ? 'yes':'no' }} — banned: {{ u.isBanned ? 'yes':'no' }}</div>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn-ghost" @click="verify(u.id)" :disabled="u.isVerified">Verify</button>
          <button class="btn-ghost" v-if="!u.isBanned" @click="ban(u.id,true)">Ban</button>
          <button class="btn-ghost" v-else @click="ban(u.id,false)">Unban</button>
          <button class="btn" @click="removeUser(u.id)">Delete</button>
        </div>
      </div>
    </div>
  </section>
</template>
