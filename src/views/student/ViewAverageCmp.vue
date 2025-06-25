<template>
  <div class="dashboard">
    <Navbar role="student" />
    <div class="container">
      <h1 class="page-title">Class Average per Component</h1>
      <div class="section">
        <select v-model="selectedCourseId" @change="fetchClassAverages" class="styled-select">
          <option disabled value="">Select a course</option>
          <option v-for="course in courses" :key="course.id" :value="course.id">
            {{ course.code }} - {{ course.title }}
          </option>
        </select>
        <table v-if="averages.length" class="course-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Average Mark</th>
              <th>Max Mark</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="avg in averages" :key="avg.component">
              <td>{{ avg.component }}</td>
              <td>{{ avg.average_mark }}</td>
              <td>{{ avg.max_mark }}</td>
              <td>{{ avg.weight }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="!averages.length && selectedCourseId">No data found.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../../components/Navbar.vue'

const studentId = localStorage.getItem('studentId')
const selectedCourseId = ref('')
const courses = ref([])
const averages = ref([])

const fetchCourses = async () => {
  const res = await fetch(`http://localhost:8085/student/${studentId}/courses`)
  courses.value = await res.json()
}

const fetchClassAverages = async () => {
  const res = await fetch(`http://localhost:8085/student/${studentId}/course/${selectedCourseId.value}/class-averages`)
  averages.value = await res.json()
}

onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
/* Use styles similar to ViewRanks.vue for consistency */
.dashboard {
  background: #f4f6f9;
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
}
.container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: #fff;
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
}
.course-table {
  width: 100%;
  border-collapse: collapse;
  background: #fafbfc;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.04);
}
.course-table th, .course-table td {
  padding: 14px 12px;
  text-align: left;
}
.course-table th {
  background: #3498db;
  color: #fff;
  font-weight: 600;
}
.course-table tr:nth-child(even) {
  background: #f4f6f9;
}
</style>
