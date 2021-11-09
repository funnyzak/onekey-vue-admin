<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.searchKey"
        :placeholder="$t('table.searchTitle')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="pager.pager.pageNumber = 1; loadData()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="pager.pager.pageNumber = 1; loadData()"
        />
      </el-input>
      <el-button
        v-permission="['role.add']"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
      <el-button
        v-if="multipleSelection.length > 0"
        v-permission="['role.delete']"
        class="filter-item"
        style="margin-left: 10px;"
        type="danger"
        icon="el-icon-delete"
        @click="handleDeleteSelected(multipleSelection)"
      >{{ $t('table.delete') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      header-row-class-name="table-header-hightlight"
      :data="pager.dataList"
      fit
      style="width: 100%;"
      @selection-change="(val) => { multipleSelection = val }"
    >
      <el-table-column
        v-if="['role.delete']"
        type="selection"
        width="55"
      />
      <el-table-column
        :label="$t('table.name')"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.description')"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="loginUser.branchId === 0"
        :label="$t('table.type')"
        align="left"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.installed ? 'success' : 'danger'"
            close-transition
          >{{ scope.row.installed ?
            $t('table.installed') : $t('table.custom') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission(['role.edit','role.delete','role.grant'])"
        :label="$t('table.actions')"
        align="left"
        width="180"
        class-name="small-padding"
      >
        <template slot-scope="scope">
          <div v-default-html="'无'">
            <el-link
              v-permission="['role.edit']"
              type="primary"
              class="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >{{ $t('table.edit') }}</el-link>
            <el-link
              v-if="!scope.row.installed"
              v-permission="['role.delete']"
              class="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
            >{{ $t('table.delete') }}
            </el-link>
            <el-link
              v-if="!scope.row.installed"
              v-permission="['role.grant']"
              class="el-icon-s-custom"
              @click="handleGrant(scope.row)"
            >{{ $t('table.grant') }}
            </el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-show="pager.pager.recordCount>0"
        :current-page.sync="pager.pager.pageNumber"
        :page-sizes="[10, 15, 20, 30, 50, 99]"
        :page-size="pager.pager.pageSize"
        :total="pager.pager.recordCount"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      v-permission="['role.add', 'role.edit']"
      :title="role.id == 0 ? $t('table.add'): $t('table.edit') "
      :visible.sync="addEditShow"
      width="480px"
    >
      <el-form
        ref="editForm"
        :model="role"
        :rules="formRules"
        label-width="100px"
        style="width: 400px;"
      >
        <el-form-item :label="$t('table.name')" prop="name">
          <el-input
            v-model="role.name"
            auto-complete="off"
            :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.name')}`"
            suffix-icon="el-icon-fa-vcard"
          />
        </el-form-item>
        <el-form-item :label="$t('table.description')" prop="description">
          <el-input
            v-model="role.description"
            :maxlength="500"
            :autosize="{ minRows: 4, maxRows: 8}"
            type="textarea"
            auto-complete="off"
            :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.description')}`"
            suffix-icon="el-icon-fa-file-word-o"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addEditShow = false ; role = {installed:false}">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="updateRole('editForm')"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 设置角色权限 -->
    <permission-groups
      v-if="grantShow"
      :show.sync="grantShow"
      :title="role.name + $t('acl.permissionSet')"
      :cur-permission-value-list="curPermissionValueList"
      :permission-data="permissionData"
      value-prop-name="id"
      @confirm="permissionConfirm"
    />
  </div>
</template>
<script>
import { windowWidth, deepClone } from '@/utils'
import waves from '@/directive/waves'
import checkPermission from '@/utils/permission'
import { PermissionGroups } from '@/views/components'
import defaultHtml from '@/directive/defaultHtml'
import rules from '@/utils/formRules'
import api from '@/api'
import { mapGetters } from 'vuex'

export default {
  name: 'UserRole',
  components: {
    PermissionGroups
  },
  directives: {
    waves,
    defaultHtml
  },
  filters: {

  },
  data() {
    return {
      permissionData: [],
      curPermissionValueList: [],

      listLoading: true,
      listQuery: {
        searchKey: ''
      },
      formRules: rules,
      pager: {
        pager: {
          pageCount: 0,
          pageNumber: 1,
          pageSize: this.$store.getters.pageSize,
          recordCount: 0
        }
      },
      selected: [],
      options: [],
      addEditShow: false,
      grantShow: false,
      role: {
        id: 0,
        name: '',
        description: '',
        installed: false
      },
      multipleSelection: []
    }
  },
  computed: {
    dialogWidth() {
      return 590 * 100 / windowWidth() + '%'
    },
    ...mapGetters({
      loginUser: 'user',
      branchNameList: 'branchNameList'
    })
  },
  watch: {
    options: function() {
      this.selected = []
      this.options.forEach(item => {
        if (item.selected) {
          this.selected.push(item.key)
        }
      })
    }
  },
  mounted: function() {
    this.listQuery.branchId = this.loginUser.branchId > 0 ? this.loginUser.branchId : 0
    this.loadData()
  },
  methods: {
    checkPermission,
    handleCheckAllchange(checked, ontionsIndex) {
      this.permissionsOptions[ontionsIndex].forEach(option => {
        option.checked = checked
      })
    },

    grant() {
      api.Role.grant(this.role.id, this.selected).then(result => {
        this.$message({
          type: 'success',
          message: '授权成功!'
        })
        this.grantShow = false
      })
    },
    handleCurrentChange() {
      this.loadData()
    },
    handleSizeChange(val) {
      this.pager.pager.pageSize = val
      this.$store.commit('SET_PAGESIZE', val)
      this.loadData()
    },
    handleCreate() {
      this.role = {
        id: 0,
        name: '',
        description: '',
        installed: false
      }
      this.addEditShow = true
    },
    updateRole(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var callback = result => {
            this.handleCurrentChange()
            this.addEditShow = false
            this.$message({
              type: 'success',
              message: (this.role.id ? '编辑' : '添加') + '成功!'
            })
          }
          this.role.id
            ? api.Role.update(this.role).then(callback)
            : api.Role.save(this.role).then(callback)
        }
      })
    },
    handleUpdate(row) {
      this.role = deepClone(row)
      this.addEditShow = true
    },
    handleGrant(row, type) {
      this.role = row
      api.User.permissions().then(res => {
        this.permissionData = res.permissions
        // 获取角色的权限列表
        api.Role.roleGrantInfo(row.id).then(resRole => {
          this.curPermissionValueList = resRole.permissions.filter(v => v.selected === 1).map(v => v.id)
          this.grantShow = true
        })
      })
    },
    permissionConfirm(permissionValList) {
      api.Role.grant(this.role.id, permissionValList)
        .then(result => {
          this.grantShow = false
          this.$message({
            type: 'success',
            message: '编辑成功!'
          })
        })
        .catch(err => {
          throw err
        })
    },
    handleDelete(row) {
      this.$confirm(`${this.$t('table.confirm')} ${this.$t('table.delete')} <${row.name}> ?`, this.$t('table.deleteConfirm'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        api.Role.delete(row.id).then(result => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadData()
        })
      })
    },
    handleDeleteSelected(rows) {
      if (rows.length === 0) return

      this.$confirm(`${this.$t('table.confirm')} ${this.$t('table.delete')} <${rows.map(v => v.name).join(',')}> ?`, this.$t('table.deleteConfirm'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        Promise.all(rows.map(v => api.Role.delete(v.id))).then(result => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadData()
        })
      })
    },
    loadData() {
      api.Role.list(this.pager.pager.pageNumber, this.pager.pager.pageSize, this.listQuery.searchKey).then(result => {
        this.pager = result.pager
        this.listLoading = false
      })
    }
  }
}
</script>
