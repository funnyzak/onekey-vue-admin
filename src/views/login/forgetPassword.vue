<template>
  <el-dialog
    :title="$t('login.forgetPassword')"
    :visible.sync="showDialog"
    width="380px"
    append-to-body
    @close="$emit('update:show', false)"
  >
    <el-form
      ref="editForm"
      :model="formData"
      :rules="formRules"
      style="width: 300px; margin-left:20px"
    >

      <el-form-item
        :label="$t('table.username')"
        prop="username"
      >
        <el-input
          v-model="formData.username"
          :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.username')}`"
        />
      </el-form-item>
      <el-form-item
        :label="$t('table.phoneNum')"
        prop="phoneNum"
      >
        <el-input
          v-model="formData.phoneNum"
          auto-complete="off"
          :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.phoneNum')}`"
        />
      </el-form-item>
      <el-form-item
        :label="$t('table.verifyCode')"
        prop="verifyCode"
      >
        <el-input v-model="formData.verifyCode" :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.verifyCode')}`" clearable>
          <template slot="append">
            <sms-code use="FORGET_PASSWORD" :username="formData.username" :phone-num="formData.phoneNum" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        :label="$t('table.newPassword')"
        prop="newPassword"
      >
        <el-input v-model="formData.newPassword" type="password" :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.newPassword')}`" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="submit_btn" @click="submitForm('editForm')">找回密码</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { SmsCode } from '@/views/components'
import rules from '@/utils/formRules'
import api from '@/api'

export default {
  name: 'ForgetPassword',
  components: { SmsCode },
  props: {
    /** 是否显示操作框 */
    show: {
      type: Boolean,
      default: false
    },
    /** 用户名 */
    username: {
      type: String,
      default: ''
    },
    /** 接收对象 */
    receive: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formRules: {
        username: [
          { required: true, message: `${this.$t('placeholder.pleaseInput')}${this.$t('table.username')}`, trigger: 'blur' }
        ],
        phoneNum: rules.phone,
        verifyCode: [
          { required: true, message: `${this.$t('placeholder.pleaseInput')}${this.$t('table.verifyCode')}`, trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: `${this.$t('placeholder.pleaseInput')}${this.$t('table.newPassword')}`, trigger: 'blur' },
          { min: 8, max: 24, message: '长度在 8 到 24 个字符', trigger: 'blur' }
        ]
      },
      formData: {
        username: '',
        phoneNum: '',
        verifyCode: '',
        newPassword: ''
      }
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    }
  },
  watch: {
    username: {
      deep: true,
      handler(val) {
        this.formData.username = val
      }
    }
  },
  mounted() {
    this.formData.username = this.username
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return

        api.Pm.verify({
          uid: this.formData.username,
          use: 'FORGET_PASSWORD',
          attach: this.formData.newPassword,
          receive: this.formData.phoneNum,
          code: this.formData.verifyCode
        })
          .then(rlt => {
            this.$message('密码已重置,现在可以使用新密码登陆了')
            this.$emit('update:show', false)
            this.$emit('success', {
              username: this.formData.username,
              password: this.formData.newPassword
            })
          })
          .catch(error => {
            console.error('报错了：', error)
            this.$message.error(error.message)
          })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .submit_btn {
    width: 100%;
    font-size: 16px;
    margin-bottom:0;

  }
</style>
