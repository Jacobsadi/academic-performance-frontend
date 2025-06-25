<template>
  <div class="assign-lecturer-page">
    <div class="card">
      <div class="header">
        <h2 class="title">Assign Lecturer to Courses</h2>
        <button class="back-btn" @click="goBack">← Back</button>
      </div>

      <table class="styled-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Title</th>
            <th>Assigned Lecturer</th>
            <th>Change Lecturer</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course.id">
            <td>{{ course.code }}</td>
            <td>{{ course.title }}</td>
            <td>{{ course.lecturer_name || 'Unassigned' }}</td>
            <td>
              <select v-model="course.lecturer_id" @change="assignLecturer(course)">
                <option disabled value="">Select Lecturer</option>
                <option v-for="lecturer in lecturers" :key="lecturer.id" :value="lecturer.id">
                  {{ lecturer.name }}
                </option>
              </select>
            </td>
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
const courses = ref([])
const lecturers = ref([])

const fetchCourses = async () => {
  const res = await fetch('http://localhost:8085/courses')
  courses.value = await res.json()
}

const fetchLecturers = async () => {
  const res = await fetch('http://localhost:8085/lecturers')
  lecturers.value = await res.json()
}

const assignLecturer = async (course) => {
  const res = await fetch(`http://localhost:8085/courses/${course.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lecturer_id: course.lecturer_id })
  })

  if (res.ok) {
    alert('Lecturer assigned successfully!')
    fetchCourses()
  } else {
    alert('Failed to assign lecturer.')
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchCourses()
  fetchLecturers()
})
</script>

<style scoped>
.assign-lecturer-page {
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
  margin-bottom: 1.5rem;
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

select {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
