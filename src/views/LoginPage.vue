<template>
  <div class="login-container">
    <div class="login-card">
      <h2>{{ roleLabel }} Login</h2>

      <!-- Admin Login -->
      <template v-if="role === 'admin'">
        <input v-model="email" placeholder="Email" type="email" />
        <input v-model="password" type="password" placeholder="Password" />
      </template>

      <!-- Other roles (Student, Lecturer, Advisor) -->
      <template v-else-if="role === 'student'">
        <input v-model="matric" placeholder="Matric Number" type="text" />
        <input v-model="pin" type="password" placeholder="Secure PIN" />
      </template>

      <template v-else>
        <input v-model="email" placeholder="Email" type="email" />
        <input v-model="password" type="password" placeholder="Password" />
      </template>

      <button :disabled="loading" @click="login">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const role = ref(
  route.path.includes('lecturer')
    ? 'lecturer'
    : route.path.includes('advisor')
    ? 'advisor'
    : route.path.includes('admin')
    ? 'admin'
    : 'student'
)

const matric = ref('')
const pin = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const roleLabel = computed(() => {
  switch (role.value) {
    case 'lecturer': return 'Lecturer'
    case 'advisor': return 'Advisor'
    case 'admin': return 'Admin'
    default: return 'Student'
  }
})

onMounted(() => {
  const key = role.value + 'Id'
  if (localStorage.getItem(key)) {
    router.push(`/${role.value}/dashboard`)
  }
})

const login = async () => {
  error.value = ''
  loading.value = true

  const loginUrlMap = {
    student: '/login-student',
    lecturer: '/login-lecturer',
    advisor: '/login-advisor',
    admin: '/login-admin'
  }

  const payload =
    role.value === 'student'
      ? { matric: matric.value, pin: pin.value }
      : { email: email.value, password: password.value }

  try {
    const res = await fetch(`http://localhost:8085${loginUrlMap[role.value]}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem(`${role.value}Id`, data.user.id)
      router.push(`/${role.value}/dashboard`)
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
  background: linear-gradient(120deg, #3498db 0%, #8e44ad 100%);
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
  font-family: Roboto, sans-serif;
}

.login-card input {
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
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
