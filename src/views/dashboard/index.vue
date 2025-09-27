<template>
    <pane-head :route="route"></pane-head>
    <el-card class="box-card">
        <div style="height:100px;">
            <div class="header">
                <el-image :src="user.user_img" class="img"> </el-image>
                <h1 class="name">{{ user.user_name }}</h1>
            </div>
        </div>

        <div class="bottom">
            <div><span>当前权限：{{ user.permission }}</span></div>
            <div><span>当前权限：{{ user.ip }}</span></div>
        </div>
    </el-card>
    <el-card class="box-card left">
        <div class="box">
            <div><img src="../../assets/待支付.png" /></div>
            <div>
                <h3>{{ types[0]?.num || 0 }}</h3>
                <span>{{ types[0]?.state || '' }}</span>
            </div>
        </div>
        <div class="box">
            <div><img src="../../assets/待服务订单.png" /></div>
            <div>
                <h3>{{ types[1]?.num || 0 }}</h3>
                <span>{{ types[1]?.state || '' }}</span>
            </div>
        </div>
        <div class="box">
            <div><img src="../../assets/已完成-02.png" /></div>
            <div>
                <h3>{{ types[2]?.num || 0 }}</h3>
                <span>{{ types[2]?.state || '' }}</span>
            </div>
        </div>
        <div class="box">
            <div><img src="../../assets/已取消@2x.png" /></div>
            <div>
                <h3>{{ types[3]?.num || 0 }}</h3>
                <span>{{ types[3]?.state || '' }}</span>
            </div>
        </div>
    </el-card>
    <div style=" margin-top:20px; margin-left:20px; background: #fff;">
        <Line :data="chartData" :options="options" />
    </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { getReport } from '../../api'
import { ref, reactive, onMounted } from 'vue';
import { Line } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title, Tooltip, Legend, LineElement,
    CategoryScale, LinearScale, PointElement
} from 'chart.js'
import { computed } from 'vue'

onMounted(() => {
    getReport().then(({ data }) => {
        console.log(data)
        types.value = data.data.types
        user.value = data.data.user
        typeList.value = data.data.typeList
        console.log(types.value, "types");
        console.log(user.value, "user");
        console.log(typeList.value, "typeList");
    })
})
ChartJS.register(
    Title, Tooltip, Legend, LineElement,
    CategoryScale, LinearScale, PointElement
)

const labels = computed(() => typeList.value.map(r => r.date))
const orderSum = computed(() => typeList.value.map(r => r.order_sum))
const orderMoney = computed(() => typeList.value.map(r => r.order_money))

const chartData = computed(() => ({
    labels: labels.value,
    datasets: [
        {
            label: '订单数量',
            data: orderSum.value,
            borderColor: '#3b82f6',
            backgroundColor: '#3b82f6',
            tension: 0.1
        },
        {
            label: '订单金额',
            data: orderMoney.value,
            borderColor: '#10b981',
            backgroundColor: '#10b981',
            tension: 0.1
        }
    ]
}))

const options = {
    responsive: true,
    plugins: {
        title: { display: true, text: '每日订单统计' }
    },
    scales: {
        y: {
            ticks: {
                stepSize: 10 // 步长为 10，可根据实际需求调整
            }
        }
    }
}
const typeList = ref([])
const types = ref([])
const user = ref([])


const route = useRoute()
</script>
<style scoped lang="less">
.header {
    width: 100%;
    height: 100%;
    float: left;
    border-bottom: 1px solid #eee;
}

.bottom {
    width: 100%;
    height: 100%;
    margin-top: 20px;

    span {
        color: #666;
        font-size: small;
    }

}

.box-card {
    width: 580px;
    height: 200px;
    float: left;
    margin: 20px;
}

.img {
    width: 100px;
    height: 100px;
    float: inherit;
}

.name {
    line-height: 100px;
}

.left {
    float: left;

    .box {
        display: inline-block;
        width: 130px;
        margin-left: 80px;
        margin-right: 50px;
        margin-bottom: 50px;

        div {
            display: inline-block;
            margin-left: 10px;

            span {
                color: #666;
                font-size: 12px;
            }
        }
    }
}
</style>