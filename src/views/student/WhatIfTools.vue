<template>
  <div class="dashboard">
    <Navbar role="student" />
    <div class="container">
      <h1 class="page-title">What-If Tool</h1>

      <select v-model="selectedCourseId" @change="fetchData" class="styled-select">
        <option disabled value="">Select a course</option>
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.code }} - {{ course.title }}
        </option>
      </select>

      <div v-if="components.length">
        <h2>Simulate Your Marks</h2>
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Max Mark</th>
              <th>Actual Mark</th>
              <th>What-If Mark</th>
              <th>Weight (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(comp, index) in components" :key="comp.id">
              <td>{{ comp.name }}</td>
              <td>{{ comp.max_mark }}</td>
              <td>{{ comp.mark_obtained }}</td>
              <td>
                <input type="number" v-model.number="comp.whatIfMark" :max="comp.max_mark" min="0" class="styled-input"/>
              </td>
              <td>
                <input type="number" v-model.number="comp.weight" min="0" max="100" class="styled-input"/>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Final Exam Simulation -->
        <div class="final-section">
          <h2>Final Exam Simulation (30%)</h2>
          <label for="finalMark">What-If Final Exam Mark (out of 100):</label>
          <input
            type="number"
            v-model.number="finalWhatIf"
            min="0"
            max="100"
            id="finalMark"
            class="styled-input"
          />
        </div>

        <!-- Projected Score -->
        <div class="result">
          <p><strong>Projected Coursework Score (70%):</strong> {{ projectedCoursework.toFixed(2) }} / 70.00</p>
          <p><strong>Projected Final Exam Score (30%):</strong> {{ projectedFinal.toFixed(2) }} / 30.00</p>
          <p><strong>Projected Total Score:</strong> {{ projectedTotal.toFixed(2) }} / 100.00</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Navbar from '../../components/Navbar.vue'

const studentId = localStorage.getItem('studentId')
const selectedCourseId = ref('')
const courses = ref([])
const components = ref([])
const finalWhatIf = ref(0)

onMounted(async () => {
  const res = await fetch(`http://localhost:8085/student/${studentId}/courses`)
  courses.value = await res.json()
})

const fetchData = async () => {
  const res = await fetch(`http://localhost:8085/student/${studentId}/course/${selectedCourseId.value}/marks`)
  const data = await res.json()

  components.value = data.components.map(comp => ({
    ...comp,
    whatIfMark: comp.mark_obtained,
    weight: comp.weight,
  }))

  finalWhatIf.value = data.final_exam ?? 0
}

const projectedCoursework = computed(() => {
  return components.value.reduce((sum, comp) => {
    const mark = comp.whatIfMark ?? 0
    const weight = comp.weight ?? 0
    const max = comp.max_mark || 1
    return sum + ((mark / max) * weight)
  }, 0)
})

const projectedFinal = computed(() => {
  return (finalWhatIf.value ?? 0) * 0.30
})

const projectedTotal = computed(() => {
  return projectedCoursework.value + projectedFinal.value
})
</script>

<style scoped>
.dashboard {
  background: #f4f6f9;
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
}
.container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
.page-title {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 2.5rem;
  color: #2c3e50;
}
table {
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
input[type='number'] {
  width: 80px;
}
.final-section {
  margin-top: 2rem;
}
.result {
  margin-top: 2rem;
  font-size: 18px;
  background: #f8fbff;
  padding: 1rem;
  border-radius: 10px;
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
  transition: border 0.2s;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.04);
  appearance: none;
}

.styled-select:focus {
  border-color: #217dbb;
  background: #eaf6ff;
}

.styled-input {
  width: 100%;
  max-width: 120px;
  padding: 12px 16px;
  border: 1.5px solid #3498db;
  border-radius: 8px;
  background: #f8fbff;
  font-size: 16px;
  color: #2c3e50;
  outline: none;
  transition: border 0.2s;
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.04);
  margin-bottom: 0.5rem;
}

.styled-input:focus {
  border-color: #217dbb;
  background: #eaf6ff;
}
</style>
