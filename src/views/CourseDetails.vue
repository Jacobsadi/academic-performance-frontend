<template>
  <div class="container">
    <Navbar />
    <h2 class="title">Course Details - ID: {{ courseId }}</h2>

    <!-- Enroll Student -->
    <div class="card">
      <h3>Enroll New Student</h3>
      <div class="form-group">
        <input v-model="newEnrollment.matric_no" placeholder="Student Matric No (e.g., S1001)" />
        <button @click="enrollStudent">Enroll</button>
      </div>
    </div>

    <!-- Student List -->
    <div class="card">
      <h3>Enrolled Students</h3>
      <ul>
        <li v-for="student in students" :key="student.id" class="student-item">
          {{ student.name }} ({{ student.matric_no }})
          <button @click="deleteStudent(student.id)" class="delete-btn">Remove</button>
        </li>
      </ul>
    </div>

    <!-- Add Assessment Component -->
    <div class="card">
      <h3>Add Assessment Component</h3>
      <div class="form-group">
        <input v-model="newComponent.name" placeholder="Component Name (e.g., Quiz)" />
        <input v-model.number="newComponent.weight" type="number" placeholder="Weight (%)" />
        <input v-model.number="newComponent.max_mark" type="number" placeholder="Max Mark (e.g., 20)" />
        <button @click="addComponent">Add Component</button>
      </div>
    </div>

    <!-- Marks Entry -->
    <div class="card" v-if="components.length">
      <h3>Continuous Assessment Marks</h3>
      <div v-for="component in components" :key="component.id" class="component-block">
        <h4>{{ component.name }} ({{ component.weight }}%)</h4>
        <table class="mark-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Mark (out of {{ component.max_mark }})</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td>{{ student.name }}</td>
              <td>
                <input
                  type="number"
                  :value="marks[component.id]?.[student.id] ?? 0"
                  @input="updateMark(component.id, student.id, $event.target.value)"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="submitMarks(component.id)" :disabled="loadingComponent === component.id">
          <span v-if="loadingComponent === component.id">Submitting...</span>
          <span v-else>Submit Marks</span>
        </button>
      </div>
    </div>

    <!-- Final Exam -->
    <div class="card">
      <h3>Final Exam Marks (30%)</h3>
      <table class="mark-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Final Mark</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td>{{ student.name }}</td>
            <td>
              <input type="number" v-model.number="finalMarks[student.id]" />
            </td>
          </tr>
        </tbody>
      </table>
      <button @click="submitFinalExam" :disabled="loadingFinalExam">
        <span v-if="loadingFinalExam">Submitting...</span>
        <span v-else>Submit Final Exam</span>
      </button>
    </div>

    <!-- Final Total Calculation -->
    <div class="card">
      <h3>Total Score Calculation</h3>
      <ul>
        <li v-for="student in students" :key="student.id">
          {{ student.name }} —
          CA: {{ caScores[student.id]?.toFixed(2) ?? 0 }} +
          Final: {{ finalMarks[student.id] || 0 }} (× 0.3) =
          <strong>{{ calculateTotal(student.id).toFixed(2) }}%</strong>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'

const route = useRoute()
const courseId = route.params.id

const students = ref([])
const components = ref([])
const newComponent = ref({ name: '', weight: 0, max_mark: 100 })
const newEnrollment = ref({ matric_no: '' })
const marks = ref({})
const finalMarks = ref({})
const caScores = ref({})

const loadingComponent = ref(null)
const loadingFinalExam = ref(false)

onMounted(async () => {
  await fetchStudents()
  await fetchComponents()
  await fetchFinalExamMarks()
  computeCA()
})

async function fetchStudents() {
  const res = await fetch(`http://localhost:8085/lecturer/course/${courseId}/students`)
  students.value = await res.json()
  students.value.forEach(s => {
    if (finalMarks.value[s.id] === undefined) finalMarks.value[s.id] = 0
  })
}

