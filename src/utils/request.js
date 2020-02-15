import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000, // request timeout
  // headers: {
  //   'Authorization': 'Bearer ' + getToken(),
  //   // 'Content-Type': "application/json;charset=utf-8",
  // },
})

service.interceptors.request.use(
  config => {

    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    for (var key in config.params){
        if (config.params[key] === ''){
            delete config.params[key]
        }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    console.log('--------------------')
    console.log(response)

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200 && response.status !== 201 && response.status !== 204 ) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return response
    }
  },
  error => {
    console.log(error.response)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    // if(error.response.status === 401){
    //   Message({
    //     message: "请求未授权",
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //   router.push('/401')
    // }
    // else if(error.response.status === 404){
    //   Message({
    //     message: "请求出错",
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //   router.push('/404')
    // }
    // else if(error.response.status === 400){
    //   Message({
    //     message: error.response.data.message,
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    // }
    // else if(error.response.status === 500){
    //   Message({
    //     message: error.response.data.message,
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    // }
    return Promise.reject(error)
  }
)

export default service
