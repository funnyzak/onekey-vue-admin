import request from '@/utils/request'

export default {
  /**
   * 权限列表
   * @param {number} page  页码
   */
  list(page, pageSize, searchKey) {
    return request({
      url: 'permission/list',
      method: 'get',
      params: {
        page: page,
        pageSize: pageSize || 15,
        key: searchKey || ''
      }
    })
  },
  /**
   * 权限检索
   * @param {number} page 页码
   * @param {string} key 关键词
   */
  search(page, key) {
    return request({
      url: 'permission/search',
      method: 'get',
      params: {
        page: page,
        key: key
      }
    })
  },
  /**
   * 添加权限
   * @param {Object} permission 权限
   */
  save(permission) {
    return request({
      url: 'permission/add',
      method: 'put',
      data: permission
    })
  },
  /**
   * 批量添加权限
   * @param {*} permissions  每行一个 每行格式如： table.list 列表显示
   */
  batchAdd(permissions) {
    return request({
      url: 'permission/batchadd',
      method: 'post',
      data: permissions
    })
  },
  /**
   * 更新权限
   * @param {Object} permission 权限
   */
  update(permission) {
    return request({
      url: 'permission/edit',
      method: 'post',
      data: permission
    })
  },
  /**
   * 删除权限
   * @param {number} id 权限id
   */
  delete(id) {
    return request({
      url: 'permission/' + id,
      method: 'delete'
    })
  }

}
