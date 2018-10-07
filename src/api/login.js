import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/auth/logout'
  })
}

export function getUserInfo(username) {
  return request({
    url: '/user/info',
    method: 'get',
    params: {
      userName: username
    }
  })
}

