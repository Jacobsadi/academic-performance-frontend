<template>
  <div class="dashboard">
    <Navbar role="student" />
    <div class="container">
      <h1 class="page-title">Request Remark / Appeal</h1>

      <form @submit.prevent="submitRequest" class="remark-form">
        <label for="course">Select Course:</label>
        <select v-model="courseId" required>
          <option disabled value="">-- Select a course --</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ course.code }} - {{ course.title }}
          </option>
        </select>

        <label for="component">Select Component:</label>
        <select v-model="componentId" required>
          <option disabled value="">-- Select a component --</option>
          <option v-for="comp in components" :key="comp.id" :value="comp.id">
            {{ comp.name }}
          </option>
        </select>

        <label for="justification">Justification:</label>
        <textarea v-model="justification" required placeholder="Explain your reason..." rows="5" />

        <button type="submit" class="submit-btn">Submit Request</button>
      </form>

      <p v-if="message" class="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Navbar from '../../components/Navbar.vue'

const studentId = localStorage.getItem('studentId')
const courses = ref([])
const components = ref([])
const courseId = ref('')
const componentId = ref('')
const justification = ref('')
const message = ref('')

onMounted(async () => {
  const res = await fetch(`http://localhost:8085/student/${studentId}/courses`)
  courses.value = await res.json()
})

watch(courseId, async () => {
  if (!courseId.value) return
  const res = await fetch(`http://localhost:8085/course/${courseId.value}/components`)
  components.value = await res.json()
})

const submitRequest = async () => {
  const res = await fetch('http://localhost:8085/remark-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      student_id: studentId,
      course_id: courseId.value,
      component_id: componentId.value,
      justification: justification.value
    })
  })

  const data = await res.json()
  message.value = data.message || 'Submitted successfully.'
  justification.value = ''
  componentId.value = ''
  courseId.value = ''
}
</script>

<style scoped>
.dashboard {
  background: #f4f6f9;
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
}
.container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}
.page-title {
  text-align: center;
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}
.remark-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
select, textarea {
  padding: 10px;
  border-radius: 6px;
  border: 1.5px solid #ccc;
  font-size: 16px;
}
.submit-btn {
  padding: 12px;
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}
.submit-btn:hover {
  background: #2980b9;
}
.message {
  text-align: center;
  color: green;
  margin-top: 1rem;
}
</style>
