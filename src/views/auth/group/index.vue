<template>
    <pane-head :route="route"></pane-head>
    <div class="btns">
        <el-button type="primary" size="small" :icon="Plus" @click="open(null)">新增</el-button>
    </div>
    <el-table :data="tableData.list" style="width: 100%;">
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="昵称" prop="name"></el-table-column>
        <el-table-column label="菜单权限" prop="permissionName" width="500px"></el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button @click="open(scope.row)">提交</el-button>
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
            <el-form-item v-show="false" label="id" prop="id">
                <el-input v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请填写名称"></el-input>
            </el-form-item>
            <el-form-item label="权限" prop="permissions">
                <el-tree ref="treeRef" style="max-width: 600px" :load="loadNode" show-checkbox :data="permissionsData"
                    :default-checked-keys="defaultCheckedKeys" :default-expanded-keys="[2]" node-key="id" />
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
import { reactive, ref, onMounted, nextTick } from 'vue';
import { getMenu, setMenu, menuList } from '../../../api'
import { Plus } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';

const route = useRoute()
onMounted(() => {
    getMenu().then(({ data }) => {
        console.log(data)
        permissionsData.value = data.data
    })
    getListData()
})
//列表数据
const tableData = reactive(
    {
        list: [],
        total: 0
    }
)

const paginationData = reactive({
    pageNum: 1,
    pageSize: 10
})

const handleSizeChange = (val) => {
    paginationData.pageSize = val
    getListData()
}
const handleCurrentChange = (val) => {
    paginationData.pageNum = val
    getListData()
}

//弹窗显示
const open = (rowData = {}) => {
    dialogVisible.value = true
    nextTick(() => {
        if (rowData) {
            Object.assign(form, {
                id: rowData.id,
                name: rowData.name,
            })
            if (treeRef.value) {
                treeRef.value.setCheckedKeys(rowData.permission);
            }
            // treeRef.value.setCheckedKeys(rowData.permissions)
        }
    })
}
const getListData = () => {
    menuList(paginationData).then(({ data }) => {
        const { list, total } = data.data
        tableData.list = list
        tableData.total = total
        console.log(tableData, "ddddd");

    })
}


//弹窗实例
const formRef = ref()
//弹窗数据
let form = reactive({
    id: '',
    name: '',
    permissions: ''
})
//树形控件数据
const permissionsData = ref([])
//弹窗的显示与隐藏
let dialogVisible = ref(false)
//弹窗关闭的回调
const handleClose = () => {
    dialogVisible.value = false
    //重置表单
    formRef.value.resetFields()
    //tree选择重置
    treeRef.value.setCheckedKeys(defaultCheckedKeys)

}



//树形控件懒加载
const loadNode = (node, resolve) => {
    if (node.level === 0) {
        return resolve([{ id: 1, label: '一级 1' }, { id: 2, label: '一级 2', children: [] }]);
    }
}
//默认选中选项
const defaultCheckedKeys = [4, 5]
//树形控件实例
const treeRef = ref(null)

//表单验证
const rules = reactive({
    name: [{ required: true, trigger: 'blur', message: '请填写名称' }]
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
            const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
            setMenu({ name: form.name, permissions: permissions, id: form.id }).then(({ data }) => {
                getListData()
                handleClose()
            })
        } else {
            console.log('error submit!', fields)
        }

    })
}
</script>
<style lang="less" scoped>
.btns {
    padding: 10px 0px 10px 10px;
    background-color: #fff;
}
</style>>
