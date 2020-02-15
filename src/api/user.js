import request from '@/utils/request'
import qs from 'qs'

// export function login(data) {
//   return request({
//     url: '/user/login',
//     method: 'post',
//     data
//   })
// }

console.log(process.env.VUE_APP_UAA_API)
console.log(process.env.VUE_APP_BASE_API)

export function login(data) {
  return request({
    url: process.env.VUE_APP_UAA_API + '/oauth/token',
    method: 'post',
    transformRequest: [function (data, headers) {
      return qs.stringify(data);
    }],
    data
  })
}

export function getInfo(token) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/api/user/info',
    method: 'get',
    // params: { token }
  })
}

export function logout() {
  return request({
    url: process.env.VUE_APP_BASE_API + '/logout',
    method: 'post'
  })
}

export function getUserByPage(query){
  return request({
    url: process.env.VUE_APP_BASE_API + "/api/users",
    method: 'get',
    params: query
  })
}

export function addUser(data){
  return request({
    url: process.env.VUE_APP_BASE_API + "/api/user",
    method: 'post',
    data
  })
}

export function updateUser(id, data){
  return request({
    url: process.env.VUE_APP_BASE_API + `/api/user/${id}`,
    method: 'put',
    data
  })
}

export function deleteUser(id){
  return request({
    url: process.env.VUE_APP_BASE_API + `/api/user/${id}`,
    method: 'delete',
  })
}