<template>
    <div class="header-container ">
        <div class=" header-left flex">
            <el-icon class="icon" size="20" @click="store.commit('collapseMune')">
                <Fold />
            </el-icon>
            <ul class="flex">
                <li v-for="(item, index) in selectMunu" :key="`${item.path}-${index}`" class="tab flex"
                    :class="{ selected: route.path === item.path }">
                    <el-icon class="icon" size="12">
                        <component :is="item.icon"></component>
                    </el-icon>
                    <router-link class="text flex" :to="{ path: item.path }">{{ item.name }}</router-link>
                    <el-icon class="icon close" size="12" @click="closeMune(item, index)">
                        <Close />
                    </el-icon>
                </li>
            </ul>
        </div>
        <div class="header-right ">
            <el-dropdown @command="handleCommand">
                <div class="el-dropdown-link  flex" :style="`    align-items: center;`">
                    <el-avatar :src="userInfo.avatar"></el-avatar>
                    <p class=" user-name">{{ userInfo.name }}</p>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="cancel">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>

            </el-dropdown>
        </div>
    </div>

</template>
<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
//当前路由对象
const route = useRoute();
const router = useRouter();
//拿到store的实例
const store = useStore();
const selectMunu = computed(() => store.state.menu.selectMunu)

//头像
const userInfo = JSON.parse(localStorage.getItem('pz_userInfo'))

//关闭标签
const closeMune = (item, index) => {
    store.commit('closeMune', item)
    //删除的不是当前页
    if (route.path !== item.path) {
        return
    }
    const selectData = selectMunu.value

    //删除的是最后一个
    if (index === selectData.length) {
        if (!selectData.length) {
            router.push('/')
        } else {
            console.log(selectData[index - 1].path);
            router.push({ path: selectData[index - 1].path })
        }
    } else {
        router.push({ path: selectData[index + 1].path })
    }
}
const handleCommand = (command) => {
    if (command === 'cancel') {
        localStorage.removeItem('pz_token')
        localStorage.removeItem('pz_userInfo')
        localStorage.removeItem('pz_vip')

        window.location.href = window.location.origin//这行代码将会把当前页面的原始 URL 赋值给变量
    }
}
</script>
<style scoped lang="less">
.flex {
    display: flex;
    align-items: center;
    height: 100%;
}

.header-container {
    display: flex;
    align-content: center;
    justify-content: space-between;
    padding-right: 25px;
    height: 100%;
    background-color: #fff;

    .header-left {
        height: 100%;

        .icon {
            width: 45px;
            height: 100%;
        }

        .icon:hover {
            cursor: pointer;
            background: #f5f5f5;
        }

        .tab {
            padding: 0 10px;
            height: 100%;

            .text {
                margin: 0 5px;
            }

            .close {
                visibility: hidden;
            }

            &.selected {
                a {
                    color: #409eff;
                }

                i {
                    color: #409eff;
                }

                background-color: #fff;
            }
        }

        .tab:hover {
            background: #f5f5f5;

            .close {
                visibility: inherit;
                cursor: pointer;
                color: #000;
            }
        }
    }

    .header-right {
        .user-name {
            margin-left: 10px;
        }
    }

    a {
        height: 100%;
        color: #333;
        font-size: 15px;
    }
}
</style>