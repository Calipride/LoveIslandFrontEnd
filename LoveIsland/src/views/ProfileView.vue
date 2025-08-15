<template>
  <section class="container">
    <div class="grid-2">
      <div class="card">
        <h2>My Profile</h2>
        <div v-if="me">
          <img :src="me.mainPhoto || '/placeholder.png'" class="photo" style="max-width:220px;"/>
          <div class="grid-2" style="margin-top:12px;">
            <input class="field" v-model="form.displayName" placeholder="Display name"/>
            <input class="field" v-model="form.city" placeholder="City"/>
            <input class="field" v-model="form.gender" placeholder="Gender (male/female/other)"/>
            <input class="field" v-model="dob" type="date" />
            <input class="field" v-model.number="form.latitude" type="number" step="0.0001" placeholder="Latitude"/>
            <input class="field" v-model.number="form.longitude" type="number" step="0.0001" placeholder="Longitude"/>
          </div>
          <textarea class="field" v-model="form.bio" rows="4" placeholder="Bio"></textarea>
          <div style="display:flex; gap:10px; margin-top:8px;">
            <button class="btn" @click="save">Save</button>
            <button class="btn-ghost" @click="reset">Reset</button>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>Photos</h2>
        <div class="grid-3">
          <div v-for="p in me?.photos || []" :key="p.id" class="card">
            <img :src="p.url" class="photo"/>
            <div style="display:flex; gap:8px; margin-top:8px;">
              <button class="btn-ghost" :disabled="p.isMain" @click="setMain(p.id)">Set main</button>
              <button class="btn-ghost" @click="delPhoto(p.id)">Delete</button>
            </div>
          </div>
        </div>
        <div style="margin-top:10px;">
          <input type="file" @change="upload"/>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px;">
      <h2>Preferences</h2>
      <div class="grid-3">
        <input class="field" v-model.number="pref.minAge" type="number" min="18" max="99" placeholder="Min age"/>
        <input class="field" v-model.number="pref.maxAge" type="number" min="18" max="99" placeholder="Max age"/>
        <input class="field" v-model.number="pref.maxDistanceKm" type="number" min="1" placeholder="Max distance (km)"/>
      </div>
      <input class="field" v-model="pref.interestedIn" placeholder="Interested in (male/female/any)"/>
      <button class="btn" style="margin-top:10px;" @click="savePrefs">Save preferences</button>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { apiUpload, apiSend, apiGet } from '@/lib/api'

const user = useUserStore()
const me = computed(() => user.me)

const form = reactive({
  displayName:'', bio:'', city:'', gender:'',
  dateOfBirth:null, latitude:null, longitude:null
})
const dob = ref('')

const pref = reactive({ minAge:18, maxAge:99, maxDistanceKm:50, interestedIn:'any' })

function syncForm(){
  if(!me.value) return
  form.displayName = me.value.displayName || ''
  form.bio = me.value.bio || ''
  form.city = me.value.city || ''
  form.gender = me.value.gender || ''
  form.latitude = me.value.latitude ?? null
  form.longitude = me.value.longitude ?? null
  dob.value = me.value.dateOfBirth ? me.value.dateOfBirth.substring(0,10) : ''
}

function reset(){ syncForm() }
async function save(){
  const payload = { ...form, dateOfBirth: dob.value || null }
  await user.updateMe(payload)
}
async function upload(e){
  const file = e.target.files?.[0]
  if(!file) return
  await apiUpload('/photos', file)           // POST /api/photos
  await user.fetchMe()                       // refresh photos
}
async function setMain(id){
  await apiSend(`/photos/${id}/main`, 'PUT')
  await user.fetchMe()
}
async function delPhoto(id){
  await apiSend(`/photos/${id}`, 'DELETE')
  await user.fetchMe()
}
async function loadPrefs(){
  // If you have GET /api/users/me (already returns preference sometimes),
  // otherwise keep local editable defaults.
  try{
    const u = await apiGet('/users/me')
    if(u?.preference){
      Object.assign(pref, u.preference)
    }
  }catch{}
}
async function savePrefs(){ await user.updatePrefs(pref) }

onMounted(async () => {
  if(!me.value) await user.fetchMe()
  syncForm()
  await loadPrefs()
})
</script>
