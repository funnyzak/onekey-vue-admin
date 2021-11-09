<template>
  <el-select
    v-model="dataRuleModuleVal"
    :disabled="disabled"
    :placeholder="$t('table.selectDataRuleModule')"
    :clearable="true"
  >
    <el-option-group
      v-for="item in dataRuleModule"
      :key="item.name"
      :label="item.name"
    >
      <el-option
        v-for="module_key in Object.keys(item.modules)"
        :key="module_key"
        :label="item.modules[module_key]"
        :value="module_key"
      />
    </el-option-group>
  </el-select>
</template>

<script>
import { dataRuleModule } from '@/utils/constants'

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
      dataRuleModule
    }
  },
  computed: {
    dataRuleModuleVal: {
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
