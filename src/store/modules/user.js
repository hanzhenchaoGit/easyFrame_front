import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '@/utils/auth'
import { Message } from 'element-ui'

const user = {
  state: {
    user: getUser(),
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    group: '',
    roles: [],
    phone: '',
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      if (avatar !== '') {
        state.avatar = this.baseUrl + '/file/getFile?fn=' + avatar
      }
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_GROUP: (state, group) => {
      state.group = group
    }
  },

  actions: {
    SetAvatar({ commit }, id) {
      return new Promise((resolve, reject) => {
        commit('SET_AVATAR', id)
      })
    },
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          if (response.success) {
            const data = response.data
            commit('SET_TOKEN', data.token)
            commit('SET_USER', data.userName)
            commit('SET_GROUP', data.group)
            commit('SET_NAME', data.name)
            commit('SET_PHONE', data.phone)
            setToken(data.token)
            setUser(data.userName)
            localStorage.setItem('username', data.userName)
            Message({
              message: '登陆成功',
              type: 'success'
            })
          } else {
            Message({
              message: '登陆失败:' + response.msg,
              type: 'error'
            })
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.user).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data

          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)

            commit('SET_AVATAR', data.headPortrait)
            // commit('Set')
          } else {
            reject('您未维护系统角色,请联系管理员添加系统角色！')
          }
          commit('SET_USER', data.userName)
          commit('SET_GROUP', data.group)
          commit('SET_NAME', data.name)
          commit('SET_PHONE', data.phone)
          // commit('SET_NAME', data.name)
          // commit('SET_AVATAR', data.avatar)
          // commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          // commit('SET_USER', '')
          commit('SET_NAME', '')
          commit('SET_GROUP', '')
          commit('SET_PHONE', '')
          removeToken()
          removeUser()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        // commit('SET_USER', '')
        commit('SET_GROUP', '')
        commit('SET_PHONE', '')
        removeToken()
        removeUser()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
