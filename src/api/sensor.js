import request from '@/utils/request'

export function getTempHumList(data) {
    return request({
        url: process.env.VUE_APP_BASE_API + '/api/tempAndHum',
        method: 'get',
        params: data
    })
}

export function getLastTempHumList(data) {
    return request({
        url: process.env.VUE_APP_BASE_API + '/api/nowTempAndHum',
        method: 'get',
        params: data
    })
}