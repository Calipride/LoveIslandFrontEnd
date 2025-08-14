<template>
  <nav class="bottom-nav">
    <div class="container nav-grid">
      <RouterLink :to="{name:'discover'}" class="nav-btn" :class="{active: route.name==='discover'}">Discover</RouterLink>
      <RouterLink :to="{name:'matches'}"  class="nav-btn" :class="{active: route.name==='matches'}">Matches</RouterLink>
      <RouterLink :to="{name:'chat'}"     class="nav-btn" :class="{active: route.name==='chat'}">Chat</RouterLink>
      <RouterLink :to="{name:'profile'}"  class="nav-btn" :class="{active: route.name==='profile'}">Profile</RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
