<template>
  <div class="analytics-container">
    <Navbar />
    <h2 class="page-title">Course Analytics - ID: {{ courseId }}</h2>

    <div class="chart-card">
      <canvas ref="chartCanvas" width="400" height="400"></canvas>
    </div>
  </div>
</template>

<script setup>
import Chart from 'chart.js/auto'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'

const chartCanvas = ref(null)
const route = useRoute()
const courseId = route.params.id

const fetchAnalytics = async () => {
  const res = await fetch(`http://localhost:8085/lecturer/course/${courseId}/analytics`)
  const data = await res.json()

  const labels = data.map(s => s.name)
  const caScores = data.map(s => parseFloat(s.ca_score))
  const finalScores = data.map(s => parseFloat(s.final_exam || 0))
  const totalScores = data.map(s => parseFloat(s.total_score))

  new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'CA Score',
          backgroundColor: '#4BC0C0',
          data: caScores,
        },
        {
          label: 'Final Exam',
          backgroundColor: '#36A2EB',
          data: finalScores,
        },
        {
          label: 'Total Score',
          backgroundColor: '#FF6384',
          data: totalScores,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Student Scores Breakdown',
          font: {
            size: 18,
            weight: 'bold',
          },
        },
        legend: {
          position: 'bottom',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Score (%)',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Students',
          },
        },
      },
    },
  })
}

onMounted(fetchAnalytics)
</script>

<style scoped>
.analytics-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Segoe UI', sans-serif;
}

.page-title {
  font-size: 26px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.chart-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: auto;
}
</style>
