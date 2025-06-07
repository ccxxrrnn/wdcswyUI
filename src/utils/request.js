import axios from 'axios'

 // axios的配置文件, 可以在这里去区分开发环境和生产环境等全局一些配置
 // const devBaseUrl = 'http://api.k780.com/'
 // const proBaseUrl = 'http://xxxxx.com/'
 
 // process.env返回的是一个包含用户的环境信息,它可以去区分是开发环境还是生产环境
const BASE_URL = '/api' //请求接口url 如果不配置 则默认访问链接地址
const TIMEOUT = 50000 // 接口超时时间

var request = axios.create({
    baseURL:BASE_URL,//基准地址
    timeout:TIMEOUT
})
//拦截请求
request.interceptors.request.use((config)=>{
    return config
})
//拦截响应
request.interceptors.response.use((response)=>{
    return response
},function (error){
    //对响应的错误做点什么
    return Promise.reject(error);
}
)
 
export default request;

