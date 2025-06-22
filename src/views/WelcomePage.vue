<template>
  <div class="welcome-container">
    <div class="welcome-card">
      <h1>Welcome to Academic Performance Portal</h1>
      <p class="subtitle">Please select your role to continue:</p>
      <div class="button-group">
        <router-link to="/lecturer" class="role-btn lecturer-btn">Lecturer Login</router-link>
        <router-link to="/student" class="role-btn student-btn">Student Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// No logic needed for static landing page
</script>

<style scoped>
.welcome-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #3498db 0%, #8e44ad 100%);
}

.welcome-card {
  background: #fff;
  padding: 3rem 2.5rem;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

h1 {
  margin-bottom: 1.2rem;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: bold;
}

.subtitle {
  color: #7f8c8d;
  margin-bottom: 2.2rem;
  font-size: 1.1rem;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.role-btn {
  display: block;
  padding: 0.9rem 0;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  color: #fff;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.08);
}

.lecturer-btn {
  background: #3498db;
}

.lecturer-btn:hover {
  background: #217dbb;
}

.student-btn {
  background: #8e44ad;
}

.student-btn:hover {
  background: #6c3483;
}
</style>