<template>
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="navbar-title">
      {{ role === 'student' ? 'Student Panel' : role === 'advisor' ? 'Advisor Panel' : role === 'admin' ? 'Admin Panel' : 'Lecturer Panel' }}
    </div>
    <div class="navbar-links">
      <template v-if="role === 'lecturer'">
        <router-link to="/lecturer/dashboard" class="nav-link">Dashboard</router-link>
        <span class="separator">|</span>
      </template>

      <template v-else-if="role === 'student'">
        <router-link to="/student/dashboard" class="nav-link">Dashboard</router-link>
        <span class="separator">|</span>
        <router-link to="/student/compare-marks" class="nav-link">Compare Marks</router-link>
        <span class="separator">|</span>
        <router-link to="/student/view-rank" class="nav-link">View Rank</router-link>
        <span class="separator">|</span>
        <router-link to="/student/view-average" class="nav-link">Class Average</router-link>
        <span class="separator">|</span>
        <router-link to="/student/what-if-tools" class="nav-link">What-If Tools</router-link>
        <span class="separator">|</span>
        <router-link to="/student/request-remarks" class="nav-link">Request Remarks</router-link>
        <span class="separator">|</span>
      </template>
      
      <template v-else-if="role === 'advisor'">
        <router-link to="/advisor/dashboard" class="nav-link">Dashboard</router-link>
        <span class="separator">|</span>
      </template>

      <template v-else-if="role === 'admin'">
        <router-link to="/admin/dashboard" class="nav-link">Dashboard</router-link>
        <span class="separator">|</span>
      </template>

      <a href="#" class="nav-link" @click.prevent="logout">Logout</a>
    </div>
  </nav>
</template>


<script setup>
import { useRouter } from 'vue-router'
import { defineProps } from 'vue'

const props = defineProps({
  role: {
    type: String,
    default: 'lecturer'
  }
})

const router = useRouter()
const logout = () => {
  localStorage.clear()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f4f4f4;
  padding: 12px 24px;
  font-family: 'Segoe UI', sans-serif;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.navbar-title {
  font-weight: bold;
  font-size: 18px;
  color: #2c3e50;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-link {
  text-decoration: none;
  color: #3498db;
  font-size: 14px;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #2980b9;
}

.separator {
  color: #aaa;
}
</style>