<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Student Login</h2>
      <input v-model="email" placeholder="Email" type="email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button :disabled="loading" @click="login">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const login = async () => {
  error.value = ''
  loading.value = true
  try {
    const res = await fetch('http://localhost:8085/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem('lecturerId', data.user.id)
      router.push('/lecturer/dashboard')
    } else {
      error.value = data.error || 'Login failed'
    }
  } catch (e) {
    error.value = 'Server unreachable'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f4f8;
}

.login-card {
  background-color: #fff;
  padding: 30px 25px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-card h2 {
  margin-bottom: 24px;
  color: #2c3e50;
}

.login-card input {
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.login-card input:focus {
  border-color: #3498db;
  outline: none;
}

.login-card button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-card button:disabled {
  background-color: #7fb3d5;
  cursor: not-allowed;
}

.login-card button:hover:not(:disabled) {
  background-color: #2980b9;
}

.error-message {
  margin-top: 10px;
  color: #e74c3c;
}
</style>
