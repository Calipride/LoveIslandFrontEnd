<template>
  <nav class="navbar">
    <div class="navbar-logo">
      <router-link to="/">❤️ LoveIsland</router-link>
    </div>
    <ul class="navbar-links">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/matches">Matches</router-link></li>
      <li><router-link to="/chat">Chat</router-link></li>
      <li><router-link to="/profile">Profile</router-link></li>
    </ul>
    <div class="navbar-auth">
      <button @click="logout">Logout</button>
    </div>
  </nav>
</template>

<script setup lang="ts">
const logout = () => {
  localStorage.removeItem('jwt');
  window.location.href = '/login';
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: #ff4d6d;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 1000;
}

.navbar-logo a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.5rem;
}

.navbar-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}

.navbar-links a {
  color: white;
  text-decoration: none;
}

.navbar-links a:hover {
  text-decoration: underline;
}

.navbar-auth button {
  background-color: white;
  color: #ff4d6d;
  border: none;
  padding: 0.5rem 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
}

.navbar-auth button:hover {
  background-color: #ffe0e6;
}
</style>