import request from '@/utils/request'

export default {
  list(page, pageSize, query) {
    return request({
      url: 'pm/log/list',
      method: 'get',
      params: Object.assign({
        page: page,
        pageSize: pageSize || 15,
        uid_list: null,
        pm_type: null,
        receive: null,
        use: null,
        add_time_start: null,
        add_time_end: null,
        success: null,
        verify: null,
        server: null,
        ip: null
      }, query)
    })
  },
  /**
   * 发送短信
   *
   * @param {*} phone
   * @param {*} use 用途 FORGET_PASSWORD/REGISTER/LOGIN
   * @param {*} uname
   * @returns
   */
  sendSms(phone, uname, use) {
    return request({
      url: 'pm/send/sms',
      method: 'get',
      params: {
        uid: uname,
        phone: phone,
        use: use || 'FORGET_PASSWORD'
      }
    })
  },
  /**
   * 验证消息
   *
   * @param {string} [data={
   *     uid: null,
   *     receive: null,
   *     attach: null,
   *     code: null,
   *     type: 'SMS',
   *     use: 'FORGET_PASSWORD'
   *   }]
   * @returns
   */
  verify(data) {
    return request({
      url: 'pm/verify',
      method: 'get',
      params: Object.assign({
        uid: null,
        receive: null,
        attach: null,
        code: null,
        type: 'SMS',
        use: 'FORGET_PASSWORD'
      }, data)
    })
  }
}
