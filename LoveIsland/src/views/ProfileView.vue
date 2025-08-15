<template>
  <section class="container">
    <!-- Loading / error states -->
    <div v-if="loading" class="card center">Loading profile…</div>
    <div v-else-if="error" class="card error">
      <div style="margin-bottom:8px;">Couldn’t load your profile.</div>
      <pre style="white-space:pre-wrap">{{ error }}</pre>
      <button class="btn btn-primary" @click="load">Retry</button>
    </div>

    <!-- Main content -->
    <div v-else class="grid">
      <!-- Left: profile form -->
      <form class="card" @submit.prevent="saveProfile">
        <h2 style="margin-bottom: 12px;">Profile</h2>

        <div class="thumb" :style="thumbStyle">
          <img v-if="mainPhotoUrl" :src="mainPhotoUrl" alt="main photo" />
          <div v-else class="empty-thumb">No photo</div>
        </div>

        <label class="field">
          <span>Display name</span>
          <input v-model="form.displayName" placeholder="Your name" />
        </label>

        <label class="field">
          <span>City</span>
          <input v-model="form.city" placeholder="City" />
        </label>

        <label class="field">
          <span>Gender</span>
          <input v-model="form.gender" placeholder="male / female / other" />
        </label>

        <label class="field">
          <span>Date of birth</span>
          <input type="date" v-model="form.dateOfBirth" />
        </label>

        <div class="row">
          <label class="field">
            <span>Latitude</span>
            <input v-model.number="form.latitude" type="number" step="0.0001" />
          </label>
          <label class="field">
            <span>Longitude</span>
            <input v-model.number="form.longitude" type="number" step="0.0001" />
          </label>
        </div>

        <label class="field">
          <span>Bio</span>
          <textarea v-model="form.bio" rows="4" placeholder="Tell us about you"></textarea>
        </label>

        <div class="row">
          <button class="btn btn-primary" type="submit" :disabled="saving">
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
          <button class="btn btn-ghost" type="button" @click="resetForm" :disabled="saving">Reset</button>
        </div>
      </form>

      <!-- Right: photos -->
      <div class="card">
        <h2 style="margin-bottom: 12px;">Photos</h2>

        <div class="photos">
          <div v-for="p in photos" :key="p.id" class="photo-tile" :class="{ main: p.isMain }">
            <img :src="p.url" alt="" />
            <div class="photo-actions">
              <button class="btn btn-ghost" :disabled="p.isMain || phSaving" @click="setMain(p.id)">Set main</button>
              <button class="btn btn-ghost" :disabled="phSaving" @click="removePhoto(p.id)">Delete</button>
            </div>
          </div>
          <div v-if="photos.length === 0" class="muted">No photos yet.</div>
        </div>

        <div class="row" style="margin-top:12px;">
          <input ref="fileInput" type="file" accept="image/*" @change="uploadPhoto" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { apiGet, apiSend } from '@/lib/api'

// ---------- state ----------
const loading = ref(true)
const saving  = ref(false)
const phSaving = ref(false)
const error   = ref('')

const me = ref(null) // server result shape (ProfileDto)
const photos = ref([])

const form = ref({
  displayName: '',
  city: '',
  gender: '',
  dateOfBirth: '',  // ISO yyyy-mm-dd
  latitude: null,
  longitude: null,
  bio: ''
})

// ---------- derived ----------
const mainPhotoUrl = computed(() => {
  if (!photos.value || photos.value.length === 0) return ''
  const main = photos.value.find(p => p.isMain)
  return (main?.url) || photos.value[0]?.url || ''
})

const thumbStyle = computed(() => ({
  width: '120px',
  height: '120px',
  borderRadius: '14px',
  overflow: 'hidden',
  background: 'rgba(255,255,255,0.04)',
  display: 'grid',
  placeItems: 'center',
  marginBottom: '12px'
}))

// ---------- helpers ----------
function copyIn(profile) {
  me.value = profile || {}
  photos.value = (profile?.photos || []).slice().sort((a,b) => (b.isMain - a.isMain) || (a.id - b.id))

  form.value.displayName = profile?.displayName || ''
  form.value.city        = profile?.city || ''
  form.value.gender      = profile?.gender || ''
  form.value.bio         = profile?.bio || ''

  // Date: backend may return null/ISO string
  const dob = profile?.dateOfBirth ? new Date(profile.dateOfBirth) : null
  form.value.dateOfBirth = dob ? new Date(dob.getTime() - dob.getTimezoneOffset()*60000).toISOString().slice(0,10) : ''

  form.value.latitude  = profile?.latitude ?? null
  form.value.longitude = profile?.longitude ?? null
}

