
<template>
  <el-date-picker
    v-model="dateRange"
    :size="size"
    :type="type"
    :disabled="disabled"
    :start-placeholder="`${name}开始`"
    :end-placeholder="`${name}截止`"
    :format="format"
    value-format="timestamp"
  />
</template>

<script>
// 调用实例
// <input-date-range
//   v-model="dateRangeValue"
//   size="mini"
//   name="录入日期"
//   :start.sync="start"
//   :end.sync="end"
//   @change="loadData()"
// />
export default {
  props: {
    // 10位时间戳数组 [开始时间, 结束时间]
    value: {
      type: Array,
      default: null
    },
    type: {
      type: String,
      default: 'daterange'
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    pickers: {
      type: Object,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: null
    },
    start: {
      type: Number,
      default: null
    },
    end: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      dateRange: null
    }
  },
  watch: {
    dateRange: {
      deep: true,
      handler(val) {
        this.dateRangeChange(val)
      }
    }
  },
  created() {
    this.dateRange = this.value
    this.dateRangeChange(this.dateRange)
  },
  methods: {
    dateRangeChange(val) {
      if (val === null) {
        this.$emit('update:start', null)
        this.$emit('update:end', null)
      } else {
        const start = parseInt(val[0] / 1000)
        const end = parseInt(val[1] / 1000)
        this.$emit('update:start', start)
        this.$emit('update:end', end)
      }
      this.$emit('input', this.value)
      this.$emit('change', this.value)
    }
  }
}
</script>
