import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import paneHead from './components/paneHead.vue'

import store from './store/index.js'


//刷新后动态路由
// const localData = localStorage.getItem('pz_vip')
// if (localData) {
//     store.commit('dynamicMune', JSON.parse(localData).menu.routerList)
//     store.state.menu.routerList.forEach(item => {
//         router.addRoute("main", item)
//     })
// }

//刷新后的动态路由添加
const localData = localStorage.getItem('pz_vip')
// console.log(localData);

if (localData) {
    store.commit('dynamicMune', JSON.parse(localData).menu.routerList)
    store.state.menu.routerList.forEach(item => {
        router.addRoute('main', item)
    }
    )
}

//路由拦截
router.beforeEach((to, from) => {
    const token = localStorage.getItem('pz_token')
    if (!token && to.path !== '/login') {
        return router.push('/login')
    } else if (token && to.path === '/login') {
        return router.push('/')
    } else {
        return true
    }
})

const app = createApp(App)
app.component('pane-head', paneHead)
//路由挂载
app.use(router)
app.use(store)
app.mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
