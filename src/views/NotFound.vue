<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Страница не найдена</p>
    <router-link to="/" class="home-link">Вернуться на главную</router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 40px;
}

.not-found h1 {
  font-size: 60px;
  margin: 0;
}

.not-found p {
  font-size: 20px;
  margin: 20px 0;
}

.home-link {
  display: inline-block;
  padding: 10px 20px;
  background: #42b883;
  color: white;
  text-decoration: none;
  border: 1px solid #42b883;
}

.home-link:hover {
  background: #35a372;
}
</style>

