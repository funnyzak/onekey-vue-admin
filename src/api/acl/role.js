import request from '@/utils/request'

export default {
  /**
   * 角色列表
   * @param {number} page  页码
   */
  list(page, pageSize, searchKey) {
    return request({
      url: 'role/list',
      method: 'get',
      params: {
        page: page,
        pageSize: pageSize || 15,
        key: searchKey || ''
      }
    })
  },
  /**
   * 角色检索
   * @param {number} page 页码
   * @param {string} key 关键词
   */
  search(page, key) {
    return request({
      url: 'role/search',
      method: 'get',
      params: {
        page: page,
        key: key
      }
    })
  },
  /**
   * 添加角色
   * @param {Object} role 角色
   */
  save(role) {
    return request({
      url: 'role/add',
      method: 'put',
      data: role
    })
  },
  /**
   * 更新角色
   * @param {Object} role 角色
   */
  update(role) {
    return request({
      url: 'role/edit',
      method: 'post',
      data: role
    })
  },
  /**
   * 角色权限信息
   * @param {number} id 角色id
   */
  roleGrantInfo(id) {
    return request({
      url: 'role/permission/' + id,
      method: 'get'
    })
  },
  /**
   * 角色授权
   * @param {number} id 角色id
   * @param {Array} powers 权限
   */
  grant(id, powers) {
    return request({
      url: 'role/grant',
      method: 'post',
      data: {
        id: id,
        grantIds: powers
      }
    })
  },
  /**
   * 删除角色
   * @param {number} id 角色id
   */
  delete(id) {
    return request({
      url: 'role/' + id,
      method: 'delete'
    })
  }
}
