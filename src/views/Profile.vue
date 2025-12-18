<template>
  <div class="profile">
    <h1>Профиль пользователя</h1>
    <div class="profile-content">
      <div class="avatar-section">
        <div class="avatar">JD</div>
        <h2>Иван Иванов</h2>
        <p class="email">ivan@example.com</p>
      </div>
      <div class="info-section">
        <h3>Информация</h3>
        <div class="info-item">
          <strong>Дата регистрации:</strong>
          <span>15 января 2024</span>
        </div>
        <div class="info-item">
          <strong>Статус:</strong>
          <span class="status active">Активен</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.profile {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.profile-content {
  border: 1px solid #ccc;
  padding: 20px;
  background: white;
}

.avatar-section {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #42b883;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
</style>

