<template>
  <div>
    <img :src="url.length === 0 ? defImg : (url)" :onerror="imgErr" :style="(preview && url.length > 0? 'cursor:pointer;': '') + 'width:' + width + ';height:' + height" @click="handlePreview(url)">
    <el-dialog v-if="preview" :visible.sync="dialogPreviewVisible">
      <img :src="dialogPreviewImageUrl" width="100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
import noimg from '@/assets/images/noimg.png'

export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    def: { // 默认图片地址
      type: String,
      default: '',
      required: false
    },
    width: {
      type: String,
      default: '70px',
      required: false
    },
    height: {
      type: String,
      default: '70px',
      required: false
    },
    preview: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      imgErr: 'this.src=\'' + noimg + '\'',
      defImg: noimg,
      dialogPreviewImageUrl: '',
      dialogPreviewVisible: false
    }
  },
  created() {
    if (this.def.length > 0) {
      this.defImg = this.def
      this.imgErr = 'this.src=\'' + this.def + '\''
    }
  },
  methods: {
    handlePreview(imgUrl) {
      if (imgUrl === null || imgUrl.length === 0) {
        return
      }
      this.dialogPreviewImageUrl = imgUrl
      this.dialogPreviewVisible = true
    }
  }
}
</script>
