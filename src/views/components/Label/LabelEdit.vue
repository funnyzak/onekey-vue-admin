<template>
  <el-dialog
    :visible.sync="showDialog"
    append-to-body
    :title="`${formData === null || formData.id === null ? '添加' : '修改'}${conf.name}`"
    show-close
    width="500px"
    top="70px"
    @close="showDialog = false"
  >
    <el-form
      ref="editForm"
      :model="formData"
      label-position="top"
    >
      <el-row :gutter="40">
        <el-col v-if="conf.editFields.includes('cover')" :sm="24">
          <el-form-item :label="$t('table.cover')" prop="cover" :show-message="false">
            <SingleImageUpload v-model="formData.cover" />
          </el-form-item>
        </el-col>

        <el-col v-if="conf.parent" :sm="12">
          <el-form-item :label="$t('table.parentLevel')" prop="parentId" :show-message="false">
            <tree-select
              v-model="formData.parentId"
              :disabled="formData.id !== null"
              :sel-data="labelSimList"
              placeholder="选择上级"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="conf.editFields.includes('name')" :sm="12">
          <el-form-item :label="$t('table.name')" prop="name" :show-message="false">
            <el-input
              v-model="formData.name"
              auto-complete="off"
              :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.name')}`"
              suffix-icon="el-icon-fa-vcard"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="conf.editFields.includes('orderId')" :sm="12">
          <el-form-item :label="$t('table.order') + $t('table.number')" prop="orderId">
            <el-input
              v-model="formData.orderId"
              auto-complete="off"
              :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.order')}${$t('table.number')}`"
              suffix-icon="el-icon-fa-file-word-o"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="conf.editFields.includes('value')" :sm="24">
          <el-form-item :label="$t('table.value')" prop="value" :show-message="false">
            <el-input
              v-model="formData.value"
              :autosize="{ minRows: 3, maxRows: 8}"
              auto-complete="off"
              type="textarea"
              :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.value')}`"
              suffix-icon="el-icon-fa-terminal"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="conf.editFields.includes('description')" :sm="24">
          <el-form-item :label="$t('table.description')" prop="description" :show-message="false">
            <el-input
              v-model="formData.description"
              :maxlength="500"
              :autosize="{ minRows: 4, maxRows: 8}"
              type="textarea"
              auto-complete="off"
              :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.description')}`"
              suffix-icon="el-icon-fa-file-word-o"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:show', false)">取 消</el-button>
      <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils'
import TreeSelect from './../Select/TreeSelect'
import SingleImageUpload from '@/components/Upload/SingleImageUpload'

const defInfo = {
  cover: null,
  description: null,
  id: null,
  name: null,
  num: null,
  parentId: 0,
  value: null
}

export default {
  name: 'LabeInfoEdit',
  components: {
    SingleImageUpload,
    TreeSelect
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
    },
    conf: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      labelSimList: [],
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
        this.resetFormData(val)
      }
    }
  },
  created() {
    this.resetFormData(this.value)
  },
  methods: {
    pullSimpleData() {
      this.conf.apiService.simple(this.conf.type).then(res => {
        this.labelSimList = res.list
      })
    },
    resetFormData(val) {
      this.formData = val && val !== null && val.id && val.id !== null && val.id > 0 ? val : deepClone(Object.assign(defInfo, {
        type: this.conf.type
      }))
      if (this.conf.parent) {
        this.pullSimpleData()
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return

        this.conf.apiService.save(this.formData, this.conf.type).then(rlt => {
          this.$message(`${this.formData.id === null ? '添加' : '修改'}${this.conf.name}完成`)
          this.$emit('update:show', false)
          this.$refs[formName].clearValidate()
          this.$emit('input', rlt.info)
          this.$emit('success', rlt.info)
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
