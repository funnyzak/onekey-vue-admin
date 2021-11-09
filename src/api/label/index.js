import request from '@/utils/request'

export default {
  save(info, type) {
    return request({
      url: 'label',
      method: info.id && info.id !== null && info.id > 0 ? 'post' : 'put',
      data: info,
      params: {
        type: type
      }
    })
  },
  detail(id) {
    return request({
      url: 'label/' + id,
      method: 'get'
    })
  },
  remove(id, type) {
    return request({
      url: 'label/' + id,
      method: 'delete',
      params: {
        type: type
      }
    })
  },
  list(page, pageSize, query) {
    return request({
      url: 'label/list',
      method: 'get',
      params: Object.assign({
        page: page,
        pageSize: pageSize || 15,
        type: null,
        parentId: null,
        system: null,
        key: null
      }, query)
    })
  },
  simple(type) {
    return request({
      url: 'label/simple/list',
      method: 'get',
      params: {
        type
      }
    })
  }
}
