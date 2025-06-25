<template>
  <div class="dashboard">
    <Navbar role="student" />
    <div class="container">
      <h1 class="page-title">Component Marks</h1>
      <div class="section">
        <h2 class="section-title">Marks Breakdown</h2>
        <table class="course-table" v-if="!loading && components.length">
          <thead>
            <tr>
              <th>Component</th>
              <th>Obtained</th>
              <th>Max</th>
              <th>Weight</th>
              <th>Weighted Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="comp in components" :key="comp.name">
              <td>{{ comp.name }}</td>
              <td>{{ comp.mark_obtained }}</td>
              <td>{{ comp.max_mark }}</td>
              <td>{{ comp.weight }}</td>
              <td>{{ comp.weighted_score }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="!loading && !components.length" class="empty-message">No component marks found.</p>
        <p v-if="error" class="error-message">{{ error }}</p>
        <div v-if="!loading && components.length" class="total-section">
        <strong>
            Total Component Score: {{ Number(totalScore).toFixed(2) }} / 70.00
            <span style="margin-left:1em;">
            ({{ ((Number(totalScore) / 70) * 100).toFixed(2) }}%)
            </span>
        </strong>
        </div>
      </div>

      <!-- Final Marks Table -->
      <div class="section" style="margin-top: 2.5rem;">
        <h2 class="section-title">Final Exam Mark</h2>
        <table class="course-table" v-if="!loading">
          <thead>
            <tr>
              <th>Final Exam</th>
              <th>Weighted (30%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {{ finalExam !== null && finalExam !== undefined ? Number(finalExam).toFixed(2) : 'N/A' }}
              </td>
              <td>
                {{ finalWeighted !== null && finalWeighted !== undefined ? Number(finalWeighted).toFixed(2) : 'N/A' }}
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="!loading" class="total-section" style="margin-top:1.5rem;">
        <strong>
            Grand Total: {{
            (Number(totalScore ?? 0) + Number(finalWeighted ?? 0)).toFixed(2)
            }} / 100.00
        </strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../../components/Navbar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const components = ref([])
const totalScore = ref(0)
const error = ref('')
const loading = ref(true)
const finalExam = ref(null)
const finalWeighted = ref(null)

const studentId = localStorage.getItem('studentId')
const courseId = route.query.courseId // expects ?courseId=xx in URL

const fetchComponentMarks = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`http://localhost:8085/student/${studentId}/course/${courseId}/marks`)
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch marks')
    }
    components.value = data.components || []
    totalScore.value = data.total_score ?? 0
    finalExam.value = data.final_exam ?? null
    finalWeighted.value = data.final_exam_weighted ?? (data.final_exam !== undefined && data.final_exam !== null ? (Number(data.final_exam) * 0.3) : null)
  } catch (err) {
    error.value = err.message || 'Server not reachable'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!studentId || !courseId) {
    error.value = 'Missing student or course information.'
    loading.value = false
    return
  }
  fetchComponentMarks()
})
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

.total-section {
  margin-top: 2rem;
  text-align: right;
  font-size: 18px;
  color: #2c3e50;
}
</style>