import request from '@/utils/request'

export function configJsonToFile(data) {
    return request({
        url: process.env.VUE_APP_BASE_API + '/api/configJsonToFile',
        method: 'get',
        responseType:'blob',
        params: {
            data: JSON.stringify(data)
        }
    })
}

export function getDeviceByPage(data) {
    return request({
        url: process.env.VUE_APP_BASE_API + '/api/devices',
        method: 'get',
        params: data
    })
}

export function addDevice(data) {
    return request({
        url: process.env.VUE_APP_BASE_API + '/api/device',
        method: 'post',
        data
    })
}

export function updateDevice(data) {
    return request({
        url: process.env.VUE_APP_BASE_API + '/api/device',
        method: 'put',
        data
    })
}

export function deleteDevice(id) {
    return request({
        url: process.env.VUE_APP_BASE_API + `/api/device/${id}`,
        method: 'delete'
    })
}