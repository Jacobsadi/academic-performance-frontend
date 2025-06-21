<template>
  <nav style="padding: 10px; background: #f4f4f4; display: flex; justify-content: space-between">
    <strong>Lecturer Panel</strong>
    <div>
      <router-link to="/lecturer/dashboard">Dashboard</router-link> |
      <a href="#" @click.prevent="logout">Logout</a>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const logout = () => {
  localStorage.clear()
  router.push('/')
}
</script>
