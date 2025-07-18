<template>
  <div class="enrollment-page">
    <div class="card">
      <div class="header">
        <h2 class="title">Manage Student Enrollment</h2>
        <button class="back-btn" @click="goBack">← Back</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="enrollStudent" class="enroll-form">
        <div class="form-row">
          <label>Student:</label>
          <select v-model="newEnrollment.student_id" required>
            <option disabled value="">Select Student</option>
            <option v-for="s in students" :key="s.id" :value="s.id">
              {{ s.name }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <label>Course:</label>
          <select v-model="newEnrollment.course_id" required>
            <option disabled value="">Select Course</option>
            <option v-for="c in courses" :key="c.id" :value="c.id">
              {{ c.title }}
            </option>
          </select>
        </div>

        <button class="submit-btn" type="submit">Enroll Student</button>
      </form>

      <!-- Enrollments List -->
      <h3 class="section-title">Enrolled Students</h3>
      <table class="styled-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in enrollments" :key="e.id">
            <td>{{ e.student_name }}</td>
            <td>{{ e.course_title }}</td>
            <td><button class="delete-btn" @click="deleteEnrollment(e.id)">Remove</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const students = ref([])
const courses = ref([])
const enrollments = ref([])

const newEnrollment = ref({
  student_id: '',
  course_id: ''
})

const fetchAll = async () => {
  const [sRes, cRes, eRes] = await Promise.all([
    fetch('http://localhost:8085/users'),
    fetch('http://localhost:8085/courses'),
    fetch('http://localhost:8085/enrollments')
  ])
  students.value = (await sRes.json()).filter(u => u.role === 'student')
  courses.value = await cRes.json()
  enrollments.value = await eRes.json()
}

const enrollStudent = async () => {
  const res = await fetch('http://localhost:8085/enrollments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newEnrollment.value)
  })
  const data = await res.json()
  alert(data.message || 'Enrollment complete')
  newEnrollment.value = { student_id: '', course_id: '' }
  await fetchAll()
}

const deleteEnrollment = async (id) => {
  const res = await fetch(`http://localhost:8085/enrollments/${id}`, {
    method: 'DELETE'
  })
  const data = await res.json()
  alert(data.message || 'Enrollment removed')
  await fetchAll()
}

const goBack = () => {
  router.back()
}

onMounted(fetchAll)
</script>

<style scoped>
.enrollment-page {
  padding: 2rem;
  background: #f4f6f9;
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
}

.card {
  max-width: 1000px;
  margin: auto;
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 26px;
  font-weight: 600;
  color: #2c3e50;
}

.back-btn {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.back-btn:hover {
  background-color: #2980b9;
}

.enroll-form {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.form-row {
  flex: 1;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #34495e;
}

select {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.submit-btn {
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  align-self: flex-start;
  margin-top: auto;
}

.submit-btn:hover {
  background-color: #27ae60;
}

.section-title {
  margin: 1rem 0;
  font-size: 20px;
  color: #34495e;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
}

.styled-table th,
.styled-table td {
  padding: 14px 12px;
  text-align: left;
  font-size: 14px;
}

.styled-table th {
  background: #3498db;
  color: #fff;
  font-weight: bold;
}

.styled-table tr:nth-child(even) {
  background: #f4f6f9;
}

.styled-table tr:hover {
  background: #eaf3fb;
  transition: background 0.3s ease;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.delete-btn:hover {
  background-color: #c0392b;
}
</style>
