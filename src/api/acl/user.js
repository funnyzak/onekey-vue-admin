import request from '@/utils/request'

export default {
  /**
   * 登录
   * @param {Object} loginForm 登录信息
   */
  login(username, password) {
    const data = {
      rememberMe: true,
      userName: username,
      password
    }
    return request({
      url: '/user/login',
      method: 'post',
      data
    })
  },
  /**
   * 用户列表
   * @param {number} page  页码
   */
  list(page, pageSize, searchKey) {
    return request({
      url: 'user/list',
      method: 'get',
      params: {
        page: page,
        pageSize: pageSize || 15,
        key: searchKey || ''
      }
    })
  },
  /**
   * 用户检索
   * @param {number} page 页码
   * @param {string} key 关键词
   */
  search(page, key) {
    return request({
      url: 'user/search',
      method: 'get',
      params: {
        page: page,
        key: key
      }
    })
  },
  /**
   * 获取我自己的信息
   */
  profile() {
    return request({
      url: 'user/profile',
      method: 'get'
    })
  },
  /**
   * 添加用户
   * @param {Object} user 用户
   */
  save(user) {
    return request({
      url: 'user/add',
      method: 'put',
      data: user
    })
  },
  /**
   * 修改当前登录用户的信息
   * @param {*} user
   * @returns
   */
  updateProfile(user) {
    return request({
      url: 'user/editprofile',
      method: 'post',
      data: user
    })
  },
  /**
   * 更新用户
   * @param {Object} user 用户
   */
  update(user) {
    return request({
      url: 'user/edit',
      method: 'post',
      data: user
    })
  },
  /**
   * 删除用户
   * @param {number} id 用户id
   */
  delete(id) {
    return request({
      url: 'user/' + id,
      method: 'delete'
    })
  },
  /**
   * 重置密码
   * @param {number} id 用户id
   * @param {string} name 用户名
   * @param {string} password 密码
   */
  resetPassword(id, name, password) {
    return request({
      url: 'user/settings/password',
      method: 'post',
      data: {
        id: id,
        name: name,
        password: password
      }
    })
  },
  /**
   * 授权信息
   * @param {string} type 类型(role/permission/branch)
   * @param {number} id 用户id
   */
  userGrantInfo(type, id) {
    return request({
      url: '/user/' + type + '/' + id,
      method: 'get'
    })
  },
  /**
   * 用户授权
   * @param {number} id 用户id
   * @param {string} type 类型(role/permission/branch)
   * @param {Array} powers 权限/角色
   */
  grant(id, type, powers) {
    return request({
      url: 'user/grant/' + type,
      method: 'post',
      data: {
        id: id,
        grantIds: powers
      }
    })
  },
  /**
   * 退出登录
   */
  logout() {
    return request({
      url: 'user/logout',
      method: 'get'
    })
  },
  /**
   * 获取我的权限列表
   * @returns
   */
  permissions() {
    return request({
      url: '/user/permissions',
      methods: 'get'
    })
  },
  /**
   * 用户直接权限列表(额外添加的权限，不包括角色权限)
   * @param {number} id
   * @return array
   */
  userDirectPermission(id) {
    return request({
      url: 'user/permission/direct/' + id,
      method: 'get'
    })
  },

  /**
   * @description 编辑用户直接权限
   * @param {*} uid
   * @param {*} permissionsList
   * @returns status
   */
  userGrantEdit(uid, permissionsList) {
    return request({
      url: 'user/grant/permission',
      method: 'post',
      data: {
        id: uid,
        grantIds: permissionsList
      }
    })
  },

  loginUserProfile(data) {
    return request({
      url: 'user/settings/profile',
      method: 'post',
      data: data
    })
  }
}
