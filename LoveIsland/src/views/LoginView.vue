<!-- src/views/LoginView.vue -->
<template>
  <section style="max-width:400px;margin:auto;padding:20px;">
    <h1>Login</h1>
    <form @submit.prevent="doLogin">
      <input v-model="email" type="email" placeholder="Email" class="field" required />
      <input v-model="password" type="password" placeholder="Password" class="field" required />
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <p v-if="error" style="color:red">{{ error }}</p>
    
     <section style="max-width:420px;margin:60px auto;padding:20px;">
    <h1>Login</h1>
    <p>If you can read this, routing works.</p>
  </section>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

async function doLogin() {
  try {
    error.value = ''
    await userStore.login(email.value, password.value)
    router.push(route.query.redirect || '/')
  } catch (err) {
    error.value = 'Invalid login'
  }
}
</script>

<style scoped>
.field {
  display: block;
  width: 100%;
  margin: 8px 0;
  padding: 8px;
}
.btn-primary {
  padding: 8px 12px;
}
</style>