function payloadOut() {
  // Only send values (undefined will be ignored by your DTO binder if nullable)
  return {
    displayName: form.value.displayName || null,
    city:        form.value.city || null,
    gender:      form.value.gender || null,
    bio:         form.value.bio || null,
    dateOfBirth: form.value.dateOfBirth ? new Date(form.value.dateOfBirth).toISOString() : null,
    latitude:    form.value.latitude ?? null,
    longitude:   form.value.longitude ?? null
  }
}

// ---------- actions ----------
async function load() {
  loading.value = true
  error.value = ''
  try {
    const profile = await apiGet('/users/me')       // GET -> ProfileDto
    copyIn(profile || {})
  } catch (e) {
    error.value = (e?.response?.data) || e?.message || 'Unknown error'
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  saving.value = true
  try {
    const updated = await apiSend('/users/me', 'PUT', payloadOut()) // returns ProfileDto
    copyIn(updated || {}) // handle both OK-with-data and 204
  } catch (e) {
    alert('Could not save profile: ' + (e?.response?.data || e.message))
  } finally {
    saving.value = false
  }
}

function resetForm() {
  copyIn(me.value || {})
}

const fileInput = ref(null)

async function uploadPhoto(e) {
  const file = e?.target?.files?.[0]
  if (!file) return
  phSaving.value = true
  try {
    // POST /api/photos  (multipart, key = "file")
    const fd = new FormData()
    fd.append('file', file)
    // If your backend expects PhotoUploadForm with "file" name, the above matches.
    const res = await apiSend('/photos', 'POST', fd) // axios will set correct headers for FormData
    // push new photo; if it’s main, flip flags locally
    if (res) {
      if (res.isMain) photos.value.forEach(p => p.isMain = false)
      photos.value.unshift(res)
    }
    fileInput.value && (fileInput.value.value = '')
  } catch (e) {
    alert('Upload failed: ' + (e?.response?.data || e.message))
  } finally {
    phSaving.value = false
  }
}

async function setMain(photoId) {
  phSaving.value = true
  try {
    await apiSend(`/photos/${photoId}/main`, 'PUT')
    photos.value = photos.value.map(p => ({ ...p, isMain: p.id === photoId }))
  } catch (e) {
    alert('Could not set main: ' + (e?.response?.data || e.message))
  } finally {
    phSaving.value = false
  }
}

async function removePhoto(photoId) {
  if (!confirm('Delete this photo?')) return
  phSaving.value = true
  try {
    await apiSend(`/photos/${photoId}`, 'DELETE')
    photos.value = photos.value.filter(p => p.id !== photoId)
    // if we deleted main, nothing breaks because mainPhotoUrl is computed from remaining list
  } catch (e) {
    alert('Could not delete photo: ' + (e?.response?.data || e.message))
  } finally {
    phSaving.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.container { padding: 18px 0 24px; }
.grid {
  display: grid;
  grid-template-columns: minmax(280px, 520px) minmax(280px, 520px);
  gap: 16px;
}
@media (max-width: 1024px) { .grid { grid-template-columns: 1fr; } }

.card {
  background: rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 22px rgba(0,0,0,0.22);
}
.center { display: grid; place-items: center; min-height: 220px; }
.error { border: 1px solid rgba(255,100,100,.4); }

.field { display: grid; gap: 6px; margin: 10px 0; }
.field > span { font-size: .9rem; opacity: .8; }
.field > input, .field > textarea {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  padding: 10px 12px;
  color: #fff;
  outline: none;
}
.row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }

.thumb img { width: 120px; height: 120px; object-fit: cover; display: block; }
.empty-thumb { opacity: .6; font-size: .9rem; }

.photos { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; }
.photo-tile { position: relative; border-radius: 12px; overflow: hidden; }
.photo-tile img { width: 100%; height: 140px; object-fit: cover; display: block; }
.photo-tile.main { outline: 2px solid #a78bfa; }
.photo-actions {
  display: grid; grid-auto-flow: column; gap: 6px;
  position: absolute; left: 8px; right: 8px; bottom: 8px;
  background: rgba(0,0,0,0.35); padding: 6px; border-radius: 8px;
}

.btn {
  border-radius: 10px; padding: 8px 12px; cursor: pointer;
  background: rgba(255,255,255,.08);
  border: 1px solid rgba(255,255,255,.14);
  color: #fff;
}
.btn:hover { background: rgba(255,255,255,.12); }
.btn-primary { background: #ea4c89; border-color: #ea4c89; }
.btn-ghost { background: rgba(255,255,255,.06); }
.muted { opacity: .7; font-size: .9rem; }
</style>
