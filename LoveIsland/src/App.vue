<template>
  <div>
    <NavBar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue';
</script>

<style>
/* Global styles if needed */
.main-content {
 padding-top: 60px; /* Adjust for fixed navbar height */
 padding-left: 1rem;
  padding-right: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

}

</style>