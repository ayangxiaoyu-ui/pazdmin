//第一步引入
import axios from 'axios'
import { ElMessage } from 'element-plus'
//第二步创建axios实例
const request = axios.create({
    baseURL: 'https://v3pz.itndedu.com/v3pz',
    timeout: 10000,
})
//第三步请求拦截
// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('pz_token')
    //不需要token的接口
    const whileUrl = ['/login', "/get/code", '/user/authentication']
    if (token && !whileUrl.includes(config.url)) {
        config.headers['x-token'] = token;
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    //对接口异常的数据给用户提示
    if (response.data.code == -1) {
        ElMessage.error(response.data.msg)
    } else if (response.data.code == -2) {
        localStorage.removeItem('pz_token')
        localStorage.removeItem('pz_userInfo')
        localStorage.removeItem('pz_vip')
        window.location.href = window.location.origin//window.location.href当前页面的地址---window.location.origin当前页面的域名
    }
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});
export default request