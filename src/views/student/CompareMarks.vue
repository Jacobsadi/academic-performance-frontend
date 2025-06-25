<template>
  <div class="dashboard">
    <Navbar role="student" />
    <div class="container">
      <h1 class="page-title">Coursemates Comparison</h1>

      <div class="section">
        <select v-model="selectedCourseId" @change="fetchComparisonData" class="styled-select">
          <option disabled value="">Select a course</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ course.code }} - {{ course.title }}
          </option>
        </select>
      </div>

      <div v-if="chartData.length">
        <h3>Marks Distribution</h3>
        <canvas ref="chartCanvas" width="600" height="300"></canvas>

        <table class="course-table">
          <thead>
            <tr><th>Student</th><th>Total Marks</th></tr>
          </thead>
          <tbody>
            <tr v-for="data in chartData" :key="data.student_id">
              <td>{{ data.label }}</td>
              <td>{{ data.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../../components/Navbar.vue'
import Chart from 'chart.js/auto'
import { nextTick } from 'vue'

const studentId = localStorage.getItem('studentId')
const courses = ref([])
const selectedCourseId = ref('')
const chartData = ref([])
const chartCanvas = ref(null)
let chartInstance = null

// Fetch enrolled courses on load
onMounted(async () => {
  const res = await fetch(`http://localhost:8085/student/${studentId}/courses`)
  courses.value = await res.json()
})

const fetchComparisonData = async () => {
  if (!selectedCourseId.value) return

  const res = await fetch(`http://localhost:8085/student/${studentId}/compare-marks/${selectedCourseId.value}`)
  const data = await res.json()
  data.sort((a, b) => b.total - a.total)
  chartData.value = data

  await nextTick()

  const ctx = chartCanvas.value.getContext('2d')

  // Destroy old chart if exists
  if (chartInstance) chartInstance.destroy()

  // Create new chart
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.label),
      datasets: [{
        label: 'Total Marks',
        data: data.map(d => d.total),
        backgroundColor: data.map(d => d.isSelf ? '#3498db' : '#bdc3c7')
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.parsed.y} marks`
          }
        }
      },
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  })
}
</script>

<style scoped>
.dashboard {
  background: #f4f6f9;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
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

canvas {
  margin-bottom: 2rem;
  max-width: 100%;
}

.styled-select {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  border: 1.5px solid #4dbeff;
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
  border-color: #000000;
  background: #eaf6ff;
}
</style>
