<template>
  <el-select
    v-model="selectValue"
    :disabled="disabled"
    :placeholder="placeholder"
    :clearable="true"
  >
    <el-option
      v-if="nameList.filter(v => v[propNames.id] === 0).length === 0"
      key="_parent"
      :label="`${$t('table.parentLevel')}`"
      :value="0"
    />
    <el-option
      v-for="(item, idx) in nameList"
      :key="idx"
      :label="item[propNames.name]"
      :value="item[propNames.id]"
    >
      <span>{{ `${'&nbsp;&nbsp;&nbsp;&nbsp;'.repeat(item.depth - 1)}${item[propNames.name]}` }}</span>
    </el-option>
  </el-select>
</template>

<script>
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
    // 数据格式 [{id:1,name:'',parentId:''}]
    selData: {
      type: Array,
      default: null
    },
    propNames: {
      type: Object,
      default: () => {
        return {
          id: 'id',
          name: 'name',
          parentId: 'parentId'
        }
      }
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
    }
  },
  computed: {
    selectValue: {
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
      return this.buildTree(this.selData, 0)
    }
  },
  methods: {
    buildTree(dataList, parentId, depth = 1) {
      if (dataList === null) return []

      let itemArr = []
      for (let i = 0; i < dataList.length; i++) {
        const node = dataList[i]
        if (node[this.propNames.parentId] === parentId) {
          const newNode = Object.assign({}, node)
          newNode.depth = depth
          itemArr.push(newNode)
          itemArr = itemArr.concat(this.buildTree(dataList, node[this.propNames.id], depth + 1))
        }
      }
      return itemArr
    }
  }
}
</script>
