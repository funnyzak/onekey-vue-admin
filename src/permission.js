import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getUser } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

function hasPermission(userPermissions, routePermissions) {
  if (!routePermissions) return true
  return userPermissions.some(p => routePermissions.indexOf(p) >= 0)
}
const whiteList = ['/login', '/auth-redirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar

  if (getUser() && store.getters.user.id <= 0) {
    store.commit('user/SAVE_LOGIN_USER', getUser())
  }

  if (getUser() && store.getters.user.id > 0) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (!store.state.permission.generateRoute) {
        store.dispatch('permission/GenerateRoutes', { permissions: store.getters.permissions }).then(() => { // 根据权限生成可访问的路由表
          router.addRoutes(store.getters.addRoutes) // 动态添加可访问路由表
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        })
      } else {
        if (hasPermission(store.getters.permissions, to.meta.permissions)) {
          next()
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
