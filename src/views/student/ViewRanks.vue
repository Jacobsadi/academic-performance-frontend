<template>
  <div class="dashboard">
    <Navbar role="student" />
    <div class="container">
      <h1 class="page-title">Class Rank and Percentile</h1>
      <div class="section">
        <select v-model="selectedCourseId" @change="fetchRank" class="styled-select">
          <option disabled value="">Select a course</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ course.code }} - {{ course.title }}
          </option>
        </select>
        <div v-if="rankData" class="rank-section">
          <p><strong>Your Score (Total):</strong> {{ (rankData.score ?? 0).toFixed(2) }} / 100</p>
          <p><strong>Component Marks (70%):</strong> {{ (rankData.component_score ?? 0).toFixed(2) }} / 70</p>
          <p><strong>Final Exam (30%):</strong> {{ (rankData.final_exam_score ?? 0).toFixed(2) }} / 30</p>
          <p><strong>Rank:</strong> {{ rankData.rank }} of {{ rankData.total_students }}</p>
          <p><strong>Percentile:</strong> <span :style="{ color: getPercentileColor(rankData.percentile) }">{{ rankData.percentile }}%</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../../components/Navbar.vue'

const studentId = localStorage.getItem('studentId')
const courses = ref([])
const selectedCourseId = ref('')
const rankData = ref(null)

onMounted(async () => {
  const res = await fetch(`http://localhost:8085/student/${studentId}/courses`)
  courses.value = await res.json()
})

const fetchRank = async () => {
  const res = await fetch(`http://localhost:8085/student/${studentId}/rank/${selectedCourseId.value}`)
  rankData.value = await res.json()
}

// Function to color-code the percentile
const getPercentileColor = (percentile) => {
  if (percentile >= 90) return '#27ae60'    // green
  if (percentile >= 70) return '#2ecc71'    // light green
  if (percentile >= 50) return '#f1c40f'    // yellow
  if (percentile >= 30) return '#e67e22'    // orange
  return '#e74c3c'                          // red
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

.section {
  margin-bottom: 2.5rem;
}

.styled-select {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  border: 1.5px solid #3498db;
  border-radius: 8px;
  background: #f8fbff;
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  outline: none;
  transition: border 0.2s;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.04);
  appearance: none;
}

.styled-select:focus {
  border-color: #217dbb;
  background: #eaf6ff;
}

.rank-section {
  margin-top: 1.5rem;
  font-size: 18px;
  color: #34495e;
}
</style>
