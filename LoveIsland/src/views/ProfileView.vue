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
import { ref, onMounted } from "vue";
import { apiGet, apiSend } from "@/lib/api";

const me = ref(null);
const form = ref({
  displayName: "",
  bio: "",
  city: "",
  gender: "",
  dateOfBirth: null,
  latitude: null,
  longitude: null,
});
const saving = ref(false);
const error = ref("");

async function loadMe() {
  try {
    // GET /api/users/me
    const data = await apiGet("/users/me");
    me.value = data;
    form.value.displayName = data.displayName ?? "";
    form.value.bio = data.bio ?? "";
    form.value.city = data.city ?? "";
    form.value.gender = data.gender ?? "";
    form.value.dateOfBirth = data.dateOfBirth ?? null;
    form.value.latitude = data.latitude ?? null;
    form.value.longitude = data.longitude ?? null;
  } catch (e) {
    error.value = e?.response?.data ?? e.message;
  }
}

async function save() {
  saving.value = true;
  error.value = "";
  try {
    // PUT /api/users/me
    await apiSend("/users/me", "PUT", form.value);
  } catch (e) {
    error.value = e?.response?.data ?? e.message;
  } finally {
    saving.value = false;
  }
}

onMounted(loadMe);
</script>
