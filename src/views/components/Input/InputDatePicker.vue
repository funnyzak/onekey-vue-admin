<template>
  <el-date-picker
    v-model="dateValue"
    type="date"
    :disabled="disabled"
    :placeholder="`选择${name}`"
    :picker-options="pickers"
    :format="format"
    value-format="timestamp"
  />
</template>

<script>
// 10位时间戳日期选择器
export default {
  props: {
    // 10位时间戳
    value: {
      type: Number,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    pickers: {
      type: Object,
      default: null
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    name: {
      type: String,
      default: null
    }
  },
  data() {
    return {
    }
  },
  computed: {
    dateValue: {
      get() {
        if (this.value === null || this.value.toString().length > 12) {
          return this.value
        }
        return this.value * 1000
      },
      set(val) {
        const val2 = val === null ? null : parseInt(val / 1000)
        this.$emit('input', val2)
        this.$emit('change', val2)
      }
    }
  }
}
</script>
