import request from '@/utils/request'

export default {
  list(page, pageSize, order, query) {
    return request({
      url: 'open/member/list',
      method: 'get',
      params: Object.assign({
        page: page,
        pageSize: pageSize || 15,
        orderBy: null,
        orderDesc: true,
        registerIp: null,
        appId: null,
        realName: null,
        gender: null,
        username: null,
        idNum: null,
        phone: null,
        email: null
      }, order, query)
    })
  },
  save(info) {
    return request({
      url: 'open/member',
      method: info.id && info.id !== null && info.id > 0 ? 'post' : 'put',
      data: info
    })
  },
  detail(id) {
    return request({
      url: 'open/member/' + id,
      method: 'get'
    })
  },
  lock(id, locked) {
    return request({
      url: 'open/member/lock/' + id,
      method: 'post',
      params: {
        lock: locked
      }
    })
  },
  logout(appId, id) {
    return request({
      url: `open/member/logout/${appId}/${id}`,
      method: 'post'
    })
  },
  resetPwd(id, pwd) {
    return request({
      url: `open/member/reset/pwd/${id}`,
      method: 'post',
      params: {
        pwd
      }
    })
  },
  remove(id) {
    return request({
      url: 'open/member/' + id,
      method: 'delete'
    })
  }
}
