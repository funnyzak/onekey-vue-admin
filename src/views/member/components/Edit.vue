<template>
  <el-drawer
    :title="(formData.id == 0 ? $t('table.add'): $t('table.edit')) + $t('table.member')"
    :visible.sync="showDialog"
    append-to-body
    direction="rtl"
    show-close
    size="35%"
    custom-class="draw-auto-scroll"
    @close="showDialog = false"
  >
    <div class="draw-form-main-content">
      <el-form
        ref="editForm"
        :model="formData"
        label-position="top"
      >
        <el-row :gutter="40">
          <el-col :xs="24" :sm="8">
            <el-form-item label="头像:" prop="avatar">
              <single-image-upload v-model="formData.avatar" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :xs="24">
            <el-form-item :label="$t('table.appId')" prop="appId" :show-message="false">
              <el-input
                v-model="formData.appId"
                auto-complete="off"
                placeholder="由英文、数字、下划线构成"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('table.realName')" prop="realName" :show-message="false">
              <el-input
                v-model="formData.realName"
                auto-complete="off"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('table.gender')" prop="gender" :show-message="false">
              <string-select
                v-model="formData.gender"
                style="width:100%"
                name="性别"
                :sel-data="Constants.Member.Gender"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24">
            <el-form-item :label="$t('table.username')" prop="username" required :show-message="false">
              <el-input
                v-model="formData.username"
                :disabled="formData.id > 0"
                auto-complete="off"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24">
            <el-form-item :label="$t('table.email')" prop="email" :show-message="false">
              <el-input
                v-model="formData.email"
                auto-complete="off"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('table.phone')" prop="phone" :show-message="false">
              <el-input
                v-model="formData.phone"
                auto-complete="off"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('table.idNum')" prop="idNum" :show-message="false">
              <el-input
                v-model="formData.idNum"
                auto-complete="off"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('table.nickName')" prop="nickName" :show-message="false">
              <el-input
                v-model="formData.nickName"
                auto-complete="off"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('table.birthDay')" prop="birthDay" :show-message="false">
              <input-date-picker v-model="formData.birthDay" style="width:100%" name="选择生日" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div class="drawer-button-footer">
        <el-button @click="$emit('update:show', false)">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { deepClone } from '@/utils'
import { StringSelect, InputDatePicker } from '@/views/components'
import * as Constants from '@/utils/constants'
import SingleImageUpload from '@/components/Upload/SingleImageUpload'
import api from '@/api'

const defInfo = {
  appId: null,
  id: null,
  username: null,
  idNum: null,
  email: null,
  phone: null,
  nickName: null,
  avatar: null,
  gender: 'MAN',
  birthDay: null
}

export default {
  name: 'MemberEdit',
  components: {
    StringSelect, InputDatePicker, SingleImageUpload
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      Constants,
      formData: deepClone(defInfo)
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
    value: {
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          this.$refs.editForm.clearValidate()
        })
        this.formData = val && val.id && val.id > 0 ? val : deepClone(defInfo)
      }
    }
  },
  mounted() {
    this.formData = this.value
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return
        api.Member.save(this.formData)
          .then(rlt => {
            this.$message(`${this.formData.id === 0 ? '添加' : '修改'}会员完成`)
            this.$emit('update:show', false)
            this.$emit('input', rlt.info)
            this.$emit('success', rlt.info)
          })
          .catch(error => {
            this.$message.error(error.message)
          })
      })
    }
  }
}
</script>
