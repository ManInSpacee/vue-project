<template>
  <div class="home">
    <h1>Добро пожаловать!</h1>
    <p>Это главная страница приложения с практическими заданиями.</p>
    <div class="practice-links">
      <router-link to="/palette" class="practice-card">
        <h2>Практика 27</h2>
        <p>Палитра цветов</p>
      </router-link>
      <router-link to="/settings" class="practice-card">
        <h2>Практика 28</h2>
        <p>Продвинутые функции</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}

.practice-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 30px;
}

.practice-card {
  border: 1px solid #ccc;
  padding: 20px;
  text-decoration: none;
  color: inherit;
  background: white;
}

.practice-card:hover {
  background: #f0f0f0;
}

.practice-card h2 {
  margin: 0 0 10px 0;
}
</style>

