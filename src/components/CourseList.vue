<template>
  <div>
    <ul>
      <li v-for="course in courses" :key="course.id">
        <router-link :to="`/lecturer/course/${course.id}`">{{ course.code }} - {{ course.title }}</router-link>
        | <router-link :to="`/lecturer/course/${course.id}/analytics`">Analytics</router-link>
        | <router-link :to="`/lecturer/course/${course.id}/export`">Export</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps(['courses'])
</script>
