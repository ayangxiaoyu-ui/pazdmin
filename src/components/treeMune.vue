<template>
    <template v-for="(item, index) in props.menuDate">
        <el-menu-item @click="handClick(item, `${props.index}-${item.meta.id}`)"
            v-if="!item.children || item.children.length == 0" :index="`${props.index}-${item.meta.id}`"
            :key="`${props.index}-${item.meta.id}`">
            <el-icon>
                <component :is='item.meta.icon'></component>
            </el-icon>
            <span>{{ item.meta.name }}</span>
        </el-menu-item>
        <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`"
            :key="`${props.index}-${item.meta.id}` - { index }">
            <template #title>
                <el-icon>
                    <component :is='item.meta.icon'></component>
                </el-icon>
                <span>{{ item.meta.name }}</span>
            </template>
            <tree-mune :menuDate="item.children" :index="`${props.index}-${item.meta.id}`"></tree-mune>
        </el-sub-menu>
    </template>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { defineProps } from 'vue'
import { useStore } from 'vuex'
const store = useStore();
const router = useRouter()
const props = defineProps(["menuDate", "index"])
console.log(props)
console.log(props.menuDate);
const handClick = (item, active) => {
    console.log("点击了" + active);

    store.commit('setActive', active)
    store.commit("addMunu", item.meta)
    router.push(item.meta.path)

}
</script>