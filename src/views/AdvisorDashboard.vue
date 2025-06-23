<template>
  <div class="dashboard">
    <Navbar role="advisor" />
    <div class="container">
      <h1 class="page-title">🎓 Advisor Dashboard</h1>

      <section v-if="advisees.length === 0" class="empty-section">
        No advisees found.
      </section>

      <section v-else class="advisee-list">
        <div v-for="student in advisees" :key="student.id" class="advisee-card" :class="{ 'at-risk': student.gpa < 2.0 }">
          <h2>{{ student.name }} <span v-if="student.gpa < 2.0">⚠️ At Risk</span></h2>
          <p><strong>Matric:</strong> {{ student.matric }}</p>
          <p><strong>GPA:</strong> {{ student.gpa.toFixed(2) }}</p>
          <p><strong>Courses:</strong></p>
          <ul>
            <li v-for="course in student.courses" :key="course.course_id">
              {{ course.title }} - {{ course.mark }}%
            </li>
          </ul>

          <textarea v-model="student.note" placeholder="Private note or consultation summary..." />

          <button class="btn note-btn" @click="saveNote(student)">💾 Save Note</button>
        </div>

        <button class="btn export-btn" @click="exportReport">📄 Export Reports</button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Navbar from '../components/Navbar.vue'

const advisees = ref([])

const fetchAdvisees = async () => {
  const advisorId = localStorage.getItem('advisorId')
  try {
    const res = await fetch(`http://localhost:8085/advisor/advisees?advisor_id=${advisorId}`)
    const data = await res.json()
    advisees.value = data.map(a => ({ ...a, note: '' }))
  } catch (e) {
    alert('Failed to load advisees.')
  }
}

const saveNote = async (student) => {
  const res = await fetch(`http://localhost:8085/advisor/note`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      advisor_id: localStorage.getItem('advisorId'),
      student_id: student.id,
      note: student.note
    })
  })

  if (res.ok) {
    alert('Note saved.')
  } else {
    alert('Failed to save note.')
  }
}

const exportReport = () => {
  const csv = ['Name,Matric,GPA,Notes']
  advisees.value.forEach(a => {
    csv.push(`"${a.name}","${a.matric}",${a.gpa},"${a.note || ''}"`)
  })

  const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'student_reports.csv'
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(fetchAdvisees)
</script>

<style scoped>
.dashboard {
  background: #f7f9fb;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}

.container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.page-title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #34495e;
}

.advisee-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.advisee-card {
  padding: 1.2rem;
  border-radius: 12px;
  border: 1px solid #ddd;
  background: #fafafa;
}

.advisee-card.at-risk {
  border-color: #e74c3c;
  background-color: #fff0f0;
}

.advisee-card h2 {
  margin-bottom: 0.4rem;
}

textarea {
  width: 100%;
  min-height: 80px;
  margin-top: 0.5rem;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  font-size: 14px;
}

.btn {
  margin-top: 0.5rem;
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.note-btn {
  background-color: #3498db;
  color: white;
}

.note-btn:hover {
  background-color: #2980b9;
}

.export-btn {
  align-self: center;
  margin-top: 2rem;
  background-color: #27ae60;
  color: white;
}

.export-btn:hover {
  background-color: #1e8449;
}

.empty-section {
  text-align: center;
  color: #888;
  font-style: italic;
  margin-top: 2rem;
}
</style>
