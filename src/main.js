import 'babel-polyfill'
import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import permissionDirective from './directive/permission'
import transferDomDirective from './directive/transferDom'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import './components/Map/AMap/use' // el amap init

import * as filters from './filters' // global filters

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value) // set element-ui il8n
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// register global class
import { logger } from './logger'
import * as utils from './utils'

Vue.prototype.$utils = utils
Vue.prototype.$log = logger

// register global directives
Vue.directive('permission', permissionDirective) // permission directive

Vue.directive('transfer-dom', transferDomDirective) // 穿梭到document指令

Vue.config.productionTip = false

store.dispatch('user/RefreshUserInfo')

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
