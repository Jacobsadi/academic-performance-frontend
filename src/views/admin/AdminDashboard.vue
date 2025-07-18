<template>
  <div class="dashboard">
    <Navbar role="admin" />
    <div class="container">
      <h1 class="page-title">Welcome</h1>

      <!-- Section: Admin Tools -->
      <div class="section">
        <h2 class="section-title">Admin Tools</h2>
        <div class="card-grid">
          <router-link to="/admin/manage-users" class="tool-card">
            <h3>Manage Users</h3>
            <p>Add, edit, delete or view user accounts</p>
          </router-link>

          <router-link to="/admin/assign-lecturer" class="tool-card">
            <h3>Assign Lecturer</h3>
            <p>Assign lecturers to specific courses</p>
          </router-link>

          <router-link to="/admin/view-marks" class="tool-card">
            <h3>View Mark Updates</h3>
            <p>Monitor latest updates to student marks</p>
          </router-link>

          <router-link to="/admin/manage-enrollment" class="tool-card">
            <h3>Manage Student Enrollment</h3>
            <p>Enroll students to courses and manage records</p>
          </router-link>
        </div>
      </div>

      <!-- Optional: Future section -->
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
</script>

<style scoped>
.dashboard {
  background: #f4f6f9;
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
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

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 2rem;
}

.tool-card {
  flex: 1 1 250px;
  background: #f0f4f8;
  border-radius: 10px;
  padding: 20px;
  text-decoration: none;
  color: #2c3e50;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.tool-card:hover {
  background: #e3effc;
  transform: translateY(-2px);
}

.empty-message {
  text-align: center;
  font-style: italic;
  color: #7f8c8d;
  margin-top: 2rem;
}
</style>
