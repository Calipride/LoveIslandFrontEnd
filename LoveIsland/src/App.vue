<template>
  <div class="app-shell bottom-pad">
    <AppHeader />
    <main class="container" style="padding:18px 0 24px;">
      <RouterView />
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import BottomNav from '@/components/BottomNav.vue'
</script>
