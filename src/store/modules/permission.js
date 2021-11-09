import { asyncRouterMap, constantRoutes } from '@/router'
import checkPermission from '@/utils/permission'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param permissions
 * @param route
 */
function hasPermission(permissions, route) {
  if (route.meta && route.meta.permissions) {
    return checkPermission(route.meta.permissions, permissions)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户权限的路由表
 * @param routes asyncRouterMap
 * @param permissions
 */
function filterAsyncRouter(routes, permissions) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, permissions)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  namespaced: true,
  state: {
    routes: constantRoutes,
    addRoutes: [],
    generateRoute: false
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
      state.generateRoute = true
    },
    CLEAR_ROUTES: (state) => {
      state.routes = []
      state.addRoutes = []
      state.generateRoute = false
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { permissions } = data
        const accessedRoutes = filterAsyncRouter(asyncRouterMap, permissions)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    },
    //  清除路由
    ClearRoutes({
      commit
    }) {
      commit('CLEAR_ROUTES')
    }
  }
}

export default permission
