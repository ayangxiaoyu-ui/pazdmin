const localData = localStorage.getItem('pz_vip')

const state = localData ? localData.menu : {
    isCollapsed: false,
    selectMunu: [],
    num: 0,
    routerList: [],
    menuActive: '1-1',
}
const mutations = {
    collapseMune(state) {
        state.isCollapsed = !state.isCollapsed
        console.log(state.isCollapsed);
    },
    addMunu(state, menu) {
        if (state.selectMunu.findIndex(item => item.path === menu.path) === -1) {
            console.log(menu, "========");
            state.selectMunu.push(menu)
        }
    },
    closeMune(state, menu) {
        const index = state.selectMunu.findIndex(item => item.name === menu.name)
        state.selectMunu.splice(index, 1)
    },
    dynamicMune(state, payload) {
        console.log(payload, "payload");

        function fixEmptyPath(routes) {
            routes.forEach(n => {
                if (n.path === '' && n.alias?.length) n.path = n.alias[0]
                if (n.children) fixEmptyPath(n.children)
            })
        }
        fixEmptyPath(payload)
        //使用glob导入文件
        const models = import.meta.glob('../views/**/**/*.vue')
        // console.log(models);
        // function routeSet(router) {
        //     router.forEach(item => {
        //         //判断没有子菜单，拼接路由数据
        //         if (!item.children) {
        //             const url = `../views/${item.path}/index.vue`
        //             //拿到获取的vue组件index
        //             console.log('url =', url)
        //             console.log('真实 keys 样例 =', Object.keys(models).slice(0, 3))
        //             console.log('models[url] =', models[url])
        //             // item.component = models[url]
        //             item.component = models[url]
        //             item.component = () => models[url]()
        //         } else {
        //             routeSet(item.children)
        //         }
        //         console.log(item.children, 'children');
        //     })
        // }

        // 递归时把父路径传下来
        function routeSet(routes, parentPath = '') {
            routes.forEach(item => {
                if (!item.children) {
                    // 把父路径拼进去
                    const full = parentPath ? `${parentPath}/${item.path}` : item.path
                    const url = `../views/${full}/index.vue`
                    console.log('url =', url)
                    console.log('真实 keys 样例 =', Object.keys(models).slice(0, 3))
                    console.log('models[url] =', models[url])
                    item.component = models[url]
                    item.component = () => models[url]()
                } else {
                    routeSet(item.children, item.path) // 把当前 path 作为 parent 继续下传
                }
            })
        }
        console.log("444444444444444");
        console.log('准备注册的路由：', JSON.stringify(payload, null, 2))
        routeSet(payload)
        state.routerList = payload
    }
    ,
    setActive(state, payload) {
        console.log(payload, "payload");

        state.menuActive = payload
        console.log(state.menuActive, "state.menuActive");

    }

}
export default {
    state, //为什么这个地方的state没有用state:state呢 因为es6的简写 当变量名和属性名一样的时候可以简写
    mutations
}