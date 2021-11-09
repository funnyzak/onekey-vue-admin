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
        v-permission="['user.add']"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >{{ $t('table.export') }}</el-button>
      <el-button
        v-if="multipleSelection.length > 0"
        v-permission="['user.delete']"
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
        v-if="['user.delete']"
        type="selection"
        width="55"
      />
      <el-table-column
        :label="$t('table.headKey')"
        min-width="80"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <img-view width="35px" height="35px" :url="scope.row.headKey" preview :def="defAvatar" />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.userName')"
        min-width="100"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.realName')"
        min-width="100"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.contact')"
        min-width="150"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span><br>
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.createDate')"
        min-width="150"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.status')"
        min-width="100"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status
            == 'ACTIVE' ? 'ACTIVE' : 'DISABLED' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission(['user.edit','user.delete','user.role','user.grant','user.setting.password'])"
        :label="$t('table.actions')"
        align="left"
        width="300"
        fixed="right"
        class-name="small-padding"
      >
        <template slot-scope="scope">
          <div v-default-html="'无'">
            <el-link
              v-permission="['user.edit']"
              class="el-icon-edit"
              type="primary"
              @click="handleUpdate(scope.row)"
            >{{ $t('table.edit') }}</el-link>
            <el-link
              v-permission="['user.setting.password']"
              class="el-icon-lock"
              @click="handleResetPassword(scope.row)"
            >{{ $t('table.resetPassword') }}</el-link>
            <el-link
              v-if="loginUser.id !== scope.row.id && scope.row.id !== 1"
              v-permission="['user.delete']"
              class="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
            >{{ $t('table.delete') }}</el-link>
            <el-link
              v-if="loginUser.id !== scope.row.id && scope.row.id !== 1"
              v-permission="['user.role']"
              class="el-icon-user"
              @click="handleGrant(scope.row, 'role')"
            >{{ $t('table.role') }}</el-link>
            <el-link
              v-if="loginUser.id !== scope.row.id && scope.row.id !== 1"
              v-permission="['user.grant']"
              class="el-icon-s-custom"
              @click="handUserGrant(scope.row, 'permission')"
            >{{ $t('table.grant') }}</el-link>
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
    <update-profile v-permission="['user.add', 'user.edit']" :user-info="user" :show.sync="addEditShow" @saveInfo="loadData()" />
    <el-dialog
      v-permission="['user.edit']"
      :visible.sync="resetShow"
      :title="$t('acl.resetPassword')"
      width="30%"
    >
      <el-form
        ref="resetForm"
        :model="user"
      >
        <el-form-item
          :label="$t('table.password')"
          prop="password"
        >
          <el-input
            v-model="user.password"
            type="password"
            auto-complete="off"
            suffix-icon="el-icon-fa-lock"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="resetShow = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="resetPassword('resetForm')"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="currentUser.realName + (type == 'role' ? $t('acl.roleSet') : type == 'permission'? $t('acl.permissionSet') : '设置')"
      :visible.sync="grantShow"
      width="540px"
    >
      <template>
        <el-transfer
          v-model="selected"
          :data="options"
          :titles="[$t('table.waitSelect'), $t('table.selected')]"
          filterable
        />
      </template>
      <div slot="footer" style="paddingRight:5px">
        <el-button @click="grantShow = false">
          {{
            $t('table.cancel')
          }}
        </el-button>
        <el-button type="success" @click="grant">
          {{
            $t('table.confirm')
          }}
        </el-button>
      </div>
    </el-dialog>
    <!-- 设置用户权限 -->
    <permission-groups
      v-if="userGrantShow"
      :show.sync="userGrantShow"
      :title="currentUser.realName + $t('acl.permissionSet')"
      :cur-permission-value-list="curPermissionValueList"
      :permission-data="permissionData"
      value-prop-name="id"
      @confirm="permissionConfirm"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { parseTime, deepClone } from '@/utils'
