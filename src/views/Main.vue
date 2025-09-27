<template>
    <div class="common-layout">
        <el-container>
            <Aside></Aside>
            <el-container>
                <el-header>
                    <Header />
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import Header from '../components/navHeader.vue'
import Aside from '../components/Aside.vue'
</script>

<style lang="less" scoped>
.common-layout {
    height: 100%;

    .el-container {
        height: 100%;
    }
}
</style>