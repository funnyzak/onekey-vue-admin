<template>
  <div class="upload-container">
    <el-upload
      :multiple="false"
      :auto-upload="true"
      :show-file-list="false"
      :headers=" { 'X-Auth-Token': $store.getters.user.userToken && $store.getters.user.userToken.length > 0 ? $store.getters.user.userToken : ''}"
      :on-success="handleImageSuccess"
      :before-upload="beforeImageUpload"
      :action="actionUrl"
      :with-credentials="true"
      class="singleimg-uploader"
    >
      <div v-if="imgUrl && imgUrl.length > 0" class="singleImage">
        <img :src="imgUrl | imageThumbnailUrl" class="thumb" :onerror="imgErr">
      </div>
      <i v-else class="el-icon-plus singleimg-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
import noimg from '@/assets/images/noimg.png'

export default {
  name: 'SingleImageUpload',
  props: {
    value: {
      type: String,
      default: ''
    },
    action: {
      type: String,
      default: null
    },
    mimes: {
      type: Array,
      default: function() {
        return [
          {
            name: 'PNG',
            mime: 'image/png'
          },
          {
            name: 'JPG',
            mime: 'image/jpg'
          },
          {
            name: 'JPEG',
            mime: 'image/jpeg'
          },
          {
            name: 'BMP',
            mime: 'image/bmp'
          },
          {
            name: 'GIF',
            mime: 'image/gif'
          }
        ]
      }
    },
    maxSize: { // kb
      type: Number,
      default: 2048
    }
  },
  data() {
    return {
      imgErr: 'this.src=\'' + noimg + '\''
    }
  },
  computed: {
    imgUrl: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    actionUrl: {
      get() {
        return this.action === null || this.action.length === 0 ? process.env.VUE_APP_BASE_API_HOST + '/upload/file/local/' : this.action
      }
    }
  },
  methods: {
    handleImageSuccess(res, file) {
      if (res.operationState === 'SUCCESS' && res.data) {
        this.imgUrl = res.data.info.key
      } else {
        this.$message({ message: res.errors[0], type: 'error' })
      }
    },
    beforeImageUpload(file) {
      return this.mimes.map(v => v.mime).includes(file.type) &&
        file.size < this.maxSize * 1024
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .singleimg-uploader {
      width: 146px;
      height: 146px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      .singleimg-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 146px;
        height: 146px;
        line-height: 146px;
        text-align: center;
      }
      .singleImage {
        position: relative;
        display: block;
        .size {
          width: 146px;
          height: 146px;
        }
        .thumb {
          @extend .size;
        }
      }
  }
  .singleimg-uploader:hover {
    border-color: #409EFF;
  }

</style>
