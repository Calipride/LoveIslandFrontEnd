<template>
  <section class="container" style="max-width:480px;">
    <div class="card">
      <h2>Create account</h2>
      <form @submit.prevent="register" class="grid-1">
        <input class="field" v-model="firstName" placeholder="First name" required />
        <input class="field" v-model="lastName" placeholder="Last name" required />
        <input class="field" v-model="displayName" placeholder="Display name (optional)" />
        <input class="field" v-model="email" type="email" placeholder="Email" required />
        <input class="field" v-model="password" type="password" placeholder="Password" required />
        <button class="btn">Create account</button>
      </form>
      <p v-if="err" style="color:var(--danger); margin-top:10px;">{{ err }}</p>
      <p style="margin-top:10px;">Already have an account? <router-link to="/login">Login</router-link></p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { apiSend } from '@/lib/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const firstName = ref('')
const lastName = ref('')
const displayName = ref('')
const email = ref('')
const password = ref('')
const err = ref('')

async function register(){
  err.value = ''
  try{
    await apiSend('/auth/register','POST',{
      firstName:firstName.value,
      lastName:lastName.value,
      displayName: displayName.value || undefined,
      email:email.value,
      password:password.value
    })
    router.push({ name:'login', query:{ registered:1 }})
  }catch(e){
    err.value = e?.response?.data || 'Failed to register'
  }
}
</script>
