<template>
  <el-drawer
    :title="(formData.id == 0 ? $t('table.add'): $t('table.edit')) + $t('table.connector')"
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
          <el-col :xs="24" :sm="24">
            <el-form-item :label="$t('table.name')" prop="name" required :show-message="false">
              <el-input
                v-model="formData.name"
                auto-complete="off"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24">
            <el-form-item :label="$t('table.appId')" prop="appId" required :show-message="false">
              <el-input
                v-model="formData.appId"
                auto-complete="off"
                placeholder="由英文、数字、下划线构成"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="formData.id > 0" :xs="24" :sm="12">
            <el-form-item label="ID" prop="secretId" required :show-message="false">
              <el-input
                v-model="formData.secretId"
                :disabled="formData.id > 0"
                auto-complete="off"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col v-if="formData.id > 0" :xs="24" :sm="12">
            <el-form-item label="Secret Key" prop="secretKey" required :show-message="false">
              <el-input
                v-model="formData.secretKey"
                :disabled="formData.id > 0"
                auto-complete="off"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item :label="$t('table.enable')">
              <el-select
                v-model="formData.enable"
                style="width:100%"
              >
                <el-option :value="true" :label="$t('table.enable')" />
                <el-option :value="false" :label="$t('table.disabled')" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-form-item :label="$t('table.verify') + $t('table.timestamp')">
              <el-select
                v-model="formData.verifyTS"
                style="width:100%"
              >
                <el-option :value="true" :label="$t('table.enable')" />
                <el-option :value="false" :label="$t('table.disabled')" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="8">
            <el-form-item :label="$t('table.verify') + $t('table.sign')">
              <el-select
                v-model="formData.verifyAppSign"
                style="width:100%"
              >
                <el-option :value="true" :label="$t('table.enable')" />
                <el-option :value="false" :label="$t('table.disabled')" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24">
            <el-form-item :label="$t('table.limitApiCountMinute')" prop="limitApiCountMinute" required :show-message="false">
              <el-slider
                v-model="formData.limitApiCountMinute"
                :min="0"
                :max="10000"
                show-input
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24">
            <el-form-item :label="$t('table.whiteIp')" prop="whiteIps">
              <el-input
                v-model="formData.whiteIps"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5}"
                auto-complete="off"
                placeholder="一行一个，留空则不限制"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24">
            <el-form-item :label="$t('table.intro')" prop="intro">
              <el-input
                v-model="formData.intro"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5}"
                auto-complete="off"
                placeholder=""
              />
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
import { connectorType, connectorPower } from '@/utils/constants'
import { deepClone } from '@/utils'
import api from '@/api'

const defInfo = {
  id: 0,
  name: null,
  intro: null,
  type: 'FRONT',
  power: 'OPEN',
  secretId: null,
  secretKey: null,
  limitApiCountMinute: 100,
  verifyAppSign: true,
  verifyTS: true,
  whiteIps: null,
  enable: true
}

export default {
  name: 'PlaceEdit',
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
      connectorType,
      connectorPower,
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

        (this.formData.id === 0
          ? api.Connector.save(this.formData)
          : api.Connector.update(this.formData)
        )
          .then(rlt => {
            this.$message(`${this.formData.id === 0 ? '添加' : '修改'}连接器完成`)
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
