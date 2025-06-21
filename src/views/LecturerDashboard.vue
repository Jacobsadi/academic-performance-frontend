<template>
  <div>
    <Navbar />
    <h2>Your Courses</h2>
    <CourseList :courses="courses" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import CourseList from '../components/CourseList.vue'

const courses = ref([])

onMounted(async () => {
  const lecturerId = localStorage.getItem('lecturerId')
  const res = await fetch(`http://localhost:8085/lecturer/courses?lecturer_id=${lecturerId}`)
  courses.value = await res.json()
})
</script>
