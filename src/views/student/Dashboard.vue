<template>
  <div class="dashboard">
    <Navbar role="student" />
    <div class="container">
      <h1 class="page-title">Welcome, {{ studentName }}!</h1>
      <div class="section">
        <h2 class="section-title">Your Courses</h2>
        <table class="course-table" v-if="!loading && courses.length">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>CA</th>
              <th>Final</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in courses" :key="course.course_id">
              <td>{{ course.code }}</td>
              <td>{{ course.title }}</td>
              <td>{{ Number(course.ca_score ?? 0).toFixed(2) }}</td>
              <td>
                {{ course.final_exam !== undefined && course.final_exam !== null
                  ? Number(course.final_exam * 0.3).toFixed(2) 
                : 'N/A'
                }}</td>
              <td>{{ Number(course.total_score ?? 0).toFixed(2) }}</td>
              <td>
                <button class="view-marks-btn" @click="goToViewMarks(course.course_id)">
                  View Marks
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
const studentName = ref('Student')
const courses = ref([])
const error = ref('')
const loading = ref(true)

const goToViewMarks = (courseId) => {
  router.push({ path: '/student/view-marks', query: { courseId } })
}

onMounted(() => {
  // Get student ID and name from localStorage
  studentId.value = localStorage.getItem('studentId')
  studentName.value = localStorage.getItem('studentName') || 'Student'

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

    studentName.value = data.name || 'Student'
    courses.value = data.courses || []
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

.course-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: #fafbfc;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.04);
}

.course-table th,
.course-table td {
  padding: 14px 12px;
  text-align: left;
}

.course-table th {
  background: #3498db;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
}

.course-table tr:nth-child(even) {
  background: #f4f6f9;
}

.course-table tr:hover {
  background: #eaf3fb;
}

.empty-message {
  text-align: center;
  font-style: italic;
  color: #7f8c8d;
  margin-top: 2rem;
}

.error-message {
  color: #e74c3c;
  margin-top: -0.5rem;
  font-size: 14px;
}

.view-marks-btn {
  background: #2980b9;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
  margin-left: 8px;
}

.view-marks-btn:hover {
  background: #1c5d8c;
}
</style>