<template>
  <div class="app-shell">
    <AppHeader />

    <main class="container" style="padding: 18px 0 24px;">
      <router-view />
    </main>

    <BottomNav />
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import BottomNav from './components/BottomNav.vue'
</script>
