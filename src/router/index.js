import { createRouter, createWebHistory } from 'vue-router'

import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Register from '../components/Register.vue'
import GroupDetail from '../components/GroupDetail.vue'

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    { path: "/home", component: Home },
    { path: "/register", component: Register },
    {path: '/group/:id',component: GroupDetail}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router