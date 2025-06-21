<!-- <template>
  <div>
    <Navbar />
    <h2>Export Course Results</h2>
    <button @click="downloadCSV">Download CSV</button>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'

const route = useRoute()
const courseId = route.params.id
const error = ref('')

const downloadCSV = async () => {
  try {
    const response = await fetch(`http://localhost:8085/lecturer/course/${courseId}/export`)
    if (!response.ok) throw new Error('Failed to export')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `course_${courseId}_results.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    error.value = err.message
  }
}

onMounted(downloadCSV)
</script> -->
<template>
  <div>
    <Navbar />
    <h2>Export Course Results</h2>
    <button @click="downloadCSV">Download CSV</button>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'

const route = useRoute()
const courseId = route.params.id
const error = ref('')

const downloadCSV = async () => {
  try {
    const response = await fetch(`http://localhost:8085/lecturer/course/${courseId}/export`)
    if (!response.ok) throw new Error('Export failed')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `course_${courseId}_results.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    error.value = err.message
  }
}

onMounted(downloadCSV)
</script>
