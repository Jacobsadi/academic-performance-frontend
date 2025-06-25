<template>
  <div class="dashboard">
    <Navbar role="lecturer"/>
    <div class="container">
      <h1 class="page-title">📚 Your Courses</h1>

      <!-- Course Creation Form -->
      <section class="form-section">
        <h2 class="section-title">➕ Add New Course</h2>
        <form @submit.prevent="createCourse" class="form">
          <div class="form-row">
            <div class="form-group">
              <label for="code">Course Code</label>
              <input
                id="code"
                v-model="newCourse.code"
                placeholder="e.g. CSCI101"
                :class="{ error: showError && !newCourse.code }"
              />
            </div>
            <div class="form-group">
              <label for="title">Course Title</label>
              <input
                id="title"
                v-model="newCourse.title"
                placeholder="e.g. Introduction to CS"
                :class="{ error: showError && !newCourse.title }"
              />
            </div>
          </div>
          <p v-if="showError" class="error-message">⚠️ Please fill in both fields.</p>
          <button type="submit" class="btn primary">Add Course</button>
        </form>
      </section>

      <!-- Course List -->
      <section class="course-list-section">
        <p v-if="courses.length === 0" class="empty-message">No courses found. Please add some.</p>
        <CourseList :courses="courses" @delete-course="deleteCourse" />
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import CourseList from '../components/CourseList.vue'
import Navbar from '../components/Navbar.vue'

const courses = ref([])
const newCourse = ref({ code: '', title: '' })
const showError = ref(false)

const fetchCourses = async () => {
  const lecturerId = localStorage.getItem('lecturerId')
  const res = await fetch(`http://localhost:8085/lecturer/courses?lecturer_id=${lecturerId}`)
  courses.value = await res.json()
}

const createCourse = async () => {
  showError.value = !newCourse.value.code || !newCourse.value.title
  if (showError.value) return

  const lecturerId = localStorage.getItem('lecturerId')
  const res = await fetch('http://localhost:8085/lecturer/course', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...newCourse.value, lecturer_id: lecturerId })
  })

  if (res.ok) {
    alert('Course added successfully!')
    newCourse.value = { code: '', title: '' }
    showError.value = false
    await fetchCourses()
  } else {
    const err = await res.json()
    alert(err.error || 'Failed to add course.')
  }
}

const deleteCourse = async (id) => {
  if (!confirm('Are you sure you want to delete this course?')) return

  const res = await fetch(`http://localhost:8085/lecturer/course/${id}`, {
    method: 'DELETE'
  })

  if (res.ok) {
    alert('Course deleted.')
    await fetchCourses()
  } else {
    const err = await res.json()
    alert(err.error || 'Failed to delete course.')
  }
}

onMounted(fetchCourses)
</script>

<style scoped>
.dashboard {
  background: #f4f6f9;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}

.container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: #ffffff;
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

.section-title {
  font-size: 20px;
  margin-bottom: 1rem;
  color: #34495e;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.form-group {
  flex: 1;
  min-width: 240px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dcdfe3;
  border-radius: 8px;
  font-size: 15px;
  transition: 0.2s;
}

input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  margin-top: -0.5rem;
  font-size: 14px;
}

.btn.primary {
  width: fit-content;
  padding: 10px 18px;
  background-color: #3498db;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  align-self: flex-start;
  transition: background-color 0.2s;
}

.btn.primary:hover {
  background-color: #2980b9;
}

.empty-message {
  text-align: center;
  font-style: italic;
  color: #7f8c8d;
  margin-top: 2rem;
}
</style>
