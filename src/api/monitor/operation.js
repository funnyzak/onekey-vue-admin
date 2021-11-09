import request from '@/utils/request'

export default {
  /**
   * 操作日志列表
   * @param {number} page  页码
   */
  list(page, pageSize, searchKey) {
    return request({
      url: 'log/list',
      method: 'get',
      params: {
        page: page,
        pageSize: pageSize || 15,
        key: searchKey || ''
      }
    })
  }
}
