import request from '@/utils/request'

export default {
  save(info) {
    return request({
      url: 'cms/article',
      method: info.id && info.id !== null && info.id > 0 ? 'post' : 'put',
      data: info
    })
  },
  detail(id) {
    return request({
      url: 'cms/article/' + id,
      method: 'get'
    })
  },
  remove(id) {
    return request({
      url: 'cms/article/' + id,
      method: 'delete'
    })
  },
  list(page, pageSize, order, query) {
    return request({
      url: 'cms/article/list',
      method: 'get',
      params: Object.assign({
        page: page,
        pageSize: pageSize || 15,
        orderBy: null,
        orderDesc: true,
        typeList: null,
        addTimeStart: null,
        addTimeEnd: null,
        keyword: null,
        author: null,
        source: null,
        published: null
      }, order, query)
    })
  }
}
