<template>
    <el-menu :style="{ width: !isCollapsed ? '230px' : '64px' }" active-text-color="#ffd04b" background-color="#545c64"
        class="el-menu-vertical-demo" :default-active="menuActive" text-color="#fff" :collapse="isCollapsed">
        <p class="login-lg">{{ isCollapsed ? "DIDI" : "DIDI陪诊系统" }}</p>
        <treeMune :menuDate="menuDate" :index="1"></treeMune>
    </el-menu>
</template>
<script setup>
import treeMune from './treeMune.vue';
import { useRoute } from 'vue-router';
import { reactive, computed } from 'vue';
import { useStore } from 'vuex'

const route = useRoute();
console.log(route);

const store = useStore();
const isCollapsed = computed(() => store.state.menu.isCollapsed)

const menuDate = computed(() => store.state.menu.routerList)
console.log(menuDate, "menuDate");
//高亮菜单
const menuActive = computed(() => store.state.menu.menuActive)
console.log("1111111111111111111111");

console.log(menuActive, "menuActive");

</script>
<style lang="css" scoped>
.el-menu-vertical-demo {
    height: 100%;
}

.login-lg {
    font-size: 20PX;
    text-align: center;
    height: 50PX;
    line-height: 50PX;
    color: #fff;
}
</style>