import * as validate from './validate'

var validateMobile = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!validate.validateMobile(value)) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}
var validateEmail = (rule, value, callback) => {
  if (validate.validEmail(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的邮箱地址'))
  }
}

var validateId = (rule, value, callback) => {
  if (validate.validateId(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的身份证号'))
  }
}

export default {
  mobile: [
    {
      validator: validateMobile,
      trigger: 'blur'
    }
  ],
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur'
    }
  ],
  pid: [
    {
      required: true,
      message: '请输入PID',
      trigger: 'blur'
    }
  ],
  keyword: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur'
    }
  ],
  replay: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur'
    }
  ],
  title: [
    {
      required: true,
      message: '请输入标题',
      trigger: 'blur'
    }
  ],
  content: [
    {
      required: true,
      message: '请输入内容',
      trigger: 'blur'
    }
  ],
  realName: [
    {
      required: true,
      message: '请输入真实姓名',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      min: 8,
      max: 16,
      message: '请输入8到16位密码',
      trigger: 'blur'
    }
  ],
  rePassword: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      min: 8,
      max: 16,
      message: '请输入8到16位密码',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      required: true,
      message: '请输入手机号',
      trigger: 'blur'
    },
    {
      validator: validateMobile,
      trigger: 'blur'
    }
  ],
  email: [
    {
      required: true,
      message: '请输入电子邮箱',
      trigger: 'blur'
    },
    {
      validator: validateEmail,
      trigger: 'blur'
    }
  ],
  description: [
    {
      required: true,
      message: '请输入描述信息',
      trigger: 'blur'
    }
  ],
  groupId: [
    {
      type: 'number',
      required: true,
      message: '请选择数据分组',
      trigger: 'blur'
    }
  ],
  value: [
    {
      required: true,
      message: '请输入数据值',
      trigger: 'blur'
    }
  ],
  idCard: [
    {
      required: true,
      message: '身份证号不能为空',
      trigger: 'blur'
    },
    {
      validator: validateId,
      message: '请输入正确格式的身份证号',
      trigger: 'blur'
    }
  ]
}