async function fetchComponents() {
  const res = await fetch(`http://localhost:8085/lecturer/course/${courseId}/components`)
  components.value = await res.json()

  for (const comp of components.value) {
    if (!marks.value[comp.id]) marks.value[comp.id] = {}

    const res = await fetch(`http://localhost:8085/lecturer/component/${comp.id}/marks`)
    const data = await res.json()

    data.forEach(entry => {
      marks.value[comp.id][entry.student_id] = entry.mark_obtained
    })

    students.value.forEach(s => {
      if (marks.value[comp.id][s.id] === undefined) marks.value[comp.id][s.id] = 0
    })
  }
}

async function fetchFinalExamMarks() {
  const res = await fetch(`http://localhost:8085/lecturer/course/${courseId}/final-exam`)
  const data = await res.json()
  data.forEach(entry => {
    finalMarks.value[entry.student_id] = entry.mark
  })
}

function updateMark(componentId, studentId, value) {
  if (!marks.value[componentId]) marks.value[componentId] = {}
  marks.value[componentId][studentId] = Number(value)
}

const addComponent = async () => {
  const res = await fetch(`http://localhost:8085/lecturer/course/${courseId}/component`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newComponent.value)
  })

  if (res.ok) {
    const comp = await res.json()
    components.value.push({ ...newComponent.value, id: comp.id })
    marks.value[comp.id] = {}
    students.value.forEach(s => (marks.value[comp.id][s.id] = 0))
    newComponent.value = { name: '', weight: 0, max_mark: 100 }
  }
}

const submitMarks = async (componentId) => {
  loadingComponent.value = componentId
  for (const studentId in marks.value[componentId]) {
    await fetch(`http://localhost:8085/lecturer/component/${componentId}/mark-and-notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId,
        mark_obtained: marks.value[componentId][studentId]
      })
    })
  }
  computeCA()
  loadingComponent.value = null
  alert('Marks submitted and emails sent!')
}

const submitFinalExam = async () => {
  loadingFinalExam.value = true
  for (const studentId in finalMarks.value) {
    await fetch(`http://localhost:8085/lecturer/course/${courseId}/final-exam-and-notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId,
        mark: finalMarks.value[studentId]
      })
    })
  }
  loadingFinalExam.value = false
  alert('Final exam marks submitted and emails sent!')
}

const enrollStudent = async () => {
  const res = await fetch(`http://localhost:8085/lecturer/course/${courseId}/enroll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matric_no: newEnrollment.value.matric_no })
  })

  if (res.ok) {
    alert('Student enrolled!')
    newEnrollment.value.matric_no = ''
    await fetchStudents()
  } else {
    const error = await res.json()
    alert(error.error || 'Enrollment failed.')
  }
}

const deleteStudent = async (studentId) => {
  const res = await fetch(`http://localhost:8085/lecturer/course/${courseId}/student/${studentId}`, {
    method: 'DELETE'
  })
  if (res.ok) {
    alert('Student removed!')
    await fetchStudents()
  }
}

function computeCA() {
  caScores.value = {}
  for (const student of students.value) {
    let total = 0
    for (const comp of components.value) {
      const obtained = marks.value[comp.id]?.[student.id] || 0
      total += (obtained / comp.max_mark) * comp.weight
    }
    caScores.value[student.id] = total
  }
}

function calculateTotal(studentId) {
  const ca = caScores.value[studentId] || 0
  const final = finalMarks.value[studentId] || 0
  return ca + final * 0.3
}
</script>

<style scoped>
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #2c3e50;
}

.card {
  margin-bottom: 30px;
  padding: 20px;
  background: #fdfdfd;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

input {
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 6px 12px;
  margin-top: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #999;
  cursor: wait;
}

button:hover:not(:disabled) {
  background-color: #2980b9;
}

.delete-btn {
  margin-left: 10px;
  background-color: crimson;
}

.mark-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.mark-table th,
.mark-table td {
  padding: 8px 12px;
  border: 1px solid #ddd;
  text-align: left;
}
</style>
