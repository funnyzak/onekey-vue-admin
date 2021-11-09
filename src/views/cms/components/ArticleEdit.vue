<template>
  <el-drawer
    :visible.sync="showDialog"
    append-to-body
    :title="`${formData === null || formData.id === null ? '添加' : '修改'}${conf.name}`"
    direction="rtl"
    show-close
    size="70%"
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
          <el-col v-if="conf.editFields.includes('pic')" :xs="8" :sm="12">
            <el-form-item :label="$t('table.cover')" prop="pic" :show-message="false">
              <SingleImageUpload v-model="formData.pic" />
            </el-form-item>
          </el-col>
          <el-col v-if="conf.editFields.includes('title')" :sm="24">
            <el-form-item :show-message="false" prop="title" required>
              <MDinput
                v-model="formData.title"
                :maxlength="100"
                name="title"
                required
              >
                {{ $t('table.title') }}
              </MDinput>
            </el-form-item>
          </el-col>
          <el-col v-if="conf.editFields.includes('subTitle')" :sm="24">
            <el-form-item :show-message="false" prop="subTitle">
              <MDinput
                v-model="formData.subTitle"
                :maxlength="100"
                name="subTitle"
                required
              >
                {{ $t('table.subTitle') }}
              </MDinput>
            </el-form-item>
          </el-col>
          <el-col v-if="conf.editFields.includes('description')" :sm="24">
            <el-form-item :label="$t('table.description')" prop="description" :show-message="false">
              <el-input
                v-model="formData.description"
                :maxlength="500"
                :autosize="{ minRows: 2, maxRows: 3}"
                type="textarea"
                auto-complete="off"
                :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.description')}`"
                suffix-icon="el-icon-fa-file-word-o"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="conf.editFields.includes('audio')" :sm="12">
            <el-form-item :label="$t('table.audio')" prop="audio" :show-message="false">
              <input-select-file v-model="formData.auido" placeholder="上传音频" upload-tips="支持 mp3 视频格式文件，最大5MB。" />
            </el-form-item>
          </el-col>
          <el-col v-if="conf.editFields.includes('video')" :sm="12">
            <el-form-item :label="$t('table.video')" prop="video" :show-message="false">
              <input-select-file v-model="formData.video" placeholder="上传视频" upload-tips="支持 mp4 视频格式文件，最大100MB。" />
            </el-form-item>
          </el-col>
          <el-col v-if="conf.editFields.includes('author')" :sm="12">
            <el-form-item :label="$t('table.author')" prop="author" :show-message="false">
              <el-input
                v-model="formData.author"
                auto-complete="off"
                :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.author')}`"
                suffix-icon="el-icon-fa-vcard"
              />
            </el-form-item>
          </el-col>

          <el-col v-if="conf.editFields.includes('source')" :sm="12">
            <el-form-item :label="$t('table.source')" prop="source" :show-message="false">
              <el-input
                v-model="formData.source"
                auto-complete="off"
                :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.source')}`"
                suffix-icon="el-icon-fa-vcard"
              />
            </el-form-item>
          </el-col>

          <el-col v-if="conf.editFields.includes('digCount')" :sm="12">
            <el-form-item :label="$t('table.digCount')" prop="digCount" :show-message="false">
              <el-input
                v-model="formData.digCount"
                auto-complete="off"
                :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.digCount')}`"
                suffix-icon="el-icon-fa-vcard"
              />
            </el-form-item>
          </el-col>

          <el-col v-if="conf.editFields.includes('viewCount')" :sm="12">
            <el-form-item :label="$t('table.viewCount')" prop="viewCount" :show-message="false">
              <el-input
                v-model="formData.viewCount"
                auto-complete="off"
                :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.viewCount')}`"
                suffix-icon="el-icon-fa-vcard"
              />
            </el-form-item>
          </el-col>

          <el-col v-if="conf.editFields.includes('content')" :sm="24">
            <el-form-item :label="$t('table.content')" prop="content" :show-message="false">
              <Tinymce ref="editor" v-model="formData.content" :height="300" />
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div class="drawer-button-footer">
        <el-button v-if="conf.listFields.includes('published')" @click="formData.published = false; submitForm('editForm')">{{ $t('table.save') + $t('table.draft') }}</el-button>
        <el-button type="primary" @click="formData.published = true; submitForm('editForm')">{{ $t('table.publish') }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { deepClone } from '@/utils'
import config from '@/config'
import { InputSelectFile } from '@/views/components'
import * as Constants from '@/utils/constants'
import SingleImageUpload from '@/components/Upload/SingleImageUpload'
import api from '@/api'
import MDinput from '@/components/MDinput'
import Tinymce from '@/components/Tinymce'

const defInfo = {
  audio: null,
  author: null,
  content: null,
  description: null,
  digCount: 0,
  id: null,
  pic: null,
  relationId: null,
  source: null,
  subTitle: null,
  title: null,
  type: 'NORMAL',
  updateUserId: null,
  video: null,
  viewCount: 0,
  published: false
}

export default {
  components: {
    SingleImageUpload,
    InputSelectFile,
    Tinymce,
    MDinput
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
      api,
      Constants,
      config,
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
    resetFormData(val) {
      this.formData = val && val !== null && val.id && val.id !== null && val.id > 0 ? val : deepClone(Object.assign(defInfo, {
        type: this.conf.type
      }))
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return

        api.Cms.Article.save(this.formData).then(rlt => {
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
