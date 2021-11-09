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
        v-permission="['permission.add']"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
      <el-button
        v-if="multipleSelection.length > 0"
        v-permission="['permission.delete']"
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
        v-if="['permission.delete']"
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
        :label="$t('table.group')"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.group }}</span>
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
        :label="$t('table.type')"
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
        v-if="checkPermission(['permission.edit','permission.delete'])"
        :label="$t('table.actions')"
        align="left"
        width="120"
        class-name="small-padding"
      >
        <template slot-scope="scope">
          <div v-default-html="'无'">
            <el-link
              v-permission="['permission.edit']"
              class="el-icon-edit"
              type="primary"
              @click="handleUpdate(scope.row)"
            >{{ $t('table.edit') }}</el-link>
            <el-link
              v-if="!scope.row.installed"
              v-permission="['permission.delete']"
              class="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.row)"
            >{{ $t('table.delete') }}
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

    <!-- 添加、编辑权限列表 -->
    <el-dialog
      v-permission="['permission.add','permission.edit']"
      :title="permission.id == 0 ? $t('table.add'): $t('table.edit') "
      :visible.sync="addEditShow"
      width="480px"
    >
      <el-form
        v-if="addEditShow"
        ref="editForm"
        :model="permission"
        :rules="formRules"
        label-width="100px"
        style="width: 400px;"
      >

        <el-form-item
          :label="$t('table.group')"
          prop="group"
        >
          <el-input
            v-model="permission.group"
            :maxlength="500"
            :disabled="permission.installed"
            :autosize="{ minRows: 1, maxRows: 2}"
            type="textarea"
            auto-complete="off"
            :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.group')}`"
            suffix-icon="el-icon-fa-file-word-o"
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.name')"
          prop="name"
        >
          <el-input
            v-model="permission.name"
            :disabled="permission.installed"
            auto-complete="off"
            :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.name')}`"
            suffix-icon="el-icon-fa-vcard"
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.description')"
          prop="description"
        >
          <el-input
            v-model="permission.description"
            :maxlength="500"
            :disabled="permission.installed"
            :autosize="{ minRows: 1, maxRows: 2}"
            type="textarea"
            auto-complete="off"
            :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.description')}`"
            suffix-icon="el-icon-fa-file-word-o"
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.tips')"
          prop="intro"
        >
          <el-input
            v-model="permission.intro"
            :maxlength="500"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            auto-complete="off"
            :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.tips')}`"
            suffix-icon="el-icon-fa-file-word-o"
          />
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        style="paddingRight:40px"
      >
        <el-button @click="addEditShow = false ; permission = {installed:false}">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="updatePermission('editForm')"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { windowWidth, deepClone } from '@/utils'
import checkPermission from '@/utils/permission'
import waves from '@/directive/waves' // 水波纹指令
import defaultHtml from '@/directive/defaultHtml'
import rules from '@/utils/formRules'
import api from '@/api'
export default {
  name: 'Permission',
  directives: {
    waves,
    defaultHtml
  },
  filters: {

  },
  data() {
    return {
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
      permissionListString: '',
      addEditShow: false,
      permission: {
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
    handleCurrentChange() {
      this.loadData()
    },
    handleSizeChange(val) {
      this.pager.pager.pageSize = val
      this.$store.commit('SET_PAGESIZE', val)
      this.loadData()
    },
    handleCreate() {
      this.permission = {
        id: 0,
        name: '',
        description: '',
        installed: false
      }
      this.addEditShow = true
    },
    updatePermission(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var callback = result => {
            this.handleCurrentChange()
            this.addEditShow = false
            this.$message({
              type: 'success',
              message: (this.permission.id ? '编辑' : '添加') + '成功!'
            })
          }
          this.permission.id
            ? api.Permission.update(this.permission).then(callback)
            : api.Permission.save(this.permission).then(callback)
        }
      })
    },
    handleUpdate(row) {
      this.permission = deepClone(row)
      this.addEditShow = true
    },
    handleDelete(row) {
      this.$confirm(`${this.$t('table.confirm')} ${this.$t('table.delete')} <${row.name}> ?`, this.$t('table.deleteConfirm'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        api.Permission.delete(row.id).then(result => {
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
        Promise.all(rows.map(v => api.Permission.delete(v.id))).then(result => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadData()
        })
      })
    },
    loadData() {
      api.Permission.list(this.pager.pager.pageNumber, this.pager.pager.pageSize, this.listQuery.searchKey).then(result => {
        this.pager = result.pager
        this.listLoading = false
      })
    }
  }
}
</script>
