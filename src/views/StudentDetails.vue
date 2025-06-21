<template>
  <div class="container">
    <Navbar />
    <h2>Edit Student: {{ student.name }}</h2>

    <section class="section">
      <h3>Student Info</h3>
      <input v-model="student.name" placeholder="Name" />
      <input v-model="student.matric_no" placeholder="Matric No" />
      <button @click="updateStudent">Update Info</button>
    </section>

    <section class="section" v-if="components.length">
      <h3>Component Marks</h3>
      <div v-for="comp in components" :key="comp.id" class="mark-row">
        <label>{{ comp.name }} (Max: {{ comp.max_mark }})</label>
        <input
          type="number"
          v-model.number="marks[comp.id]"
          :max="comp.max_mark"
        />
      </div>
      <button @click="submitMarks">Submit Marks</button>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'

const route = useRoute()
const router = useRouter()
const courseId = route.params.courseId
const studentId = route.params.studentId

const student = ref({ name: '', matric_no: '' })
const components = ref([])
const marks = ref({})

onMounted(async () => {
  await fetchStudent()
  await fetchComponentsAndMarks()
})

async function fetchStudent() {
  const res = await fetch(`http://localhost:8085/lecturer/course/${courseId}/students`)
  const data = await res.json()
  const target = data.find(s => s.id == studentId)
  if (target) student.value = target
}

async function fetchComponentsAndMarks() {
  const compRes = await fetch(`http://localhost:8085/lecturer/course/${courseId}/components`)
  components.value = await compRes.json()

  for (const comp of components.value) {
    const markRes = await fetch(`http://localhost:8085/lecturer/component/${comp.id}/marks`)
    const markData = await markRes.json()
    const mark = markData.find(m => m.student_id == studentId)
    marks.value[comp.id] = mark?.mark_obtained || 0
  }
}

async function updateStudent() {
  const res = await fetch(`http://localhost:8085/lecturer/student/${studentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: student.value.name,
      email: student.value.email,
      matric_no: student.value.matric_no
    })
  })

  if (res.ok) {
    alert('Student updated!')
    router.back()
  }
}

async function submitMarks() {
  for (const compId in marks.value) {
    await fetch(`http://localhost:8085/lecturer/component/${compId}/mark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId,
        mark_obtained: marks.value[compId]
      })
    })
  }
  alert('Marks saved!')
}
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.section {
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.mark-row {
  display: flex;
  gap: 12px;
  margin: 8px 0;
}

input {
  padding: 8px;
  font-size: 14px;
}

button {
  padding: 8px 14px;
  background-color: #3498db;
  color: white;
  border: none;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
}
</style>
