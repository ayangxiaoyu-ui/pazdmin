<template>
    <el-row class="login-container" justify="center" align="middle">
        <el-card style="max-width: 480px;">
            <template #header>
                <div class="card-header">
                    <img :src="imgUrl" alt="">
                </div>
            </template>
            <div class="jump-link">
                <el-link type="primary" @click="handChange">{{ fromType ? "返回登录" : "注册账号" }} </el-link>
            </div>
            <el-form :model="loginFrom" style="max-width:600px" :rules="rules" ref="ruleFormRef">
                <el-form-item prop="userName">
                    <el-input v-model="loginFrom.userName" placeholder="手机号" :prefix-icon="UserFilled"></el-input>
                </el-form-item>
                <el-form-item prop="passWord">
                    <el-input v-model="loginFrom.passWord" placeholder="密码" :prefix-icon="Lock"></el-input>
                </el-form-item>
                <el-form-item v-if="fromType" prop="validCode">
                    <el-input v-model="loginFrom.validCode" placeholder="验证码" :prefix-icon="Lock">
                        <template #append>
                            <el-button @click="changeCountDown()">{{ countDown.validText }}</el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width:100%" @click="submitFrom(ruleFormRef)">
                        {{ fromType ? "注册账号" : "登录" }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-row>
</template>
<script setup>
import { UserFilled, Lock } from '@element-plus/icons-vue';
import { reactive, ref, computed, toRaw } from 'vue';
import { getcode, UserAuthentication, login, permissionsc } from '../../api'
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'
//拿到store的实例
const store = useStore();
const router = useRouter()
const loginFrom = reactive({
    userName: '',
    passWord: '',
    validCode: ''
})
const countDown = reactive({
    validText: "发送验证码",
    time: 60
}
)

const fromType = ref(0)
//切换登录注册
const handChange = () => {
    fromType.value = fromType.value ? 0 : 1
}
const imgUrl = new URL("../../../public/login-head.png", import.meta.url).href

//账号验证规则
const validateUser = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入手机号'))
    } else {
        const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
        if (!phoneReg.test(value)) {
            callback(new Error('请输入正确的手机号'))
        } else {
            callback()
        }
    }
}
//密码验证
//rule :验证规则的配置对象
//value:当前验证的字段值
//callback:回调函数，用于返回验证结果
const validatePass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        const passReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
        passReg.test(value) ? callback() : callback(new Error('密码必须包含数字和字母，长度在6-16之间'))
    }
}

//表单验证
const rules = {
    userName: [{ validator: validateUser, trigger: 'blur' }],//trigger: 'blur' 失去焦点时触发
    passWord: [{ validator: validatePass, trigger: 'blur' }],
}

//发送验证码
let flag = false
const changeCountDown = () => {
    //如果已发送不处理
    if (flag) {
        return
    }
    //验证手机号
    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    //正则表达式的test()方法用于检测一个字符串是否匹配某个模式。它返回一个布尔值：如果匹配则返回true，否则返回false
    1
    if (!loginFrom.userName || !phoneReg.test(loginFrom.userName)) {
        return ElMessage({
            message: "Warning,this is a warning message.",
            type: "warning"
        }
        )
    }

    const time = setInterval(() => {
        if (countDown.time > 0) {
            countDown.time--
            countDown.validText = `剩余${countDown.time}秒`
        } else {
            countDown.time = 60
            countDown.validText = "发送验证码"
            clearInterval(time)
            flag = true
        }
    }, 1000)
    flag = true
    getcode({ tel: loginFrom.userName }).then(({ data }) => {
        if (data.code === 10000) {
            console.log(data, "发送成功")
        }

    })
}

const ruleFormRef = ref()
const routerList = computed(() => store.state.menu.routerList)

//提交表单
const submitFrom = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if (fromType.value) {
                //注册
                UserAuthentication(loginFrom).then(({ data }) => {
                    if (data.code === 10000) {
                        ElMessage.success("注册成功")
                        // console.log(data, "注册成功")
                        fromType.value = 0
                    }
                })
            } else {
                //登录
                login(loginFrom).then(({ data }) => {
                    if (data.code === 10000) {
                        ElMessage.success("登录成功")
                        console.log(data, "登录成功")
                        //将token和用户信息存储到浏览器
                        localStorage.setItem("pz_token", data.data.token)
                        localStorage.setItem("pz_userInfo", JSON.stringify(data.data.userInfo))
                        permissionsc().then(({ data }) => {
                            console.log(data, "权限");
                            store.commit('dynamicMune', data.data)
                            console.log("==========================");

                            console.log(routerList, "路由");
                            console.log(routerList.value);

                            toRaw(routerList.value).forEach(item => {//toRaw()将响应式对象转换为普通对象
                                router.addRoute("main", item)
                            })
                            router.push("/")
                        })

                    }
                })
            }
            // console.log(ruleFormRef, 'submit!')
        } else {
            console.log('error submit!', fields)
        }
    })
}
</script>
<style scoped lang="less">
:deep(.el-card__header) {
    padding: 0
}

.login-container {
    height: 100%;

    .card-header {
        background-color: #899fe1;

        img {
            width: 430px;
        }
    }

    .jump-link {
        text-align: right;
        margin-bottom: 10px;
    }
}
</style>