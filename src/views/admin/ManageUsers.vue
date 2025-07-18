<template>
  <div class="manage-users-page">
    <div class="card">
      <div class="header">
        <h2 class="title">Manage Users</h2>
        <button class="back-btn" @click="goBack">← Back</button>
      </div>

      <table class="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
            <th>Reset Password</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <select v-model="user.role" @change="updateRole(user)">
                <option value="student">Student</option>
                <option value="advisor">Advisor</option>
                <option value="lecturer">Lecturer</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td>
              <button class="reset-btn" @click="resetPassword(user.id)">Reset</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const users = ref([])
const router = useRouter()

const fetchUsers = async () => {
  try {
    const res = await fetch('http://localhost:8085/users')
    if (!res.ok) throw new Error('Failed to fetch users')
    users.value = await res.json()
  } catch (error) {
    alert('Error loading users: ' + error.message)
  }
}

const updateRole = async (user) => {
  try {
    const res = await fetch(`http://localhost:8085/users/${user.id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: user.role })
    })
    if (!res.ok) throw new Error('Failed to update role')
  } catch (error) {
    alert('Error updating role: ' + error.message)
  }
}

const resetPassword = async (userId) => {
  const confirmReset = confirm('Reset this user password to default (password123)?');
  if (!confirmReset) return;

  try {
    const res = await fetch(`http://localhost:8085/users/${userId}/reset-password`, {
      method: 'PUT'
    });

    const contentType = res.headers.get("content-type");
    const data = contentType && contentType.includes("application/json")
      ? await res.json()
      : await res.text(); // fallback if not JSON

    if (!res.ok) throw new Error(data.message || data || 'Unknown error');

    alert(data.message || 'Password reset successfully!');
  } catch (error) {
    alert('Failed to reset password: ' + error.message);
  }
};


const goBack = () => {
  router.back()
}

onMounted(fetchUsers)
</script>

<style scoped>
.manage-users-page {
  padding: 2rem;
  background: #f4f6f9;
  min-height: 100vh;
  font-family: "Segoe UI", sans-serif;
}

.card {
  max-width: 1000px;
  margin: auto;
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 26px;
  font-weight: 600;
  color: #2c3e50;
}

.back-btn {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.back-btn:hover {
  background-color: #2980b9;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
}

.styled-table th,
.styled-table td {
  padding: 14px 12px;
  text-align: left;
  font-size: 14px;
}

.styled-table th {
  background: #3498db;
  color: #fff;
  font-weight: bold;
}

.styled-table tr:nth-child(even) {
  background: #f4f6f9;
}

.styled-table tr:hover {
  background: #eaf3fb;
  transition: background 0.3s ease;
}

.reset-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
}

.reset-btn:hover {
  background-color: #c0392b;
}

select {
  padding: 6px;
  border-radius: 6px;
  font-size: 13px;
}
</style>
