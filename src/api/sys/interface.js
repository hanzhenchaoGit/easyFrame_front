import request from '@/utils/request'

export function saveData(data) {
  // const data = params
  return request({
    url: '/system/saveProxy',
    method: 'post',
    data
  })
}
export function get(page) {
  return request({
    url: '/system/getProxy',
    method: 'get',
    params: page
  })
}
export function del(uuid) {
  return request({
    url: '/system/delProxy',
    method: 'post',
    params: {
      'uuid': uuid
    }
  })
}
export function proxy(params) {
  return request({
    url: '/system/proxyExcute',
    method: 'get',
    params: params
  })
}

