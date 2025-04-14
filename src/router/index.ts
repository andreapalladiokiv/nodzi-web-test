import { createRouter, createWebHistory, useRouter } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { login, requestToken } from '@/utils/auth.ts'
import { useAuthStore } from '@/stores/user.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/callback',
      name: 'callback',
      component: {
        async setup() {
          const router = useRouter();
          const authStore = useAuthStore();
          const code = router.currentRoute.value.query.code as string;

          authStore.login(code)
          // return router.back()
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ],
})

export default router
