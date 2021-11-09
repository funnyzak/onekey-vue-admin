import request from '@/utils/request'

export default {
  /**
   * 配置列表
   * @param {number} page  页码
   */
  list(page, pageSize, searchKey) {
    return request({
      url: 'config/list',
      method: 'get',
      params: {
        page: page,
        pageSize: pageSize || 15,
        key: searchKey || ''
      }
    })
  },
  /**
   * 配置检索
   * @param {number} page 页码
   * @param {string} key 关键词
   */
  search(page, key) {
    return request({
      url: 'config/search',
      method: 'get',
      params: {
        page: page,
        key: key
      }
    })
  },
  /**
   * 添加配置
   * @param {Object} config 配置
   */
  save(config) {
    return request({
      url: 'config/add',
      method: 'post',
      data: config
    })
  },
  /**
   * 更新配置
   * @param {Object} config 配置
   */
  update(config) {
    return request({
      url: 'config/edit',
      method: 'post',
      data: config
    })
  },
  /**
   * 删除配置
   * @param {number} id 配置id     */
  delete(id) {
    return request({
      url: 'config/delete/' + id,
      method: 'get'
    })
  }
}
