<template>
    <pane-head :route="route"></pane-head>
    <el-table :data="tableData.list" style="width: 100%;">
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="昵称" prop="name"></el-table-column>
        <el-table-column label="所属组别" prop="permissions_id" width="500px">
            <template #default="scope">
                {{ permissionsId(scope.row.permissions_id) }}
            </template>
        </el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="状态" prop="active">
            <template #default="scope">
                <el-tag :type="scope.row.active ? 'success' : 'danger'">{{ scope.row.active ? "正常" : '失效' }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time">
            <template #default="scope">
                <div class="flexBox">
                    <el-icon>
                        <Clock></Clock>
                    </el-icon>
                    <span style="margin-left: 10px;">{{ scope.row.create_time }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-info">
        <el-pagination v-model:current-page="paginationData.pageNum" :page-size="paginationData.pageSize"
            :background="false" layout="total, prev, pager, next" :total="tableData.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog v-model="dialogVisible" title="添加权限" width="500" :before-close="handleClose">
        <el-form label-width="100" label-position="left" :model="form" ref="formRef" :rules="rules">
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" disabled></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="菜单权限" prop="permissions_id">
                <el-select v-model="form.permissions_id" placeholder="请选择菜单权限" style="width:240px">
                    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="confirm(formRef)">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import { authAdmin, selectlist, menuList, updateUser } from '../../../api';
import { ref, reactive, onMounted } from 'vue';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';

const route = useRoute()

const paginationData = reactive({
    pageNum: 1,
    pageSize: 10
})
//列表数据
const tableData = reactive(
    {
        list: [],
        total: 0
    }
)

//弹窗的显示与隐藏
let dialogVisible = ref(false)

const handleSizeChange = (val) => {
    paginationData.pageSize = val
    getListData()
}
const handleCurrentChange = (val) => {
    paginationData.pageNum = val
    getListData()
}
onMounted(() => {
    console.log(paginationData.pageNum, typeof paginationData.pageNum); // 应该输出 1 number
    console.log(paginationData.pageSize, typeof paginationData.pageSize); // 应该输出 10 number

    authAdmin({
        pageNum: Number(paginationData.pageNum),
        pageSize: Number(paginationData.pageSize)
    }).then(({ data }) => {
        console.log(data, "Admin");
        const { list, total } = data.data
        list.forEach(el => {
            el.create_time = dayjs(el.create_time).format('YYYY-MM-DD')
        })
        tableData.list = list
        tableData.total = total
    })
    selectlist().then(({ data }) => {
        console.log(data, "selectlist");
        options.value = data.data
        console.log(options.value, "option");
    })
    getListData()
})
const options = ref([])
const permissionsId = (id) => {
    const data = options.value.find(el => el.id === id)
    return data ? data.name : '超级管理员'
}
//弹窗显示
const open = (row) => {
    console.log(row);
    dialogVisible.value = true
    Object.assign(form, { mobile: row.mobile, name: row.name, permissions_id: row.permissions_id })

}
//弹窗关闭的回调
const handleClose = () => {
    dialogVisible.value = false

}


//表单验证
const rules = {
    name: [{ required: true, message: '请输入昵称', trigger: 'blur' },],
    permissionsId: [{ required: true, message: '请选择菜单权限', trigger: 'blur' },]
}


//编辑表单
const formRef = ref()
const form = reactive({
    name: '',
    permissions_id: '',
})

//表单提交
const confirm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // valid是一个布尔值，表示表单是否通过验证：
            // 如果valid为true，表示表单验证通过。
            // 如果valid为false，表示表单验证未通过。
            // fields是一个对象，包含了所有未通过验证的字段和对应的错误信息。
            const { name, permissions_id } = form
            updateUser({ name: name, permissions_id: permissions_id }).then(({ data }) => {
                if (data.code === 10000) {
                    getListData()
                    handleClose()
                }

            })
        } else {
            console.log('error submit!', fields)
        }

    })
}


console.log(tableData);
const getListData = () => {
    menuList(paginationData).then(({ data }) => {
        const { list, total } = data.data
        tableData.list = list
        tableData.total = total
        console.log(tableData, "ddddd");

    })
}

</script>
<style lang="less" scoped>
.flexBox {
    display: flex;
    align-items: center;
}
</style>