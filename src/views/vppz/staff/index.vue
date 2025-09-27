<template>
    <pane-head :route="route"></pane-head>
    <div class="btns">
        <el-button type="primary" size="small" :icon="Plus" @click="open(null)">新增</el-button>
        <el-popconfirm confirm-button-text="是" cancel-button-text="否" :icon="InfoFilled" icon-color="#626AEF"
            title="确定删除吗？" @confirm="confirmEvent">
            <template #reference>
                <el-button type="danger" size="small" :icon="Delete">删除</el-button>
            </template>

        </el-popconfirm>
    </div>
    <el-table :data="tableData.list" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="id" prop="id"></el-table-column>
        <el-table-column label="昵称" prop="name"></el-table-column>
        <el-table-column label="头像" prop="avatar">
            <template #default="scope">
                <el-image :src="scope.row.avatar" style="width:100px;height:100px"></el-image>
            </template>
        </el-table-column>
        <el-table-column label="性别" prop="sex">
            <template #default="scope">
                {{ scope.row.sex == 1 ? '男' : '女' }}
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
    <el-dialog v-model="dialogVisible" title="陪护师添加" width="500" :before-close="beforeClose">
        <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name" placeholder="请输入昵称"></el-input>
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
                <el-button v-if="!form.avatar" type="primary" @click="dialogImgVisible = true">上传</el-button>
                <el-image v-else :src="form.avatar" style="width:100px;height:100px">
                </el-image>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex" placeholder="请选择性别">
                    <el-option label="男" value="1"></el-option>
                    <el-option label="女" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input-number v-model="form.age" :min="18" :max="50" @change="handleChange" />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="是否生效" prop="active">
                <el-radio-group v-model="form.active">
                    <el-radio value="1" size="large">失效</el-radio>
                    <el-radio value="2" size="large">生效</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="confirm(formRef)">确认</el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog :before-close="handleClose" title="选额图片" width="500" v-model="dialogImgVisible" style="width: 600px;">
        <div class="image-list">
            <div v-for="(item, index) in fileList" :key="index" class="img-box" @click="selectIndex = index">
                <div v-if="selectIndex == index" class="select">
                    <el-icon color="fff">
                        <check></check>
                    </el-icon>
                </div>
                <el-image :src="item.url" style="width:148px;height:148px"></el-image>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="dialogImgVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmImg()">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { InfoFilled, Plus, Delete } from '@element-plus/icons-vue'
import { getAvatar, createStaff, getStaffList, delStaff } from '../../../api'
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
const route = useRoute()
const paginationData = reactive({
    pageNum: 1,
    pageSize: 10
})
const fileList = ref([])
onMounted(() => {
    getAvatar().then(({ data }) => {
        fileList.value = data.data
        console.log(fileList.value)
    })
    getListData()
})
const dialogVisible = ref(false)
const dialogImgVisible = ref(false)
const selectIndex = ref(0)
const beforeClose = () => {
    dialogVisible.value = false
    formRef.value.resetFields()
}
const formRef = ref()
const form = reactive({
    id: '',
    name: '',
    active: 1,
    age: 18,
    sex: "",
    mobile: "",
    avatar: 0
})
const rules = reactive({
    name: [
        { required: true, trigger: 'blur', message: '请填写昵称' }
    ],
    avatar: [
        { required: true, message: '请选择头像' }
    ],
    sex: [
        { required: true, trigger: 'change', message: '请选择性别' }
    ],
    mobile: [
        { required: true, trigger: 'blur', message: '请填写手机号' }
    ]
})
function handleChange(value) {
    console.log(value);
}
const confirm = async (formEl) => {
    console.log(form.active);
    form.active = parseInt(form.active);
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            // valid是一个布尔值，表示表单是否通过验证：
            // 如果valid为true，表示表单验证通过。
            // 如果valid为false，表示表单验证未通过。
            // fields是一个对象，包含了所有未通过验证的字段和对应的错误信息。
            createStaff(form).then(({ data }) => {
                console.log(data, "[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]");
                beforeClose()
                getListData()
            })


        } else {
            console.log('error submit!', fields)
        }

    })
}
function confirmImg() {
    form.avatar = fileList.value[selectIndex.value].url
    console.log(form.avatar);

    dialogImgVisible.value = false
}
function open(rowData = {}) {
    dialogVisible.value = true
    //如果是编辑
    nextTick(() => {
        if (rowData) {
            Object.assign(form, rowData)
        }
    })

}
const handleSizeChange = (val) => {
    paginationData.pageSize = val
    getListData()
}
const handleCurrentChange = (val) => {
    paginationData.pageNum = val
    getListData()
}
//表格数据
//列表数据
const tableData = reactive(
    {
        list: [],
        total: 0
    }
)

const getListData = () => {
    getStaffList(paginationData).then(({ data }) => {
        console.log('data:', data);
        const { list, total } = data.data
        tableData.list = list
        tableData.total = total
        console.log(tableData, "ddddd");
    })
}

const selectTableData = ref([])

// 多选框变化时触发
const handleSelectionChange = (val) => {

    console.log(val, 'val');
    selectTableData.value = val.map(item => ({ id: item.id }))
}

// 确认删除
const confirmEvent = () => {
    if (!selectTableData.value.length) {
        ElMessage.warning('请选择至少一项数据')
        return
    }
    console.log('实际传参:', { id: selectTableData.value })
    delStaff({ id: selectTableData.value }).then(({ data }) => {
        if (data.code === 10000) {
            ElMessage.success('删除成功')
            getListData() // 刷新列表
        } else {
            ElMessage.error(data.message || '删除失败')
        }
    })

}
</script>

<style lang="less" scoped>
.btns {
    padding: 10px;
    background-color: #fff;
}

.image-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.img-box {
    position: relative;
}

.select {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 24px;
    height: 24px;
    background-color: #67c23a;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.el-image {
    margin-right: 10px;
    margin-bottom: 10px;
}
</style>