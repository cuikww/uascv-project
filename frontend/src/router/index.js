import { createRouter, createWebHistory } from 'vue-router';
import { isLoggedIn } from '@/stores/auth.js';

// Phase 1 Views
import HomeView from '../views/HomeView.vue';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import OnboardingView from '../views/OnboardingView.vue';
import CvDetailView from '@/views/CvDetailView.vue';

// Phase 2 Views (Editor)
import EducationView from '../views/editor/EducationView.vue';
import ExperienceView from '../views/editor/ExperienceView.vue';
import SkillsView from '../views/editor/SkillsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Home | UASCV' }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'About | UASCV' }
    },
    {
      path: '/auth/register',
      name: 'register',
      component: RegisterView,
      meta: { title: 'Register | UASCV' }
    },
    {
      path: '/auth/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Login | UASCV' }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: OnboardingView,
      meta: { title: 'Dashboard | UASCV', requiresAuth: true }
    },
    {
      path: '/basicdetails/:cvId',
      name: 'cvDetail',
      component: CvDetailView,
      meta: { title: 'Info Dasar | UASCV', requiresAuth: true }
    },

    // --- ROUTES BARU (PHASE 2) ---
    {
      path: '/editor/:cvId/education',
      name: 'education',
      component: EducationView,
      meta: { title: 'Pendidikan | UASCV', requiresAuth: true }
    },
    {
      path: '/editor/:cvId/experience',
      name: 'experience',
      component: ExperienceView,
      meta: { title: 'Pengalaman | UASCV', requiresAuth: true }
    },
    {
      path: '/editor/:cvId/skills',
      name: 'skills',
      component: SkillsView,
      meta: { title: 'Keahlian | UASCV', requiresAuth: true }
    }
  ],
})

router.beforeEach((to) => {
  document.title = to.meta.title || 'UASCV'

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { path: "/auth/login"};
  }
})

export default router