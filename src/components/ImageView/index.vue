<template>
  <div
    v-loading="imgLoading"
    class="image-view"
    :style="{ width: width, height: height }"
    style="overflow:hidden"
  >
    <img
      class="vertical-image"
      :src="url | imageThumbnailUrl"
      :onerror="imgErr"
      :style="
        (preview && !url && url !== null && url.length > 0 ? 'cursor:pointer;' : '') +
          'width:' +
          width +
          ';height:' +
          height
      "
      @load="getOnload"
      @click="handlePreview(url)"
    >
    <el-dialog v-if="preview" :visible.sync="dialogPreviewVisible" append-to-body>
      <el-input v-if="previewShowLink" v-model="dialogPreviewImageUrl" readonly size="small" style="width:100%;margin-bottom:2px">
        <el-button slot="append" v-clipboard:copy="dialogPreviewImageUrl" v-clipboard:success="clipboardSuccess">复制图片地址</el-button>
      </el-input>
      <img :src="dialogPreviewImageUrl" width="100%" alt>
    </el-dialog>
    <slot />
  </div>
</template>

<script>
import noimg from '@/assets/images/noimg.png'
import clipboard from '@/directive/clipboard'

export default {
  directives: {
    clipboard
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    def: {
      // 默认图片地址
      type: String,
      default: './assets/images/noimg.png',
      required: false
    },
    width: {
      type: String,
      required: false,
      default: '40px'
    },
    height: {
      type: String,
      required: false,
      default: '40px'
    },
    preview: {
      type: Boolean,
      default: false,
      required: false
    },
    previewShowLink: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      imgErr: "this.src='" + noimg + "'",
      defImg: noimg,
      dialogPreviewImageUrl: '',
      dialogPreviewVisible: false,
      imgLoading: 'fasle'
    }
  },
  created() {
    if (this.def.length > 0) {
      this.defImg = this.def
      this.imgErr = "this.src='" + this.def + "'"
    }
    this.imgLoading = true
  },
  methods: {
    clipboardSuccess() {
      this.$message({ message: '成功复制', type: 'success' })
    },
    handlePreview(imgUrl) {
      if (!imgUrl || imgUrl === null || imgUrl.length === 0) {
        return
      }
      this.dialogPreviewImageUrl = imgUrl
      this.dialogPreviewVisible = true
    },
    getOnload() {
      this.imgLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.image-view {
  border-radius: 4px;
  display: inline-block;
  .vertical-image {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
