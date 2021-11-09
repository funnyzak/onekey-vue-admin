<template>
  <el-select
    v-model="recordId"
    :disabled="disabled"
    :placeholder="$t('table.select') + $t('table.connector')"
    :clearable="true"
  >
    <el-option
      v-for="item in list"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    >
      <span>{{ `${item.name}` }}</span>
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
    }
  },
  data() {
    return {
      list: []
    }
  },
  computed: {
    recordId: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
        this.$emit('change', val)
      }
    }
  },
  created: function() {
    this.loadData()
  },
  methods: {
    loadData() {
      api.Connector.simpleList().then(rlt => {
        this.list = rlt.list
      })
    }
  }
}
</script>
