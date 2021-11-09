export default {
  appName: '中视协会员信息管理平台',
  baseApiHost: process.env.VUE_APP_BASE_API_HOST, // Api基础请求地址
  thirdAPI: {
    // 第三方配置
  },
  // 文件上传配置
  upload: {
    imgMaxSize: 4096, // kb
    imgAllowType: [{
      name: 'PNG',
      mime: 'image/png'
    },
    {
      name: 'JPG',
      mime: 'image/jpg'
    },
    {
      name: 'JPEG',
      mime: 'image/jpeg'
    },
    {
      name: 'BMP',
      mime: 'image/bmp'
    }
    ]
  }
}
