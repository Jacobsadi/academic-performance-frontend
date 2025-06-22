import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '../views/WelcomePage.vue';
import CourseAnalytics from '../views/CourseAnalytics.vue';
import CourseDetails from '../views/CourseDetails.vue';
import ExportResults from '../views/ExportResults.vue';
import LecturerDashboard from '../views/LecturerDashboard.vue';
import LoginPage from '../views/LoginPage.vue';
import StudentDashboard from '../views/student/Dashboard.vue'

const routes = [
  { path: '/', component: WelcomePage },
  { path: '/lecturer', component: LoginPage },
  { path: '/lecturer/dashboard', component: LecturerDashboard, meta: { requiresAuth: true, role: 'lecturer' }},
  { path: '/lecturer/course/:id', component: CourseDetails, props: true },
  { path: '/lecturer/course/:id/analytics', component: CourseAnalytics, props: true },
  { path: '/lecturer/course/:id/export', component: ExportResults, props: true },

  { path: '/student', component: LoginPage},
  { path: '/student/dashboard', component: StudentDashboard, meta: { requiresAuth: true, role: 'student' }}
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const role = to.meta.role
  const userId = localStorage.getItem(role + 'Id')

  if (to.meta.requiresAuth && !userId) {
    alert('You must log in first.')

    if (role === 'student') {
      next('/student')
    } else if (role === 'lecturer') {
      next('/lecturer')
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router;
