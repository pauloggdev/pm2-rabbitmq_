import Vue from 'vue'
import VueRouter from 'vue-router'

// Importe os componentes para as rotas
import Candidatura from '@/components/Candidatura.vue'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/candidatura',
    name: 'Candidatura',
    component: Candidatura
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

// Cria a instância do roteador
const router = new VueRouter({
  mode: 'history', // Remove o hash da URL
  routes
})

export default router
