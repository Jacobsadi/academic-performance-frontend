<template>
  <div class="container">
    <Navbar />
    <h2 class="title">Course Details - ID: {{ courseId }}</h2>

    <section class="section">
      <h3>Students</h3>
      <ul>
        <li v-for="student in students" :key="student.id" class="student-item">
          {{ student.name }} ({{ student.matric_no }})
        </li>
      </ul>
    </section>

    <section class="section">
      <h3>Add Component</h3>
      <div class="form-group">
        <input v-model="newComponent.name" placeholder="Component Name" />
        <input v-model.number="newComponent.weight" placeholder="Weight" type="number" />
        <input v-model.number="newComponent.max_mark" placeholder="Max Mark" type="number" />
        <button @click="addComponent">Add</button>
      </div>
    </section>

    <section class="section" v-if="components.length">
      <h3>Enter Marks</h3>
      <div v-for="component in components" :key="component.id" class="component-block">
        <h4>{{ component.name }}</h4>
        <div
          v-if="marks[component.id]"
          v-for="student in students"
          :key="student.id"
          class="mark-row"
        >
          <label>{{ student.name }}:</label>
          <input type="number" v-model.number="marks[component.id][student.id]" />
        </div>
        <button @click="submitMarks(component.id)">Submit Marks</button>
      </div>
    </section>

    <section class="section">
      <h3>Final Exam</h3>
      <div v-for="student in students" :key="student.id" class="mark-row">
        <label>{{ student.name }}:</label>
        <input type="number" v-model.number="finalMarks[student.id]" />
      </div>
      <button @click="submitFinalExam">Submit Final Exam</button>
    </section>
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
const marks = ref({})
const finalMarks = ref({})

onMounted(async () => {
  const studentRes = await fetch(`http://localhost:8085/lecturer/course/${courseId}/students`)
  students.value = await studentRes.json()
  students.value.forEach(student => {
    finalMarks.value[student.id] = 0
  })

  const compRes = await fetch(`http://localhost:8085/lecturer/course/${courseId}/components`)
  components.value = await compRes.json()

  for (const component of components.value) {
    marks.value[component.id] = {}
    const markRes = await fetch(`http://localhost:8085/lecturer/component/${component.id}/marks`)
    const markData = await markRes.json()
    markData.forEach(entry => {
      marks.value[component.id][entry.student_id] = entry.mark_obtained
    })
    students.value.forEach(student => {
      if (marks.value[component.id][student.id] === undefined) {
        marks.value[component.id][student.id] = 0
      }
    })
  }

  const finalRes = await fetch(`http://localhost:8085/lecturer/course/${courseId}/final-exam`)
  const finalData = await finalRes.json()
  finalData.forEach(entry => {
    finalMarks.value[entry.student_id] = entry.mark
  })
})

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
    students.value.forEach(s => {
      marks.value[comp.id][s.id] = 0
    })
    newComponent.value = { name: '', weight: 0, max_mark: 100 }
  }
}

const submitMarks = async (componentId) => {
  for (const studentId in marks.value[componentId]) {
    await fetch(`http://localhost:8085/lecturer/component/${componentId}/mark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId,
        mark_obtained: marks.value[componentId][studentId]
      })
    })
  }
  alert('Marks submitted!')
}

const submitFinalExam = async () => {
  for (const studentId in finalMarks.value) {
    await fetch(`http://localhost:8085/lecturer/course/${courseId}/final-exam`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId,
        mark: finalMarks.value[studentId]
      })
    })
  }
  alert('Final exam marks submitted!')
}
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #2c3e50;
}

.section {
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.student-item {
  margin: 5px 0;
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

button:hover {
  background-color: #2980b9;
}

.component-block {
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #ffffff;
}

.mark-row {
  margin: 5px 0;
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
