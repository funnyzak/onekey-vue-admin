import { setUser, removeUser, getUser } from '@/utils/auth'
import { strArrEquals } from '@/utils'
import api from '@/api'

const user = {
  namespaced: true,
  state: {
    uinfo: {
      name: '',
      id: 0,
      mobile: '',
      roles: [],
      permissions: [],
      userToken: ''
    }
  },

  mutations: {
    SAVE_LOGIN_USER: (state, user) => {
      state.uinfo = Object.assign({}, state.uinfo, user)
    },
    REMOVE_LOGIN_USER: state => {
      state.uinfo = {
        name: '',
        id: 0,
        mobile: '',
        roles: [],
        permissions: []
      }
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({
      commit,
      dispatch }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        api.User.login(username, userInfo.password)
          .then(data => {
            const loginUser = data.user
            loginUser.roles = data.roles
            loginUser.permissions = data.permissions
            loginUser.userToken = data.userToken

            commit('SAVE_LOGIN_USER', loginUser)
            setUser(loginUser)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 拉取赋值我的信息
    RefreshUserInfo({ dispatch, commit, state }) {
      if (!getUser()) return

      dispatch('GetUserInfo')
        .then(data => {
          const loginUser = data.user
          loginUser.roles = data.roles
          loginUser.permissions = data.permissions
          loginUser.userToken = data.userToken

          setUser(loginUser)

          // 检查用户权限是否变更，如变更则刷新页面
          if (!strArrEquals(state.uinfo.permissions, data.permissions)) {
            location.reload()
            return
          }
          commit('SAVE_LOGIN_USER', loginUser)
        })
        .catch(() => {
          dispatch('FedLogOut')
        })
    },
    // 获取用户信息
    GetUserInfo({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        api.User.profile()
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    LogOut({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {
        api.User.logout()
          .then(() => {
            commit('REMOVE_LOGIN_USER', '')
            removeUser()
            dispatch('permission/ClearRoutes', null, { root: true })

            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ dispatch, commit, state }) {
      return new Promise(resolve => {
        commit('REMOVE_LOGIN_USER', '')
        removeUser()
        dispatch('permission/ClearRoutes', null, { root: true })

        resolve()
      })
    }
  }
}

export default user
