import Layout from '../views/Main.vue'
import Login from '../views/login/index.vue'

import { createWebHistory, createRouter } from 'vue-router'
const localData = localStorage.getItem('pz_vip')


const routes = [
    {
        path: '/',
        component: Layout,
        name: 'main',
        redirect: to => {
            if (localData) {
                const child = JSON.parse(localData).menu.routerList[0].children
                if (child) {
                    return child[0].meta.path
                } else {
                    return JSON.parse(localData).menu.routerList[0].meta.path
                }
            } else {
                return '/'
            }
        },
        children: [
        ]
    },
    {
        path: '/login',
        component: Login
    },
]
const router = createRouter({
    routes,
    history: createWebHistory(),

})
export default router