import axios from 'axios'
import store from './../store'
import { Message } from 'element-ui'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_HOST, // api 的 base_url
  timeout: 5000, // request timeout
  withCredentials: true // 允许携带cookie
})
// 请求前拦截
// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    if (store.getters.user.userToken && store.getters.user.userToken.length > 0) {
      config.headers['X-Auth-Token'] = store.getters.user.userToken
    }
    // if (config.method === 'post') {
    //   config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    // }
    if (config.url.indexOf('metrics') >= 0) {
      return config
    }
    return config
  },
  error => {
    console.log('request error', error)
    return Promise.reject('请求超时')
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (
      response.config.url.indexOf('druid') > 0 ||
      response.config.url.indexOf('metrics') > 0
    ) {
      if (response.status === 200) {
        return Promise.resolve(response.data)
      } else {
        return Promise.reject('请求失败!!!')
      }
    }
    // console.log('base http response:', response)
    if (response.data.operationState === 'SUCCESS') {
      // console.log('data request success', response.data.data)
      return Promise.resolve(response.data.data)
    } else {
      Message({
        message: response.data.errors[0],
        type: 'error',
        duration: 3 * 1000
      })
      if (response.data.errors[0] === '请登录') {
        store.dispatch('user/FedLogOut').then(() => {
          location.reload()
        })
      }
      return Promise.reject(response.data.errors[0])
    }
  },
  error => {
    if (error.response.status === 401 || error.response.status === 504) {
      store.dispatch('user/FedLogOut').then(() => {
        location.reload()
      })
    }
    switch (error.response.status) {
      case 401:
        return Promise.reject(new Error('无此权限'))
      case 403:
        return Promise.reject(new Error('禁止访问'))
      case 404:
        return Promise.reject(new Error('接口不存在'))
      case 500:
        return Promise.reject(new Error('接口发送了异常'))
      case 504:
        return Promise.reject(new Error('代理接口服务不可用'))
      case 502:
        return Promise.reject(new Error('接口代理出错'))
      default:
        return Promise.reject(new Error(error.response.data.message))
    }
  }
)

export default service
