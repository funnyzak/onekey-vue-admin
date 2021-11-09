<template>
  <label-list :conf="conf" :query-setting="querySetting" />
</template>
<script>
import { LabelList } from '@/views/components'
import api from '@/api'
import * as Constants from '@/utils/constants'

export default {
  name: 'ArticleCateList',
  components: {
    LabelList
  },
  data() {
    return {
      querySetting: {
        type: 'ARTICLE_CATE',
        parentId: 0
      },
      conf: {
        name: Constants.LabelInfoType.ARTICLE_CATE,
        // 是否显示上级
        parent: false,
        // 显示和编辑字段
        listFields: ['name', 'description', 'orderId'],
        editFields: ['name', 'description', 'orderId'],
        // api对象
        apiService: api.Label,
        // 权限配置
        permissionName: 'label.info.article.cate',
        type: 'ARTICLE_CATE'
      }
    }
  }
}
</script>
