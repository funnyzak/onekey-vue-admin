<template>
  <el-select
    v-model="dataRuleTypeVal"
    :disabled="disabled"
    :placeholder="$t('table.selectDataRuleType')"
    :clearable="true"
  >
    <el-option
      v-for="key in Object.keys(dataRuleType)"
      :key="key"
      :label="dataRuleType[key]"
      :value="key"
    />
  </el-select>
</template>

<script>
import { dataRuleType } from '@/utils/constants'

export default {
  props: {
    value: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataRuleType
    }
  },
  computed: {
    dataRuleTypeVal: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
        this.$emit('change', val)
      }
    }
  }
}
</script>
