<template>
  <el-cascader
    v-model="selectedOptions"
    :disabled="disabled"
    :options="options"
    clearable
    :props="{ expandTrigger: 'click' }"
    @change="handleChange"
  />
</template>

<script>
import { provinceAndCityData } from 'element-china-area-data'
import { getCityArrayByCodes } from '@/utils/area-data-utils'

export default {
  name: 'AreaPicker',
  props: {
    value: {
      type: Array,
      default: function() {
        return null
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: provinceAndCityData
    }
  },
  computed: {
    selectedOptions: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('change', {
        code: value,
        name: getCityArrayByCodes(provinceAndCityData, value, 0)
      })
    }
  }
}
</script>
