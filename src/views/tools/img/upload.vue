<template>
  <div class="app-container">
    <el-alert
      title="可以上传的图片格式为：PNG/JPEG/JPG/BMP，并可多选上传或拖拽上传。上传后，预览图片即可复制图片链接并使用。"
      close-text="知道了"
      :closable="false"
      type="info"
      show-icon
    />
    <div style="padding:20px 0 0 0;">
      <el-row :gutter="40">
        <el-col :xs="24">
          <file-upload
            v-model="imgUrls"
            :drag="true"
            :show-file-list="false"
            :multiple="true"
            :mimes="['image/png','image/jpeg','image/bmp','image/gif']"
            :max-size="4096"
            :limit="1000"
            list-style="picture-card"
          />
        </el-col>
      </el-row>
      <el-row :gutter="40" class="box-list">
        <el-col v-for="item in imgList" :key="item" class="box-item" :sm="12" :md="6" :lg="4" :xl="3">
          <el-card>
            <image-view width="100%" height="150px" :preview-show-link="true" :url="item" preview />
            <div class="bottom">
              <el-link v-clipboard:copy="item" v-clipboard:success="clipboardSuccess" type="primary" class="link">复制地址</el-link>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import FileUpload from '@/components/Upload/FileUpload'
import clipboard from '@/directive/clipboard'
import ImageView from '@/components/ImageView'

export default {
  name: 'ImageUpload',
  directives: {
    clipboard
  },
  components: {
    FileUpload,
    ImageView
  },
  data() {
    return {
      imgUrls: ''
    }
  },
  computed: {
    imgList: {
      get() {
        return this.imgUrls === '' || this.imgUrls === null || !this.imgUrls ? [] : this.imgUrls.split(',').reverse()
      }
    }
  },
  methods: {
    clipboardSuccess() {
      this.$message({ message: '成功复制', type: 'success' })
    }
  }
}
</script>
<style lang="scss" scoped>
.box-list {
  margin: 70px 0 0 0;
  .box-item {
    margin-bottom: 20px;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
    text-align: right !important;
  }

  .image {
    width: 100%;
    height: 200px;
  }
}
</style>
