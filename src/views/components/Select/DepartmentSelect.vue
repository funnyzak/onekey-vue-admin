<template>
  <el-select
    v-model="depatmentId"
    :disabled="disabled"
    :placeholder="$t('table.selectDepartment')"
    :clearable="true"
  >
    <el-option
      v-for="item in nameList"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    >
      <span>{{ `${'&nbsp;&nbsp;&nbsp;&nbsp;'.repeat(item.depth - 1)}${item.name}` }}</span>
    </el-option>
  </el-select>
</template>

<script>
import api from '@/api'

export default {
  props: {
    value: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    refresh: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      departmentNameList: []
    }
  },
  computed: {
    depatmentId: {
      get() {
        return typeof (this.value) === 'string' ? null : this.value
      },
      set(val) {
        const val2 = typeof (val) === 'string' ? null : val
        this.$emit('input', val2)
        this.$emit('change', val2)
      }
    },
    nameList() {
      return this.buildTree(this.departmentNameList, 0)
    }
  },
  created: function() {
    if (this.refresh) {
      this.loadData()
    }
  },
  methods: {
    loadData() {
      api.Department.list(1, 100).then(result => {
        this.departmentNameList = result.pager.dataList
      })
    },
    buildTree(dataList, parentId, depth = 1) {
      if (dataList === null) return []

      let itemArr = []
      for (let i = 0; i < dataList.length; i++) {
        const node = dataList[i]
        if (node.parentId === parentId) {
          const newNode = Object.assign({}, node)
          newNode.depth = depth
          itemArr.push(newNode)
          itemArr = itemArr.concat(this.buildTree(dataList, node.id, depth + 1))
        }
      }
      return itemArr
    }
  }
}
</script>
