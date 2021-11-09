<template>
  <div style="text-align:center;cursor:pointer" @click="getCode">{{ status }}</div>
</template>
<script>
import api from '@/api'
import * as validate from '@/utils/validate'

let codeInterval

export default {
  components: {},
  props: {
    // 获取验证码间隔
    interval: {
      required: false,
      default: 60,
      type: Number
    },

    // 手机号
    phoneNum: {
      required: false,
      default: '',
      type: String
    },
    // 用途
    use: {
      required: false,
      default: 'FORGET_PASSWORD',
      type: String
    },
    // 用户名
    username: {
      required: false,
      default: null,
      type: String
    }
  },
  data() {
    return {
      status: '获取验证码', // 按钮/状态显示
      leaveSecond: 0, // 剩余秒数
      sending: false // 发送状态
    }
  },
  created() {
    const cacheSecond = window.localStorage.getItem(`sms_code_${this.phoneNum}${this.use}`)
    if (cacheSecond !== null && parseInt(cacheSecond) > new Date().getTime() / 1000) {
      this.leaveSecond = parseInt(cacheSecond) - parseInt(new Date().getTime() / 1000)
      this.leaveSeconding()
      codeInterval = setInterval(this.leaveSeconding, 1000)
    }
  },
  destroyed() {
    if (codeInterval) window.clearInterval(codeInterval)
  },
  methods: {
    getCode() {
      if (this.leaveSecond > 0 || this.sending) return
      if (!validate.validateMobile(this.phoneNum)) {
        this.$message.error('请输入正确的手机号')
        return
      }
      this.sending = true
      this.status = '发送中..'
      api.Pm.sendSms(this.phoneNum, this.username, this.use)
        .then(() => {
          this.$notify({
            title: '成功',
            message: '验证码已发送',
            type: 'success'
          })
          this.sending = false
          this.leaveSecond = this.interval
          this.leaveSeconding()
          codeInterval = setInterval(this.leaveSeconding, 1000)
        })
        .catch(error => {
          this.status = '获取验证码'
          this.sending = false
          this.$message.error(error.message)
        })
    },
    leaveSeconding() {
      this.leaveSecond--
      this.status = this.leaveSecond > 0 ? `等待(${this.leaveSecond}秒)` : '获取验证码'
      window.localStorage.setItem(`sms_code_${this.phoneNum}${this.use}`, parseInt(new Date().getTime() / 1000) + this.leaveSecond)
      if (this.leaveSecond <= 0) {
        window.clearInterval(codeInterval)
      }
    }
  }
}
</script>
