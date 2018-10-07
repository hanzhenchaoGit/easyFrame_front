import { constantRouterMap } from '@/router'
import { getRouters } from '@/utils/RouterUtils'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { user } = data
        const asyncRouterMap = getRouters(user.menus)
        asyncRouterMap.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTERS', asyncRouterMap)
        resolve()
      })
    }
  }
}

export default permission
