import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: get
  })
}

export function getRoles(query) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/api/roles',
    method: 'get',
    params: query
  })
}

export function addRole(data) {
  return request({
    url: process.env.VUE_APP_BASE_API + '/api/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: process.env.VUE_APP_BASE_API + `/api/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: process.env.VUE_APP_BASE_API + `/api/role/${id}`,
    method: 'delete'
  })
}
