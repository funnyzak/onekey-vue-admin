<template>
  <div class="permission-comp">
    <el-checkbox
      v-model="checkAll"
      class="permission-title"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
    >
      {{ groupName(optionIndex) }}
    </el-checkbox>
    <el-checkbox-group
      v-model="checkedOptionList"
      class="permission-group"
      @change="handlecheckedOptionListChange"
    >
      <el-checkbox
        v-for="(option,index) in permissionList"
        :key="index"
        class="permission-option"
        :label="option[valuePropName]"
      >{{ option.description }}

        <el-tooltip
          v-if="option.intro"
          class="tooltip-item"
          :content="option.intro"
          placement="top"
        >
          <el-button>
            <i class="el-icon-question " />
          </el-button>
        </el-tooltip>
      </el-checkbox>

    </el-checkbox-group>
  </div>
</template>

<script>
const config = {
  acl: '权限管理',
  system: '系统配置',
  config: '配置管理',
  connector: '连接器',
  dept: '组织机构',
  'label.info': '标签管理',
  'cms': '内容管理',
  'member.info': '开放会员',
  'nogroup': '其他',
  app: '应用',
  member: '会员'
}
export default {
  name: 'PermissionSet',
  props: {
    permissionList: {
      type: Array,
      required: true
    },
    optionIndex: {
      type: [Number, String],
      required: true
    },
    valuePropName: { // 比对或获取的权限对象属性如：id/name等
      type: String,
      required: true,
      default: 'id'
    }
  },
  data() {
    return {
      checkAll: false,
      checkedOptionList: [],
      isIndeterminate: true
    }
  },
  watch: {
    checkedOptionList: {
      handler: function(val, oldValue) {
        this.$emit('updateOptions', val)
      },
      deep: true
    }
  },
  created() {
    this.permissionList.forEach(option => {
      if (option.checked) {
        this.checkedOptionList.push(option[this.valuePropName])
      }
    })
  },
  mounted() {
    this.$nextTick(() => {})
  },
  methods: {
    groupName(val) {
      return config[val] ? config[val] : val
    },
    handleCheckAllChange(val) {
      const checkedOptionList = this.permissionList.map(option => {
        return option[this.valuePropName]
      })
      this.checkedOptionList = val ? checkedOptionList : []
      this.isIndeterminate = false
    },
    handlecheckedOptionListChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.permissionList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.permissionList.length
    }
  }
}
</script>
<style lang="scss" scoped>
.permission-comp {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  .permission-title {
    width: 120px;
    margin: 0;
  }
  .permission-group {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
    .permission-option {
      width: 25%;
      margin: 0;
      margin-bottom: 8px;
      .tooltip-item {
        color: #999;
        border: none;
        padding: 0;
      }
    }
  }
}
</style>

