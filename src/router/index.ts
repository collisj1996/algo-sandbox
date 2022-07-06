import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import PathFindingView from '../views/PathFindingView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/path-finding',
      name: 'path-finding',
      component: PathFindingView
    },
  ]
})

export default router
