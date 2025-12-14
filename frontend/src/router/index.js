import { createRouter, createWebHistory } from 'vue-router';
import { isLoggedIn } from '@/stores/auth.js';
import HomeView from '../views/HomeView.vue';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import OnboardingView from '../views/OnboardingView.vue';
import CvDetailView from '@/views/CvDetailView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home | UASCV'
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'About | UASCV'
      }
    },
    {
      path: '/auth/register',
      name: 'register',
      component: RegisterView,
      meta: {
        title: 'Register | UASCV'
      }
    },
    {
      path: '/auth/login',
      name: 'login',
      component: LoginView,
      meta: {
        title: 'Login | UASCV'
      }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: OnboardingView,
      meta: {
        title: 'Onboarding | UASCV', requiresAuth: true
      }
    },
    {
      path: '/onboarding/cv/:cvId',
      name: 'cvDetail',
      component: CvDetailView,
      meta: {
        title: 'Detail | UASCV', requiresAuth: true
      }
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
