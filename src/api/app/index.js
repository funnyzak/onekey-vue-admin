import request from '@/utils/request'

export default {
  imgBase64(base64Code) {
    return request({
      url: 'app/image/covert/byBase64',
      method: 'post',
      data: { base64Code }
    })
  },
  enumInfo(enumName, type = 1) {
    return request({
      url: 'app/common/enum/' + enumName,
      method: 'get',
      params: { type }
    })
  }
}
