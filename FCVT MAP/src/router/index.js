import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import Menu from '@/components/Menu.vue';
import Register from '@/components/Register.vue';
import Recuperar from '@/components/Recuperar.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('@/components/Menu.vue')
  },
  {
    path: '/menudocente',
    name: 'MenuDocente',
    component: () => import('@/components/MenuDocente.vue')
  },
  {
    path: '/menuadmin',
    name: 'MenuAdmin',
    component: () => import('@/components/MenuAdmin.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/recuperar',
    name: 'Recuperar',
    component: Recuperar
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;