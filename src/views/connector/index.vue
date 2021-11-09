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
        v-permission="['connector.add']"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
      <el-button
        v-if="multipleSelection.length > 0"
        v-permission="['connector.delete']"
        class="filter-item"
        style="margin-left: 10px;"
        type="danger"
        icon="el-icon-delete"
        @click="handleDeleteSelected(multipleSelection)"
      >{{ $t('table.delete') }}</el-button>
      <el-button
        v-if="multipleSelection.length > 0"
        v-permission="['connector.edit']"
        class="filter-item"
        style="margin-left: 10px;"
        type="danger"
        icon="el-icon-lock"
        @click="handleResetSelected(multipleSelection)"
      >{{ $t('table.resetSecret') }}</el-button>
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
        v-if="['connector.delete']"
        type="selection"
        width="55"
      />
      <el-table-column
        :label="$t('table.name')"
        align="left"
        show-overflow-tooltip
        min-width="150"
      >
        <template slot-scope="scope">
          <span>
            <el-tag
              :type="scope.row.enable ? 'success':'info'"
              close-transition
            >{{ scope.row.enable ? $t('table.enable') : $t('table.disabled') }}
            </el-tag>
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.appId')"
        show-overflow-tooltip
        align="left"
        min-width="90"
      >
        <template slot-scope="scope">
          <span> {{ scope.row.appId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Secret ID"
        show-overflow-tooltip
        align="left"
        min-width="110"
      >
        <template slot-scope="scope">
          <span
            v-clipboard:copy="scope.row.secretId"
            v-clipboard:success="clipboardSuccess"
          >{{ scope.row.secretId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Secret Key"
        show-overflow-tooltip
        align="left"
        min-width="150"
      >
        <template slot-scope="scope">
          <span
            v-clipboard:copy="`${scope.row.secretKey}`"
            v-clipboard:success="clipboardSuccess"
          >{{ scope.row.secretKey }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.verify')"
        show-overflow-tooltip
        align="left"
        min-width="120"
      >
        <template slot-scope="scope">
          <span>
            <i class="el-icon-time" title="验证时间戳">{{ scope.row.verifyTS ? $t('table.enable') : $t('table.close') }}</i>
            <i class="el-icon-lock" title="验证签名">{{ scope.row.verifyAppSign ? $t('table.enable') : $t('table.close') }}</i>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.whiteIp')"
        show-overflow-tooltip
        align="left"
        min-width="110"
      >
        <template slot-scope="scope">
          <span v-default-html="'不限制'">{{ scope.row.whiteIps }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.permission')"
        show-overflow-tooltip
        min-width="130"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ $t(`enum.connector.power.${scope.row.power}`) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.updateTime')"
        min-width="150"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.intro')"
        show-overflow-tooltip
        align="left"
        min-width="180"
      >
        <template slot-scope="scope">
          <span v-default-html="'无'">{{ scope.row.intro }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission(['connector.edit','connector.delete'])"
        :label="$t('table.actions')"
        align="left"
        width="300"
        fixed="right"
        class-name="small-padding"
      >
        <template slot-scope="scope">
          <div v-default-html="'无'">
            <el-link
              v-permission="['connector.edit']"
              type="primary"
              class="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >{{ $t('table.edit') }}</el-link>
            <el-link
              v-permission="['connector.edit']"
              class="el-icon-s-custom"
              @click="handleGrant(scope.row)"
            >{{ $t('table.grant') }}</el-link>
            <el-link
              v-permission="['connector.delete']"
              type="danger"
              class="el-icon-delete"
              @click="handleDelete(scope.row)"
            >{{ $t('table.delete') }}
            </el-link>
            <el-link
              v-permission="['connector.edit']"
              type="info"
              class="el-icon-intro"
              @click="handleResetSecret(scope.row)"
            >{{ $t('table.resetSecret') }}
            </el-link>
            <el-link
              v-clipboard:copy="`名称: ${scope.row.name}
AppId:${scope.row.appId}
Secret Id:${scope.row.secretId}
Secret Key:${scope.row.secretKey}

Request Header:
X-APP-ID: ${scope.row.appId}
X-CS-ID: ${scope.row.secretId}
X-TIMESTAMP: 毫秒时间戳
X-APP-SIGN: MD5(RoutePath+Timestamp+SecretKey)
X-AUTH-TOKEN: LoginedTokenString
`"
              v-clipboard:success="clipboardSuccess"
              type="info"
              class="el-icon-intro"
            >{{ $t('table.copySecret') }}
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
    <edit-component v-if="addEditShow" v-model="info" :show.sync="addEditShow" @success="handleSuccess" />
    <permission-groups
      v-if="grantShow"
      :show.sync="grantShow"
      :title="info.name + $t('acl.permissionSet')"
      :cur-permission-value-list="curPermissionValueList"
      :permission-data="permissionData"
      value-prop-name="_name"
      @confirm="permissionConfirm"
    />
  </div>
</template>
<script>
import { deepClone, parseTime } from '@/utils'
import clipboard from '@/directive/clipboard'
import checkPermission from '@/utils/permission'
import EditComponent from './components/Edit'
import { PermissionGroups } from '@/views/components'
import waves from '@/directive/waves'
import defaultHtml from '@/directive/defaultHtml'
import api from '@/api'

export default {
  name: 'Connector',
  directives: {
    waves,
    clipboard,
    defaultHtml
  },
  components: {
    EditComponent,
    PermissionGroups
  },
  data() {
    return {
      grantShow: false,
      permissionData: [],
      curPermissionValueList: [],

      listLoading: true,
      listQuery: {
        searchKey: '',
        connectorId: null
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
      addEditShow: false,
      info: {},
      multipleSelection: []
    }
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
    this.loadData()
  },
  methods: {
    checkPermission,
    parseTime,
    handleSuccess(rlt) {
      this.loadData()
    },
    clipboardSuccess() {
      this.$message({ message: '成功复制', type: 'success' })
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
      this.info = { id: 0 }
      this.addEditShow = true
    },
    handleGrant(row) {
      this.info = row
      api.Connector.permissionInfoList().then(res => {
        this.permissionData = res.list
        this.curPermissionValueList = row.permissionList
        this.grantShow = true
      })
    },
    permissionConfirm(permissionValList) {
      this.info.permissionList = permissionValList
      api.Connector.update(this.info)
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
    handleResetSecret(row) {
      this.$confirm(`${this.$t('table.confirm')} ${this.$t('table.resetSecret')} <${row.name}> ?`, this.$t('table.confirm'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        api.Connector.reset(row.secretId).then(result => {
          this.$message({
            type: 'success',
            message: '重置成功!'
          })
          this.loadData()
        })
      })
    },
    handleResetSelected(rows) {
      if (rows.length === 0) return

      this.$confirm(`${this.$t('table.confirm')} ${this.$t('table.resetSecret')} <${rows.map(v => v.name).join(',')}> ?`, this.$t('table.confirm'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        Promise.all(rows.map(v => api.Connector.reset(v.secretId))).then(result => {
          this.$message({
            type: 'success',
            message: '重置成功!'
          })
          this.loadData()
        })
      })
    },
    handleUpdate(row) {
      this.info = deepClone(row)
      this.addEditShow = true
    },
    handleDelete(row) {
      this.$confirm(`${this.$t('table.confirm')} ${this.$t('table.resetSecret')} <${row.name}> ?`, this.$t('table.confirm'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        api.Connector.delete(row.secretId).then(result => {
          this.$message({
            type: 'success',
            message: '重置成功!'
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
        Promise.all(rows.map(v => api.Connector.delete(v.secretId))).then(result => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadData()
        })
      })
    },
    loadData() {
      api.Connector.list(this.pager.pager.pageNumber, this.pager.pager.pageSize, this.listQuery.connectorId, this.listQuery.searchKey).then(result => {
        this.pager = result.pager
        this.listLoading = false
      })
    }
  }
}
</script>
