<template>
  <div>
    <h2>Lecturer Login</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button :disabled="loading" @click="login">
      {{ loading ? 'Logging in...' : 'Login' }}
    </button>
    <p v-if="error" style="color: red">{{ error }}</p>
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
