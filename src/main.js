import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import waves from '@/directive/waves/index.js'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import '@/styles/globle.css' // global css
import baseFunction from '@/utils/baseFunction'
import App from './App'
import router from './router'
import store from './store'
// import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control

import commonTable from '@/components/CommonTable/table'
import commonSelect from '@/components/Select'
import commonButton from '@/components/Button'
import commonUpload from '@/components/Upload'

import * as filters from './filters' // global filters
import request from '@/utils/request'

// axios 请求挂在到vue
Vue.prototype.$request = request
Vue.prototype.$Message = Element.Message
// 基础全局函数
Vue.use(baseFunction)
Vue.use(waves)
Vue.use(Element, {
  size: 'mini' // set element-ui default size
  // i18n: (key, value) => i18n.t(key, value)
})
Vue.component('common-button', commonButton)
// 封装表格组件
Vue.component('common-table', commonTable)
Vue.component('common-select', commonSelect)
Vue.component('common-upload', commonUpload)
Vue.prototype.baseUrl = 'http://' + location.host.replace(location.port, '9999')
Vue.prototype.defaultHeader = 'http://img3.imgtn.bdimg.com/it/u=2220182970,3184364485&fm=200&gp=0.jpg'
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 按钮权限控制指令 v-has permission="add"
Vue.directive('has', {
  bind: function(el, binding, vnode) {
    const roles = vnode.componentInstance.$store.getters.roles
    const permisssionStr = roles.map(role => role.permissions).toString()
    let hasPermission = false
    permisssionStr.split('::').forEach(per => {
      const routerName = per.split(':')[0].replace(',', '')
      const permissions = per.split(':')[1]
      if (routerName === vnode.componentInstance.$route.path.split('/')[2]) {
        permissions.split(',').forEach(persub => {
          if (persub === vnode.data.attrs.permission) {
            hasPermission = true
          }
        })
      }
    })
    if (!hasPermission) {
      el.parentNode.removeChild(el)
    }
  }
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  // i18n,
  template: '<App/>',
  components: { App }
})
