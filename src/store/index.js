import { createStore } from 'vuex'
import menu from "./menu";
import createPersistedstate from 'vuex-persistedstate'
export default createStore({
    plugins: [createPersistedstate({
        key: 'pz_vip',
    })],
    modules: {
        menu
    }
})