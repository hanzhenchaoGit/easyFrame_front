import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const userKey = 'user-key'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUser() {
  return Cookies.get(userKey)
}

export function setUser(user) {
  return Cookies.set(userKey, user)
}

export function removeUser() {
  return Cookies.remove(userKey)
}

