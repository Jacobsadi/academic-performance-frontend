<template>
  <div class="dashboard">
    <Navbar role="student" />
    <div class="container">
      <h1 class="page-title">Welcome, Student!</h1>
      <div class="section">
        <h2 class="section-title">Your Courses</h2>
        <ul class="course-list" v-if="!loading && courses.length">
          <li v-for="course in courses" :key="course.course_id">
            {{ course.code }} - {{ course.title }}<br />
            CA: {{ course.ca_score ?? 0 }} | Final: {{ course.final_exam ?? 'N/A' }} | Total: {{ course.total_score ?? 0 }}
          </li>
        </ul>
        <p v-if="!loading && !courses.length" class="empty-message">No courses enrolled yet.</p>
        <p v-if="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../../components/Navbar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const studentId = ref(null)
const courses = ref([])
const error = ref('')
const loading = ref(true)

onMounted(() => {
  // Get student ID from localStorage
  studentId.value = localStorage.getItem('studentId')

  if (!studentId.value) {
    // Not logged in, redirect to login
    router.push('/login/student')
  } else {
    fetchCoursesAndMarks()
  }
})

const fetchCoursesAndMarks = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`http://localhost:8085/student/${studentId.value}/courses-marks`)
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch courses')
    }

    courses.value = data
  } catch (err) {
    error.value = err.message || 'Server not reachable'
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
.dashboard {
  background: #f4f6f9;
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
}

.container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.page-title {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 2.5rem;
  color: #2c3e50;
}

.section-title {
  font-size: 20px;
  margin-bottom: 1rem;
  color: #34495e;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.form-group {
  flex: 1;
  min-width: 240px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dcdfe3;
  border-radius: 8px;
  font-size: 15px;
  transition: 0.2s;
}

input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  margin-top: -0.5rem;
  font-size: 14px;
}

.btn.primary {
  width: fit-content;
  padding: 10px 18px;
  background-color: #3498db;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  align-self: flex-start;
  transition: background-color 0.2s;
}

.btn.primary:hover {
  background-color: #2980b9;
}

.empty-message {
  text-align: center;
  font-style: italic;
  color: #7f8c8d;
  margin-top: 2rem;
}
</style>
