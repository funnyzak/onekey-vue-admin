
export const ArticleType = {
  NORMAL: '文章',
  VIDEO: '视频'
}

export const LabelInfoType = {
  ARTICLE_CATE: '文章分类',
  VIDEO_CATE: '视频分类'
}

export const dataRuleType = {
  ONLY_MINE: '仅自身相关数据',
  ONLY_MY_DEPARTMENT: '仅自身部门',
  MY_DEPARTMENT_AND_SUB: '自身部门和下级部门',
  ALL: '所有'
}

export const Member = {
  Gender: {
    MAN: '男',
    WOMEN: '女'
  }
}

const dataRuleModule = [
  {
    name: '演示模块1',
    modules: {
      DEMO_MODULE: '演示信息表'
    }
  },
  {
    name: '演示模块2',
    modules: {
      DEMO_MODULE2: '演示信息表2'
    }
  }
]

const dataRuleModuleList = (() => {
  let _modules = {}
  dataRuleModule.forEach(v => {
    _modules = Object.assign(_modules, v.modules)
  })
  return _modules
})()

export {
  dataRuleModule,
  dataRuleModuleList
}

export const pmServer = {
  JISU: '极速API',
  TENCENT: '腾讯服务',
  SELF: '自有平台'
}

export const pmPlatform = {
  CONSOLE: '管理后台',
  WEB_FRONT: 'Web客户端'
}

export const pmUse = {
  LOGIN: '用户登陆',
  REGISTER: 'Web客户端',
  FORGET_PASSWORD: '忘记密码'
}

export const pmType = {
  SMS: '短信',
  EMAIL: '邮件'
}

export const connectorType = {
  FRONT: '前端',
  CONSOLE: '后端'
}

export const connectorPower = {
  OPEN: '上下行不限制',
  REJECT: '上下行限制',
  DOWNSTREAM: '上行限制',
  UPSTREAM: '下行限制'
}

export const nationList = [
  '汉族',
  '回族',
  '维吾尔族',
  '藏族',
  '苗族',
  '彝族',
  '壮族',
  '布依族',
  '朝鲜族',
  '满族',
  '侗族',
  '瑶族',
  '白族',
  '土家族',
  '哈尼族',
  '哈萨克族',
  '傣族',
  '黎族',
  '傈僳族',
  '佤族',
  '畲族',
  '高山族',
  '拉祜族',
  '水族',
  '东乡族',
  '纳西族',
  '景颇族',
  '柯尔克孜族',
  '土族',
  '达斡尔族',
  '仫佬族',
  '羌族',
  '布朗族',
  '撒拉族',
  '毛南族',
  '仡佬族',
  '锡伯族',
  '阿昌族',
  '普米族',
  '塔吉克族',
  '怒族',
  '乌孜别克族',
  '俄罗斯族',
  '鄂温克族',
  '德昂族',
  '保安族',
  '裕固族',
  '京族',
  '塔塔尔族',
  '独龙族',
  '鄂伦春族',
  '赫哲族',
  '门巴族',
  '珞巴族',
  '基诺族',
  '蒙古族',
  '外国血统族'
]
