import { createRouter, createWebHistory } from 'vue-router';
import WelcomePage from '../views/WelcomePage.vue';
import CourseAnalytics from '../views/CourseAnalytics.vue';
import CourseDetails from '../views/CourseDetails.vue';
import ExportResults from '../views/ExportResults.vue';
import LecturerDashboard from '../views/LecturerDashboard.vue';
import LoginPage from '../views/LoginPage.vue';
import StudentDashboard from '../views/student/Dashboard.vue'
import AdvisorDashboard from '../views/AdvisorDashboard.vue';
import ViewMark from '../views/student/ViewMark.vue';
import CompareMarks from '../views/student/CompareMarks.vue';
import ViewRank from '../views/student/ViewRanks.vue';
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import ViewAverageCmp from '../views/student/ViewAverageCmp.vue';
import WhatIfTools from '../views/student/WhatIfTools.vue';
import RequestRemarks from '../views/student/RequestRemarks.vue';

const routes = [
  { path: '/', component: WelcomePage },
  { path: '/lecturer', component: LoginPage },
  { path: '/lecturer/dashboard', component: LecturerDashboard, meta: { requiresAuth: true, role: 'lecturer' }},
  { path: '/lecturer/course/:id', component: CourseDetails, props: true },
  { path: '/lecturer/course/:id/analytics', component: CourseAnalytics, props: true },
  { path: '/lecturer/course/:id/export', component: ExportResults, props: true },

  { path: '/advisor/dashboard', component: AdvisorDashboard, meta: { requiresAuth: true, role: 'advisor' } }, 
  { path: '/advisor', component: LoginPage},

  { path: '/student', component: LoginPage},
  { path: '/student/dashboard', component: StudentDashboard, meta: { requiresAuth: true, role: 'student' }},
  { path: '/student/view-marks', component: ViewMark, meta: { requiresAuth: true, role: 'student' } },
  { path: '/student/compare-marks', component: CompareMarks, meta: { requiresAuth: true, role: 'student' } },
  { path: '/student/view-rank', component: ViewRank, meta: { requiresAuth: true, role: 'student' } },
  { path: '/student/view-average', component: ViewAverageCmp, meta: { requiresAuth: true, role: 'student' }},
  { path: '/student/what-if-tools', component: WhatIfTools, meta: { requiresAuth: true, role: 'student' }},
  { path: '/student/request-remarks', component: RequestRemarks, meta: { requiresAuth: true, role: 'student' }},

  { path: '/admin', component: LoginPage }, 
  { path: '/admin/dashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } }, 
  { path: '/admin/manage-users', name: 'ManageUsers', component: () => import('@/views/admin/ManageUsers.vue') }, 
  { path: '/admin/assign-lecturer', component: () => import('@/views/admin/AssignLecturer.vue') },
  { path: '/admin/view-marks', component: () => import('@/views/admin/ViewMarkUpdates.vue') },
  { path: '/admin/manage-enrollment', name: 'ManageEnrollment', component: () => import('@/views/admin/ManageEnrollment.vue') }



]

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
    } else if (role === 'advisor') {
      next('/advisor')
    } else if (role === 'admin') {
      next('/admin')
    } 
  } else {
    next()
  }
})

export default router;
