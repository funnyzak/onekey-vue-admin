<template>
  <!-- 设置权限 -->
  <el-dialog
    :visible="show"
    width="960px"
    :title="`${title}`"
    @close="$emit('update:show', false)"
  >
    <template>
      <div
        v-for="(permissions, optionIndex) in permissionsOptions"
        :key="optionIndex"
        class="permission-grid"
      >
        <permission-group-set
          :permission-list="permissions"
          :option-index="optionIndex"
          :value-prop-name="valuePropName"
          @updateOptions="val => updateOptions(val, optionIndex)"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show = false">
          {{
            $t('table.cancel')
          }}
        </el-button>
        <el-button type="primary" @click="confirmSelected">
          {{
            $t('table.confirm')
          }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import PermissionGroupSet from './PermissionGroupSet'

export default {
  components: { PermissionGroupSet },
  props: {
    title: { // dialog title
      type: String,
      required: true,
      default: '权限设置'
    },
    show: { // 是否显示
      type: Boolean,
      required: false,
      default: false
    },
    permissionData: { // 权限数据
      type: Array,
      required: true,
      default: () => {
        return [
          {
            'id': 1,
            'name': 'permission.delete',
            'description': '功能权限一', // 展示名称：必须设置
            'intro': '描述信息', // 可选
            'group': 'acl' // 分组：必须设置
          }
        ]
      }
    },
    valuePropName: { // 比对或获取的权限对象属性如：id/name等
      type: String,
      required: true,
      default: 'id'
    },
    curPermissionValueList: { // 所选权限列表 可能是ID列表也可能是name,或其他
      type: Array,
      required: true,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      checkedOptionsList: {},
      permissionsOptions: {}
    }
  },
  created() {
    this.permissionsOptions = this.formatPermissions(
      this.setupPermissionsChecked(this.permissionData, this.curPermissionValueList)
    )
  },
  mounted() {
    this.$nextTick(() => {})
  },
  methods: {
    // 实时更新options
    updateOptions(val, index) {
      this.checkedOptionsList[index] = val
    },
    setupPermissionsChecked(permissionData, curPermissionValueList) {
      if (permissionData === null || permissionData.length === 0) {
        return permissionData
      }

      return permissionData.filter(v => v.description).map(permission => {
        permission['checked'] = curPermissionValueList === null ? false
          : curPermissionValueList.some(permissionVal => permission[this.valuePropName] === permissionVal)
        return permission
      })
    },
    formatPermissions(permissionsArray) {
      const perOptions = {}
      permissionsArray.map(permission => {
        perOptions[
          permission.group ? permission.group : 'nogroup'
        ] = perOptions[permission.group]
          ? perOptions[permission.group ? permission.group : 'nogroup']
          : []

        perOptions[permission.group].push(permission)
      })
      return perOptions
    },
    confirmSelected() {
      const optionValues = Object.values(this.checkedOptionsList).reduce((a, b) => {
        return a.concat(b)
      })
      // 发送结果
      this.$emit('confirm', optionValues)
    }
  }
}
</script>
