<template>
  <div class="app-container">
    <div class="filter-container">
      <string-select
        v-model="listQuery.gender"
        style="width:110px"
        name="性别"
        :sel-data="Constants.Member.Gender"
      />
      <el-input
        v-model="listQuery.registerIp"
        :placeholder="$t('table.registerIp')"
        style="width: 120px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.phone"
        :placeholder="$t('table.phone')"
        style="width: 120px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.email"
        :placeholder="$t('table.email')"
        style="width: 120px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.appId"
        :placeholder="$t('table.appId')"
        style="width: 120px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.realName"
        :placeholder="$t('table.realName')"
        style="width: 120px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.username"
        :placeholder="$t('table.username')"
        style="width: 170px;"
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
        v-permission="['member.info.add']"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
      <el-button
        v-if="multipleSelection.length > 0"
        v-permission="['member.info.delete']"
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
        v-if="['member.info.delete']"
        type="selection"
        width="55"
      />
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
        :label="$t('table.avatar')"
        min-width="80"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <img-view width="35px" height="35px" :url="scope.row.avatar" preview :def="defAvatar" />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.username')"
        align="left"
        show-overflow-tooltip
        min-width="150"
      >
        <template slot-scope="scope">
          <span :style="{color: scope.row.gender === 'WOMEN' ? '#F56C6C': ''}">
            <el-tag
              :type="!scope.row.locked ? 'success':'info'"
              close-transition
            >{{ !scope.row.locked ? $t('table.normal') : $t('table.locked') }}
            </el-tag>
            {{ scope.row.username | defaultHTML('未设置') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.email')"
        align="left"
        show-overflow-tooltip
        min-width="150"
      >
        <template slot-scope="scope">
          <span>
            {{ scope.row.email | defaultHTML('未设置') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.phone')"
        align="left"
        show-overflow-tooltip
        min-width="110"
      >
        <template slot-scope="scope">
          <span>
            {{ scope.row.phone | defaultHTML('未设置') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.idNum')"
        align="left"
        show-overflow-tooltip
        min-width="120"
      >
        <template slot-scope="scope">
          <span>
            {{ scope.row.idNum | defaultHTML('未设置') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.realName')"
        align="left"
        show-overflow-tooltip
        min-width="110"
      >
        <template slot-scope="scope">
          <span>
            {{ scope.row.realName | defaultHTML('未设置') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        :label="$t('table.gender')"
        align="left"
        show-overflow-tooltip
        min-width="70"
      >
        <template slot-scope="scope">
          <span>
            {{ scope.row.gender }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.registerTime')"
        min-width="145"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.registerTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.registerIp')"
        align="left"
        show-overflow-tooltip
        min-width="110"
      >
        <template slot-scope="scope">
          <span>
            {{ scope.row.registerIp }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission(['member.info.edit','member.info.reset.pwd','member.info.delete'])"
        :label="$t('table.actions')"
        align="left"
        width="240"
        fixed="right"
        class-name="small-padding"
      >
        <template slot-scope="scope">
          <div v-default-html="'无'">
            <el-link
              v-permission="['member.info.edit']"
              type="primary"
              class="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >{{ $t('table.edit') }}</el-link>
            <el-link
              v-if="checkPermission(['member.info.edit'])"
              :type="scope.row.locked? 'warning':'info'"
              class="el-icon-lock"
              @click="handleLock(scope.row, !scope.row.locked)"
            >{{ scope.row.locked ? '解锁': '锁定' }}
            </el-link>
            <el-link
              v-permission="['member.info.delete']"
              type="danger"
              class="el-icon-delete"
              @click="handleDelete(scope.row)"
            >{{ $t('table.delete') }}
            </el-link>
            <el-link
              v-permission="['member.info.reset.pwd']"
              type="info"
              class="el-icon-intro"
              @click="handleResetPassword(scope.row)"
            >{{ $t('table.resetPassword') }}
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
    <el-dialog
      v-permission="['member.info.reset.pwd']"
      :visible.sync="resetShow"
      :title="$t('acl.resetPassword')"
      width="30%"
    >
      <el-form
        ref="resetForm"
        :model="info"
      >
        <el-form-item
          :label="$t('table.password')"
          prop="pwd"
        >
          <el-input
            v-model="info.pwd"
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
  </div>
</template>
<script>
import { deepClone, parseTime } from '@/utils'
import clipboard from '@/directive/clipboard'
import checkPermission from '@/utils/permission'
import EditComponent from './components/Edit'
import ImgView from '@/components/ImageView/index.vue'
import defAvatar from '@/assets/images/avatar.png'
import waves from '@/directive/waves'
import * as Constants from '@/utils/constants'
import defaultHtml from '@/directive/defaultHtml'
import { StringSelect } from '@/views/components'
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
    StringSelect,
    ImgView
  },
  data() {
    return {
      Constants,
      defAvatar,
      resetShow: false,
      listLoading: true,
      listQuery: {
        registerIp: null,
        appId: null,
        realName: null,
        gender: null,
        username: null,
        idNum: null,
        phone: null
      },
      listOrder: {
        orderBy: 'id',
        orderDesc: true
      },
      pager: {
        pager: {
          pageCount: 0,
          pageNumber: 1,
          pageSize: this.$store.getters.pageSize,
          recordCount: 0
        }
      },
      addEditShow: false,
      info: {},
      multipleSelection: []
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
    handleLock(row, locked) {
      api.Member.lock(row.id, locked).then(result => {
        this.$message({
          type: 'success',
          message: `${locked ? '锁定' : '解锁'}成功!`
        })
        this.loadData()
      })
    },
    handleResetPassword(row) {
      this.info = row
      this.resetShow = true
    },
    resetPassword(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.Member.resetPwd(
            this.info.id,
            this.info.pwd).then(
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
    handleUpdate(row) {
      this.info = deepClone(row)
      this.addEditShow = true
    },
    handleDelete(row) {
      this.$confirm(`${this.$t('table.confirm')} ${this.$t('table.delete')} <${row.username}> ?`, this.$t('table.confirm'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        api.Member.remove(row.id).then(result => {
          this.$message({
            type: 'success',
            message: '删除成果!'
          })
          this.loadData()
        })
      })
    },
    handleDeleteSelected(rows) {
      if (rows.length === 0) return

      this.$confirm(`${this.$t('table.confirm')} ${this.$t('table.delete')} <${rows.map(v => v.username).join(',')}> ?`, this.$t('table.deleteConfirm'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        Promise.all(rows.map(v => api.Member.remove(v.id))).then(result => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadData()
        })
      })
    },
    loadData() {
      api.Member.list(this.pager.pager.pageNumber, this.pager.pager.pageSize, this.listOrder, this.listQuery).then(result => {
        this.pager = result.pager
        this.listLoading = false
      })
    }
  }
}
</script>
