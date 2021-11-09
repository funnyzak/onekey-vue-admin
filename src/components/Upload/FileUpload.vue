<template>
  <div>
    <el-upload
      :multiple="multiple"
      :limit="limit"
      :drag="drag"
      :auto-upload="true"
      :show-file-list="showFileList"
      :headers=" { 'X-Auth-Token': $store.getters.user.userToken && $store.getters.user.userToken.length > 0 ? $store.getters.user.userToken : ''}"
      :on-success="handleImageSuccess"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :on-progress="handleProgress"
      :before-upload="beforeImageUpload"
      :action="actionUrl"
      :file-list="initFileList"
      :with-credentials="true"
      :list-type="listStyle"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <div v-transfer-dom>
      <el-dialog :visible.sync="dialogVisible">
        <el-input v-if="previewShowLink" v-model="dialogImageUrl" readonly size="small" style="width:100%;margin-bottom:2px">
          <!-- <template slot="prepend">图片地址:</template> -->
          <el-button slot="append" v-clipboard:copy="dialogImageUrl" v-clipboard:success="clipboardSuccess">复制图片地址</el-button>
        </el-input>
        <img :src="dialogImageUrl" width="100%" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import clipboard from '@/directive/clipboard'

export default {
  name: 'FileUpload',
  directives: {
    clipboard
  },
  props: {
    action: {
      type: String,
      default: null
    },
    limit: {
      type: Number,
      default: 100
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    drag: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    listStyle: {
      type: String,
      default: 'picture-card'
    },
    value: {
      type: String,
      default: ''
    },
    mimes: {
      type: Array,
      default: function() {
        return [
          'application/pdf'
        ]
      }
    },
    maxSize: { // kb
      type: Number,
      default: 2048
    },
    previewShowLink: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      initFileList: [],
      newFileList: []
    }
  },
  computed: {
    actionUrl: {
      get() {
        return this.action === null || this.action.length === 0 ? process.env.VUE_APP_BASE_API_HOST + '/upload/file/local/' : this.action
      }
    }
  },
  mounted() {
    this.initFileList = this.resetFileList()
  },
  activated() {
    this.initFileList = this.resetFileList()
  },
  methods: {
    clipboardSuccess() {
      this.$message({ message: '成功复制', type: 'success' })
    },
    resetFileList() {
      return !this.value || this.value === null || this.value.length <= 10 ? [] : this.value.split(',').filter(v => {
        return v.length > 0
      }).map((v, i) => {
        return { name: v.split('/').reverse()[0], origin: v, url: v }
      })
    },
    handleRemove(file, fileList) {
      const curFiles = this.resetFileList()

      this.$emit('remove', { file, fileList })

      if (file.origin) {
        this.$emit('input', curFiles.filter(v => v.origin !== file.origin).map(v => { return v.origin }).join(','))
      } else {
        this.$emit('input', curFiles.filter(v => v.origin !== this.orginUrlByOrginFile(file)).map(v => { return v.origin }).join(','))
      }
    },
    orginUrlByOrginFile(file) {
      const originFile = this.newFileList.filter(v => v.name === file.name)
      return originFile.length > 0 ? originFile[0].origin : file.origin
    },
    handleProgress(event, file, fileList) {
      this.$emit('progress', { event, file, fileList })
    },
    handlePreview(file) {
      const fileExt = this.orginUrlByOrginFile(file).toLowerCase()

      if (fileExt.endsWith('.jpg') || fileExt.endsWith('.jpeg') || fileExt.endsWith('.bmp') || fileExt.endsWith('.gif') || fileExt.endsWith('.png') || fileExt.endsWith('.svg')) {
        this.dialogImageUrl = fileExt
        this.dialogVisible = true
      } else {
        window.open(fileExt)
      }
    },
    handleImageSuccess(res, file, fileList) {
      if (res.operationState === 'SUCCESS' && res.data) {
        this.$emit('success', res.data)

        this.newFileList.push(Object.assign(file, { origin: res.data.info.key }))
        this.$emit('input', (this.value === null || this.value.length === 0 ? '' : `${this.value},`) + res.data.info.key)
      } else {
        this.$message({ message: res.errors[0], type: 'error' })
      }
      this.$emit('completed', { res, file, fileList })
    },
    handleExceed(files, fileList) {
      this.$message({ message: `上传文件超限，最大可上传 ${this.limit} 个`, type: 'error' })
    },
    beforeImageUpload(file) {
      const canUp = ((this.mimes !== null && this.mimes.length > 0 && this.mimes.includes(file.type)) || this.mimes === null || this.mimes.length === 0) && file.size < this.maxSize * 1024
      if (!canUp) {
        this.$message({ message: `上传文件非法或文件大小超限(最大 ${this.maxSize} KB)`, type: 'error' })
      } else {
        this.$emit('beforeUpload', { file })
      }
      return canUp
    }
  }
}
</script>
