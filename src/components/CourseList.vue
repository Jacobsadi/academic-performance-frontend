<template>
  <div class="course-grid" role="list">
    <div
      v-for="course in courses"
      :key="course.id"
      class="course-card"
      role="listitem"
      aria-label="Course Card"
    >
      <h3 class="course-title">
        <span class="course-code">{{ course.code }}</span> - {{ course.title }}
      </h3>
      <div class="actions">
        <router-link :to="`/lecturer/course/${course.id}`" class="btn">View</router-link>
        <router-link :to="`/lecturer/course/${course.id}/analytics`" class="btn outline">Analytics</router-link>
        <router-link :to="`/lecturer/course/${course.id}/export`" class="btn outline">Export</router-link>
        <button
          @click="$emit('delete-course', course.id)"
          class="btn danger"
          aria-label="Delete course"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['courses'])
defineEmits(['delete-course'])
</script>

<style scoped>
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding-top: 1rem;
}

.course-card {
  padding: 1.5rem;
  background-color: #fff;
  border: 1px solid #e1e4e8;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.course-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.course-title {
  margin-bottom: 1rem;
  font-size: 18px;
  color: #2c3e50;
  font-weight: 600;
}

.course-code {
  font-weight: bold;
  color: #34495e;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn {
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  background-color: #3498db;
  color: #fff;
  transition: background-color 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn:hover {
  background-color: #2980b9;
}

.btn.outline {
  background-color: transparent;
  color: #3498db;
  border: 1px solid #3498db;
}

.btn.outline:hover {
  background-color: #3498db;
  color: #fff;
}

.btn.danger {
  background-color: #e74c3c;
  color: white;
}

.btn.danger:hover {
  background-color: #c0392b;
}
</style>
