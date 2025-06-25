<template>
  <div class="mark-updates-page">
    <div class="card">
      <div class="header">
        <h2 class="title">View Mark Updates</h2>
        <button class="back-btn" @click="goBack">← Back</button>
      </div>

      <table class="styled-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Component Name</th>
            <th>Mark Obtained</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mark, index) in marks" :key="mark.id">
            <td>{{ index + 1 }}</td>
            <td>{{ mark.student_name }}</td>
            <td>{{ mark.component_name }}</td>
            <td>{{ mark.mark_obtained }}</td>
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
const marks = ref([])

const fetchMarkUpdates = async () => {
  const res = await fetch('http://localhost:8085/mark-updates')
  marks.value = await res.json()
}

const goBack = () => {
  router.back()
}

onMounted(fetchMarkUpdates)
</script>

<style scoped>
.mark-updates-page {
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
</style>
