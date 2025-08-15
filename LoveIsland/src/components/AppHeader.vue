<template>
  <header class="container" style="padding:14px 0; display:flex; align-items:center; justify-content:space-between;">
    <router-link to="/" style="font-weight:700; letter-spacing:.3px;">💜 LoveIsland</router-link>
    <nav style="display:flex; gap:12px; align-items:center;">
      <router-link v-if="authed" to="/">Discover</router-link>
      <router-link v-if="authed" to="/matches">Matches</router-link>
      <router-link v-if="authed" to="/chat">Chat</router-link>
      <router-link v-if="authed" to="/profile">Profile</router-link>
      <router-link v-if="isAdmin" to="/admin">Admin</router-link>

      <router-link v-if="!authed" to="/login">Login</router-link>
      <router-link v-if="!authed" to="/register">Register</router-link>
      <button v-if="authed" class="btn-ghost" @click="logout">Logout</button>
    </nav>
  </header>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const user = useUserStore()
const { isAuthed: authed, isAdmin } = storeToRefs(user)
function logout(){ user.logout() }
</script>
