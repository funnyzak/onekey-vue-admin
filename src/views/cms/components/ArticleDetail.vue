<template>
  <el-dialog
    :visible.sync="showDialog"
    :title="`预览${conf.name}`"
    width="900px"
    @close="$emit('update:show', false)"
  >
    <form-container :title="`${conf.name}详情`">
      <div class="articel-container">
        <div v-if="conf.previewFields.includes('title')" class="article-title">
          <h1>{{ value.title || defaultHTML('未设置标题') }}</h1>
        </div>
        <div class="article-summary s14 cgrey2">
          <span v-if="conf.previewFields.includes('updateTime')">更新时间： {{ value.updateTime | parseTime }}</span>
          <span v-if="conf.previewFields.includes('author')">作者： {{ value.author | defaultHTML }}</span>
          <span v-if="conf.previewFields.includes('source')"> 来源： {{ value.source | defaultHTML }}</span>
        </div>
        <div v-if="conf.previewFields.includes('video') && value.video && value.video !== null && value.video.length > 0" class="article-content">
          <video-player
            ref="videoPlayer"
            class="video-player-box"
            :options="playerOptions"
          />
        </div>
        <div v-if="conf.previewFields.includes('content')" class="article-content" v-html="value.content" />
      </div>
    </form-container>
  </el-dialog>
</template>

<script>
import { FormContainer } from '@/views/components'
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'

export default {
  components: {
    FormContainer,
    videoPlayer
  },
  props: {
    value: {
      type: Object,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    },
    conf: {
      type: Object,
      default: null
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
    },
    playerOptions: {
      get() {
        return {
          muted: true,
          language: 'cn',
          width: 800,
          height: 450,
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            type: 'video/mp4',
            src: this.value.video
          }],
          poster: this.value.pic
        }
      }

    }
  }
}
</script>
<style lang="less" scoped>
.articel-container {
    width: 100%;
    margin: 20px auto 10px;
}

.article-title {
    text-align: center;
    padding-bottom: 20px;
}

.article-title h1 {
    font-weight: normal;
    font-size: 26px;
}

.article-summary {
    width: 100%;
    text-align: center;
    padding: 5px 0 25px;
}

.article-content {
    width: 100%;
    text-align: left;
    overflow: hidden;
    padding: 35px 30px 30px;
    margin: 0 auto;
    border-top: 1px solid #ddd
}

.article-content,.article-content p {
    white-space: normal;
    ord-break: break-all;
    word-wrap: break-word;
    color: #333;
    font-size: 16px;
    line-height: 30px;
}

.article-content p {
    text-indent: 25px;
}

.article-content h2,.article-content h3,.article-content h4 {
    border-bottom: #eee 1px solid;
    margin: 10px 0 5px 0
}

.article-content h2 {
    font-size: 18px;
    margin-top: 30px
}

.article-content h3,.article-content h4,.article-content h5 {
    font-size: 16px
}

.article-content h5 {
    padding: 3px 8px;
    background: #f5f5f5;
    border: 1px #dfdfdf solid;
    margin: 3px 0;
}

.article-content pre {
    word-break: break-all;
    word-wrap: break-word;
}

.article-content code {
    padding: 1px 4px;
    border-radius: 2px;
    background-color: #eee;
    font-family: 'courier new';
    color: #777;
    margin: 0 4px
}

.article-content table {
    border-top: solid 1px #ddd;
    border-left: solid 1px #ddd;
    width: 100%;
    margin-bottom: 16px;
}

.article-content table th {
    background-color: #f3f3f3;
    text-align: center
}

.article-content table td,.article-content table th {
    border-bottom: solid 1px #ddd;
    border-right: solid 1px #ddd;
    padding: 5px 10px
}

.article-content ul,.article-content ol {
    margin: 16px 0 16px 26px
}

.article-content ul li {
    padding-left: 5px;
    margin-bottom: 10px;
    *list-style: disc;
    *padding-left: 0;
}

.article-content ol li {
    list-style: decimal;
    margin-left: 28px;
}

.article-content a:link,.article-content a:visited,.article-content a:hover,.article-content a:active {
    font-size: 13px;
    text-decoration: underline;
    color: #1E50A2;
}

.article-content a:hover {
    color: #ff0000;
}

.article-content table.attachment,.article-content table.attachment td {
    border: 0;
    padding: 5px 5px 5px 0;
}
</style>
