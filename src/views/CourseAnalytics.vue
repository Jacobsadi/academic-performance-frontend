<!-- <template>
  <div>
    <Navbar />
    <h2>Course Analytics</h2>
    <canvas ref="chartCanvas" width="400" height="400"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Chart from 'chart.js/auto'

const route = useRoute()
const courseId = route.params.id
const chartCanvas = ref(null)

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
      labels: labels,
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
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Student Scores Breakdown'
        }
      }
    }
  })
}

onMounted(fetchAnalytics)
</script> -->
<template>
  <div>
    <Navbar />
    <h2>Course Analytics</h2>
    <canvas ref="chartCanvas" width="400" height="400"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Chart from 'chart.js/auto'

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
        { label: 'CA Score', backgroundColor: '#4BC0C0', data: caScores },
        { label: 'Final Exam', backgroundColor: '#36A2EB', data: finalScores },
        { label: 'Total Score', backgroundColor: '#FF6384', data: totalScores },
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: 'Student Scores Breakdown' }
      }
    }
  })
}

onMounted(fetchAnalytics)
</script>
