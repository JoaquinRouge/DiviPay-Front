import { createRouter, createWebHistory } from 'vue-router'

import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Register from '../components/Register.vue'
import GroupDetail from '../components/GroupDetail.vue'
import AddGroupMember from '../components/AddGroupMember.vue'
import Profile from '../components/Profile.vue'

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    { path: "/home", component: Home },
    { path: "/register", component: Register },
    {path: '/group/:id',component: GroupDetail},
    {path: '/friends',component: AddGroupMember},
    {path: '/profile',component: Profile}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router