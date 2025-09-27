<template>
    <pane-head :route="route"></pane-head>
    <div class="order-list-page">
        <div class="header-bar">
            <h1>订单管理</h1>
            <el-button type="primary" @click="loadOrders">刷新</el-button>
        </div>

        <el-table :data="orders" stripe style="width: 100%; margin-top: 20px" v-loading="loading">
            <el-table-column prop="out_trade_no" label="订单号" width="180" />
            <el-table-column prop="client.name" label="客户姓名" width="120" />
            <el-table-column prop="service_name" label="服务名称" />
            <el-table-column prop="starttime" label="服务时间" width="120" />
            <el-table-column label="状态" width="100">
                <template #default="{ row }">
                    <el-tag :type="tagType(row.trade_state)">{{ row.trade_state }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template #default="{ row }">
                    <el-button size="small" @click="viewDetail(row)">查看</el-button>
                    <el-button size="small" type="primary" @click="markDone(row)"
                        v-if="row.trade_state === '待服务'">完成</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize"
            :current-page="pageNum" @current-change="handlePageChange" style="margin-top: 20px; text-align: right" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { OrderList } from '../../../api'
import { useRoute } from 'vue-router';

const route = useRoute()
const orders = ref([])
const loading = ref(false)
const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)

const loadOrders = async () => {
    loading.value = true
    try {
        const res = await OrderList({ pageNum: pageNum.value, pageSize: pageSize.value })
        if (res.code === 10000) {
            orders.value = res.data.list
            total.value = res.data.total
        } else {
            ElMessage.error('获取订单失败')
        }
    } catch (err) {
        ElMessage.error('网络错误')
    } finally {
        loading.value = false
    }
}

const handlePageChange = (page) => {
    pageNum.value = page
    loadOrders()
}

const tagType = (state) => {
    switch (state) {
        case '待服务': return 'warning'
        case '已完成': return 'success'
        default: return 'info'
    }
}

const viewDetail = (row) => {
    ElMessage.info(`查看订单：${row.out_trade_no}`)
}

const markDone = (row) => {
    ElMessage.success(`订单 ${row.out_trade_no} 已标记为完成`)
    row.trade_state = '已完成'
}

onMounted(() => {
    loadOrders()
})
</script>

<style scoped>
.order-list-page {
    padding: 20px;
    background-color: #f8fafc;
    min-height: 100vh;
}

.header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>