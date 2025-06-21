import { createRouter, createWebHistory } from 'vue-router';
import CourseAnalytics from '../views/CourseAnalytics.vue';
import CourseDetails from '../views/CourseDetails.vue';
import ExportResults from '../views/ExportResults.vue';
import LecturerDashboard from '../views/LecturerDashboard.vue';
import LoginPage from '../views/LoginPage.vue';

const routes = [
  { path: '/', component: LoginPage },
  { path: '/lecturer/dashboard', component: LecturerDashboard },
  { path: '/lecturer/course/:id', component: CourseDetails, props: true },
  { path: '/lecturer/course/:id/analytics', component: CourseAnalytics, props: true },
  { path: '/lecturer/course/:id/export', component: ExportResults, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
