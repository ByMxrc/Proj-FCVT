import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import MenuEstudiante from '@/pages/MenuEstudiante.vue'
import MenuDocente from '@/pages/MenuDocente.vue'
import MenuAdmin from '@/pages/MenuAdmin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/menu-estudiante',
      name: 'MenuEstudiante',
      component: MenuEstudiante
    },
    {
      path: '/menu-docente',
      name: 'MenuDocente',
      component: MenuDocente
    },
    {
      path: '/menu-admin',
      name: 'MenuAdmin',
      component: MenuAdmin
    }
  ]
})

export default router
