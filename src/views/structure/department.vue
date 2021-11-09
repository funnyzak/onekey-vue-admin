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
        v-permission="['dept.add']"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
      <el-button
        v-if="multipleSelection.length > 0"
        v-permission="['dept.delete']"
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
      lazy
      fit
      row-key="id"
      :load="remote"
      :tree-props="{hasChildren: 'hasChildren'}"
      style="width: 100%;"
      @selection-change="(val) => { multipleSelection = val }"
    >
      <el-table-column
        v-if="['dept.delete']"
        type="selection"
        width="30"
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
        v-if="checkPermission(['dept.edit','dept.delete','dept.user.edit'])"
        :label="$t('table.actions')"
        fixed="right"
        align="left"
        width="170"
        class-name="small-padding"
      >
        <template slot-scope="scope">
          <div v-default-html="'无'">
            <el-link
              v-permission="['dept.edit']"
              type="primary"
              class="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >{{ $t('table.edit') }}</el-link>
            <el-link
              v-permission="['dept.user.edit']"
              type="info"
              class="el-icon-user"
              @click="handleGrant(scope.row)"
            >{{ $t('table.member') }}</el-link>
            <el-link
              v-permission="['dept.delete']"
              type="danger"
              class="el-icon-delete"
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

    <el-dialog
      v-permission="['dept.add', 'dept.edit']"
      :title="department.id ? $t('structure.deptEdit') : $t('structure.deptAdd') "
      :visible.sync="addEditShow"
      width="500px"
      @close="resetDepartment"
    >
      <el-form
        ref="editForm"
        :model="department"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item
          v-if="addEditShow"
          :label="$t('table.department')"
          prop="parentId"
        >
          <department-select v-model="department.parentId" :disabled="department.id && department.id > 0" />
        </el-form-item>
        <el-form-item
          :label="$t('table.name')"
          prop="name"
        >
          <el-input
            v-model="department.name"
            placeholder="添加多个请用半角逗号分割"
            auto-complete="off"
          />
        </el-form-item>

        <el-form-item
          :label="$t('table.description')"
          prop="description"
        >
          <el-input
            v-model="department.description"
            :maxlength="500"
            :autosize="{ minRows: 4, maxRows: 8}"
            type="textarea"
            auto-complete="off"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addEditShow = false ; department = { status: 'ACTIVED' }">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="updateDepartment('editForm')"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
    <dept-user-list v-if="grandShow" :show.sync="grandShow" :dept="department" />
  </div>
</template>
<script>
import checkPermission from '@/utils/permission'
import DeptUserList from './components/DeptUserList'
import DepartmentSelect from '@/views/components/Select/DepartmentSelect'
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
import waves from '@/directive/waves'
import defaultHtml from '@/directive/defaultHtml'
import rules from '@/utils/formRules'
import api from '@/api'
export default {
  name: 'Department',
  components: {
    DeptUserList,
    DepartmentSelect
  },
  directives: {
    waves,
    defaultHtml
  },
  data() {
    return {
      listLoading: true,
      addEditShow: false,
      grandShow: false,
      listQuery: {
        searchKey: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      pager: {
        pager: {
          pageCount: 0,
          pageNumber: 1,
          pageSize: this.$store.getters.pageSize,
          recordCount: 0
        }
      },
      department: {},
      formRules: rules,
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters({
      loginUser: 'user'
    })
  },
  mounted() {
    this.loadData()
  },
  methods: {
    checkPermission,
    resetDepartment() {
      this.department = {}
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
      this.department = {
        parentId: null,
        orderId: 0
      }
      this.addEditShow = true
    },
    handleGrant(row) {
      this.department = deepClone(row)
      this.grandShow = true
    },
    handleUpdate(row) {
      this.department = deepClone(row)
      this.addEditShow = true
    },
    updateDepartment(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.department.parentId = this.department.parentId === null ? 0 : this.department.parentId
          var callback = result => {
            this.handleCurrentChange()
            this.addEditShow = false
            this.$message({
              type: 'success', message: (this.department.id ? '编辑' : '添加') + '成功!'
            })
          }
          if (this.department.id) {
            api.Department.update(this.department).then(callback)
          } else {
            const nameList = this.department.name.split(',')
            Promise.all(nameList.map(v => api.Department.save(Object.assign({}, this.department, { name: v })))).then(callback)
          }
        }
      })
    },
    handleDelete(row) {
      this.$confirm(`${this.$t('table.confirm')} ${this.$t('table.delete')} <${row.name}> ?`, this.$t('table.deleteConfirm'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        api.Department.delete(row.id).then(result => {
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
        Promise.all(rows.map(v => api.Department.delete(v.id))).then(result => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadData()
        })
      })
    },
    remote(row, treeNode, resolve) {
      api.Department.list(1, 100, '', row.id).then(result => {
        if (result.pager.dataList == null) return resolve([])
        result.pager.dataList.forEach(item => {
          item.hasChildren = true
        })
        resolve(result.pager.dataList)
      })
    },
    loadData() {
      this.pager.dataList = []
      api.Department.list(this.pager.pager.pageNumber, this.pager.pager.pageSize, this.listQuery.searchKey, 0, this.listQuery.branchId).then(result => {
        this.pager = result.pager
        this.listLoading = false
        if (this.pager.dataList === null) this.pager.dataList = []
        this.pager.dataList.forEach(item => {
          item.hasChildren = true
        })
      })
    }
  }
}
</script>
