<template>
  <article-list :conf="conf" :query-setting="{typeList: typeList}" />
</template>
<script>
import ArticleList from './components/ArticleList'

export default {
  name: 'ArticleListIndex',
  components: {
    ArticleList
  },
  props: {
    typeList: {
      type: String,
      default: 'NORMAL'
    },
    conf: {
      type: Object,
      default: () => {
        return {
          name: '文章',
          // 显示和编辑字段
          listFields: ['title', 'subTitle', 'description', 'pic', 'addTime', 'updateTime', 'published'],
          editFields: ['title', 'subTitle', 'description', 'pic', 'addTime', 'updateTime', 'published'],
          // 权限配置
          permissionName: 'cms.article.',
          type: 'NORMAL'
        }
      }
    }
  }
}
</script>
