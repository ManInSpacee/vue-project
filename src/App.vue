<script setup>
</script>

<template>
  <div id="app">
    <nav class="main-nav">
      <router-link to="/" class="nav-link">Главная</router-link>
      <router-link to="/palette" class="nav-link">Практика 27</router-link>
      <router-link to="/settings" class="nav-link">Практика 28</router-link>
      <router-link to="/profile" class="nav-link">Профиль</router-link>
    </nav>
    
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}

.main-nav {
  background: #333;
  padding: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  transition: background 0.3s;
}

[data-theme="dark"] .main-nav {
  background: #2c2c2c;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  border: 1px solid #555;
  transition: background 0.3s;
}

.nav-link:hover {
  background: #555;
}

[data-theme="dark"] .nav-link:hover {
  background: #444;
}

.nav-link.router-link-active {
  background: #42b883;
}

.main-content {
  padding: 20px;
}
</style>
