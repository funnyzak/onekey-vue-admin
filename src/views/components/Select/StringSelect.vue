<template>
  <el-select
    v-model="curValue"
    :disabled="disabled"
    :placeholder="`选择${name}`"
    :multiple="multiple"
    :clearable="clearable"
    filterable
    collapse-tags
    :allow-create="allowCreate"
  >
    <el-option
      v-for="(item, idx) in options"
      :key="idx"
      :label="item.label"
      :value="item.value"
    >
      <slot name="option" :item="item">
        {{ `${item.label}` }}
      </slot>
    </el-option>
  </el-select>
</template>

<script>

export default {
  props: {
    name: {
      type: String,
      default: null
    },
    value: {
      type: [String, Array, Number, Object, Boolean],
      default: null
    },
    // 和 multiple 配合使用
    split: {
      type: String,
      default: ','
    },
    // select 数据，{}对象或者String Array
    selData: {
      type: [Array, Object],
      default: null
    },
    allowCreate: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    options: {
      get() {
        if (Object.prototype.toString.call(this.selData) === '[object Array]') {
          return this.selData.map((v, index) => {
            return { value: v, label: v }
          })
        } else if (typeof this.selData === 'object') {
          return Object.keys(this.selData).map(v => {
            return { value: v, label: this.selData[v] }
          })
        }
        return []
      }
    },
    curValue: {
      get() {
        if (this.value === null || this.value === '') {
          return null
        }
        if (this.multiple && typeof (this.value) === 'string') {
          return this.value.split(this.split)
        }
        if (typeof (this.value) === 'boolean') {
          return this.value.toString()
        }
        return this.value
      },
      set(val) {
        const val2 = val === null ? null : this.multiple ? val.join(',') : val
        this.$emit('input', val2)
        this.$emit('change', val2)
      }
    }
  }
}
</script>
