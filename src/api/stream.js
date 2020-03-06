import request from '@/utils/request'

export function drop(params) {
  return request({
    url: process.env.VUE_APP_NGINX_SERVER_URL + '/control/drop/client?app=myapp&name='+ params.name +'&clientid=' + params.clientid,
    method: 'get'
  })
}