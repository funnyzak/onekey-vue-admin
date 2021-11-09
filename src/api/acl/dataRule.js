import request from '@/utils/request'

export default {
  /**
   * 数据权限列表
   * @param {number} page  页码
   */
  list(page, pageSize, module, dataRuleType) {
    return request({
      url: 'dataRule/list',
      method: 'get',
      params: {
        page: page,
        pageSize: pageSize || 15,
        module: module,
        dataRuleType: dataRuleType
      }
    })
  },
  /**
   * 添加数据权限
   * @param {Object} dataRule 权限
   */
  save(dataRule) {
    return request({
      url: 'dataRule/add',
      method: 'put',
      data: dataRule
    })
  },
  /**
   * 更新权限
   * @param {Object} dataRule 权限
   */
  update(dataRule) {
    return request({
      url: 'dataRule/edit',
      method: 'post',
      data: dataRule
    })
  },
  /**
   * 删除权限
   * @param {number} id 权限id
   */
  delete(id) {
    return request({
      url: 'dataRule/' + id,
      method: 'delete'
    })
  },
  get(id) {
    return request({
      url: 'dataRule/' + id,
      method: 'get'
    })
  }

}
