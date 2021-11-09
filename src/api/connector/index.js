import request from '@/utils/request'

export default {
  list(page, pageSize, searchKey) {
    return request({
      url: 'open/connector/list',
      method: 'get',
      params: {
        page: page,
        pageSize: pageSize || 15,
        key: searchKey || ''
      }
    })
  },
  simpleList() {
    return request({
      url: 'open/connector/simple/list',
      method: 'get'
    })
  },
  logList(page, pageSize, searchKey, connectorId) {
    return request({
      url: 'open/connector/log/list',
      method: 'get',
      params: {
        page: page,
        pageSize: pageSize || 15,
        connectorId: connectorId || null,
        key: searchKey || ''
      }
    })
  },
  save(connector) {
    return request({
      url: 'open/connector',
      method: 'put',
      data: connector
    })
  },
  update(connector) {
    return request({
      url: 'open/connector',
      method: 'post',
      data: connector
    })
  },
  delete(secretId) {
    return request({
      url: 'open/connector/' + secretId,
      method: 'get'
    })
  },
  reset(secretId) {
    return request({
      url: 'open/connector/reset/' + secretId,
      method: 'post'
    })
  },
  permissionInfoList() {
    return request({
      url: 'open/connector/permission/info/list',
      method: 'get'
    })
  }
}
