<template>
  <section class="container" style="max-width:420px;">
    <div class="card">
      <h2 style="margin:0 0 10px;">Login</h2>
      <form @submit.prevent="doLogin" class="grid-1">
        <input class="field" v-model="email" type="email" placeholder="Email" required />
        <input class="field" v-model="password" type="password" placeholder="Password" required />
        <button class="btn" type="submit" :disabled="loading">{{ loading ? 'Signing in…' : 'Login' }}</button>
      </form>
      <p v-if="err" style="color:var(--danger); margin-top:10px;">{{ err }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const email = ref('')
const password = ref('')
const loading = ref(false)
const err = ref('')

const router = useRouter()
const route = useRoute()
const user = useUserStore()

async function doLogin(){
  loading.value = true
  err.value = ''
  try{
    await user.login(email.value, password.value)
    router.push(route.query.redirect || '/')
  }catch(e){
    err.value = 'Invalid email or password'
  }finally{ loading.value = false }
}
</script>