import checkPermission from '@/utils/permission'
import UpdateProfile from '@/views/components/Profile'
import { PermissionGroups } from '@/views/components'
import ImgView from '@/components/ImageView/index.vue'
import waves from '@/directive/waves'
import defaultHtml from '@/directive/defaultHtml'
import defAvatar from '@/assets/images/avatar.png'
import api from '@/api'
export default {
  name: 'UserManager',
  components: {
    UpdateProfile,
    PermissionGroups,
    ImgView
  },
  directives: {
    waves,
    defaultHtml
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        ACTIVED: 'success',
        DISABLED: 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      defAvatar,
      currentUser: {},
      userGrantShow: false,

      permissionData: [],
      curPermissionValueList: [],

      downloadLoading: false,
      listLoading: true,
      listQuery: {
        searchKey: ''
      },
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
      resetShow: false,
      grantShow: false,
      type: 'role',
      user: {
        id: 0,
        name: '',
        realName: '',
        status: 'ACTIVED',
        password: '',
        phone: '',
        email: ''
      },
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters({
      loginUser: 'user'
    })
  },
  watch: {
    options: function() {
      this.selected = []
      this.options.forEach(item => {
        if (item.selected && item.selected === 1) {
          this.selected.push(item.key)
        }
      })
    }
  },
  created: function() {
    this.listQuery.branchId = this.loginUser.branchId > 0 ? this.loginUser.branchId : 0
    this.loadData()
  },
  methods: {
    checkPermission,
    grant() {
      api.User.grant(this.currentUser.id, this.type, this.selected).then(result => {
        this.$message({
          type: 'success',
          message: '授权成功!'
        })
        this.grantShow = false
      })
    },
    resetPassword(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.User.resetPassword(
            this.user.id,
            this.user.name,
            this.user.password).then(
            result => {
              this.$message({
                type: 'success',
                message: '重置成功!'
              })
              this.resetShow = false
            }
          )
        } else {
          return false
        }
      })
    },
    handleResetPassword(row) {
      this.user.id = row.id
      this.user.name = row.name
      this.user.password = ''
      this.resetShow = true
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
      this.addEditShow = true
      this.user = {
        id: 0,
        name: '',
        realName: '',
        status: 'ACTIVED',
        password: '',
        rePassword: '',
        phone: '',
        email: ''
      }
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '用户名', '真实姓名', '添加时间', '当前状态']
        const filterVal = ['id', 'name', 'realName', 'createTime', 'status']
        const data = this.formatJson(filterVal, this.pager.dataList)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    handleUpdate(row) {
      this.user = deepClone(row)
      this.user.password = '00000000'
      this.addEditShow = true
    },
    // 角色权限
    handleGrant(row, type) {
      this.currentUser = row
      this.type = type
      api.User.userGrantInfo(type, row.id).then(result => {
        this.options = []
        const list = result[`${type}s`]
        list.filter(v => {
          return v.id !== 1
        }).forEach((item, index) => {
          this.options.push({
            key: item.id,
            label: item.name,
            selected: item.selected
          })
        })
        this.grantShow = true
      })
    },

    // 获取用户的直接权限列表(额外添加的权限，不包括角色权限)
    handUserGrant(row, type) {
      this.currentUser = row

      // 获取我的权限列表
      api.User.permissions().then(res => {
        this.permissionData = res.permissions
        api.User.userDirectPermission(row.id).then(resUser => {
          this.curPermissionValueList = resUser.permissions.map(v => v.id)
          this.userGrantShow = true
        })
      })
    },
    // 用户权限授权
    permissionConfirm(permissionValList) {
      api.User.userGrantEdit(this.currentUser.id, permissionValList)
        .then(result => {
          this.userGrantShow = false
          this.$message({
            type: 'success',
            message: '编辑成功!'
          })
        })
        .catch(err => {
          throw err
        })
    },
    handleDeleteSelected(rows) {
      if (rows.length === 0) return

      this.$confirm(`${this.$t('table.confirm')} ${this.$t('table.delete')} <${rows.map(v => v.name).join(',')}> ?`, this.$t('table.deleteConfirm'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        Promise.all(rows.map(v => api.User.delete(v.id))).then(result => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadData()
        })
      })
    },
    handleDelete(row) {
      this.$confirm(`${this.$t('table.confirm')} ${this.$t('table.delete')} <${row.name}> ?`, this.$t('table.deleteConfirm'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        api.User.delete(row.id).then(result => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadData()
        })
      })
    },
    loadData() {
      api.User.list(this.pager.pager.pageNumber, this.pager.pager.pageSize, this.listQuery.searchKey).then(result => {
        this.pager = result.pager
        this.listLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
