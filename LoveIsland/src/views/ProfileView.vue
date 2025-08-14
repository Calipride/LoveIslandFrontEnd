<template>
  <section>
    <h1 style="margin-bottom:14px;">Profile</h1>

    <form class="card" style="padding:16px; display:grid; gap:14px;">
      <div style="display:grid; grid-template-columns: 120px 1fr; gap:14px; align-items:center;">
        <img :src="photo" alt="" style="width:120px;height:120px;object-fit:cover;border-radius:14px;background:#1c0933;">
        <div>
          <input type="url" v-model="photo" placeholder="Photo URL" class="field">
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
        <input v-model="name" placeholder="Name" class="field">
        <input v-model.number="age" type="number" min="18" max="100" placeholder="Age" class="field">
      </div>

      <textarea v-model="bio" rows="4" placeholder="Bio" class="field"></textarea>

      <div style="display:flex; gap:10px;">
        <button class="btn btn-ghost" type="button" @click="reset">Reset</button>
        <button class="btn btn-primary" type="button" @click="save">Save</button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useUserStore } from '../stores/user'
const user = useUserStore()

const name  = ref(user.me?.name  ?? 'Mary')
const age   = ref(user.me?.age   ?? 22)
const bio   = ref(user.me?.bio   ?? 'Learning, lifting, living 💜')
const photo = ref(user.me?.photo ?? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop')

watchEffect(() => {
  if (user.me) {
    name.value  = user.me.name  ?? name.value
    age.value   = user.me.age   ?? age.value
    bio.value   = user.me.bio   ?? bio.value
    photo.value = user.me.photo ?? photo.value
  }
})

async function save(){
  try{
    await user.updateMe({
      name: name.value,
      age: age.value,
      bio: bio.value,
      photo: photo.value
    })
    alert('Profile saved!')
  }catch(err){
    alert('Save failed: ' + err.message)
  }
}

function reset(){
  name.value=''; age.value=null; bio.value=''; photo.value=''
}
</script>

<style scoped>
.field{
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,.15);
  background: rgba(0,0,0,.2);
  color: #fff;
  padding: 10px;
}
</style>
