<template>
  <div class="app-container">
    <div class="filter-container">
      <data-rule-type-select v-model="listQuery.dataRuleType" @change="loadData" />
      <data-rule-module-select v-model="listQuery.dataModule" @change="loadData" />
      <el-button
        v-permission="['data.permission.add']"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
      <el-button
        v-if="multipleSelection.length > 0"
        v-permission="['data.permission.delete']"
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
        v-if="['data.permission.delete']"
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
        :label="$t('table.module')"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ dataRuleModuleList[scope.row.module] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.ruleType')"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ dataRuleType[scope.row.ruleType] }}</span>
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
        :label="$t('table.addTime')"
        min-width="150"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.addTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission(['data.permission.edit','data.permission.delete'])"
        :label="$t('table.actions')"
        align="left"
        width="130"
        class-name="small-padding"
      >
        <template slot-scope="scope">
          <div v-default-html="'无'">
            <el-link
              v-permission="['data.permission.edit']"
              class="el-icon-edit"
              type="primary"
              @click="handleUpdate(scope.row)"
            >{{ $t('table.edit') }}</el-link>
            <el-link
              v-if="!scope.row.installed"
              v-permission="['data.permission.delete']"
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
      v-permission="['data.permission.add','data.permission.edit']"
      :title="info.id == 0 ? $t('table.add'): $t('table.edit') "
      :visible.sync="addEditShow"
      width="480px"
    >
      <el-form
        v-if="addEditShow"
        ref="editForm"
        :model="info"
        label-width="100px"
        style="width: 400px;"
      >
        <el-form-item
          :label="$t('table.module')"
          prop="module"
          required
        >
          <data-rule-module-select v-model="info.module" :disabled="info.id > 0" />
        </el-form-item>
        <el-form-item
          :label="$t('table.ruleType')"
          prop="ruleType"
          required
        >
          <data-rule-type-select v-model="info.ruleType" :disabled="info.id > 0" />
        </el-form-item>
        <el-form-item
          :label="$t('table.name')"
          prop="name"
          required
        >
          <el-input
            v-model="info.name"
            auto-complete="off"
            :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.name')}`"
            suffix-icon="el-icon-fa-vcard"
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.description')"
          prop="description"
          required
        >
          <el-input
            v-model="info.description"
            :maxlength="256"
            :autosize="{ minRows: 2, maxRows: 3}"
            type="textarea"
            auto-complete="off"
            :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.description')}`"
            suffix-icon="el-icon-fa-file-word-o"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        style="paddingRight:40px"
      >
        <el-button @click="addEditShow = false ;">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="updateInfo('editForm')"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deepClone } from '@/utils'
import DataRuleTypeSelect from './components/DataRuleTypeSelect'
import DataRuleModuleSelect from './components/DataRuleModuleSelect'
import { dataRuleType, dataRuleModuleList } from '@/utils/constants'
import checkPermission from '@/utils/permission'
import waves from '@/directive/waves' // 水波纹指令
import defaultHtml from '@/directive/defaultHtml'
import rules from '@/utils/formRules'
import api from '@/api'

export default {
  name: 'DataRule',
  directives: {
    waves,
    defaultHtml
  },
  components: {
    DataRuleTypeSelect,
    DataRuleModuleSelect
  },
  filters: {

  },
  data() {
    return {
      listLoading: true,
      listQuery: {
        dataRuleType: null,
        dataModule: null
      },
      dataRuleType,
      dataRuleModuleList,
      formRules: rules,
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
  computed: {

  },
  watch: {

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
      this.info = {
        id: 0,
        name: '',
        module: null,
        ruleType: null,
        description: ''
      }
      this.addEditShow = true
    },
    updateInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var callback = result => {
            this.handleCurrentChange()
            this.addEditShow = false
            this.$message({
              type: 'success',
              message: (this.info.id ? '编辑' : '添加') + '成功!'
            })
          }
          this.info.id
            ? api.dataRule.update(this.info).then(callback)
            : api.dataRule.save(this.info).then(callback)
        }
      })
    },
    handleUpdate(row) {
      this.info = deepClone(row)
      this.addEditShow = true
    },
    handleDelete(row) {
      this.$confirm(`${this.$t('table.confirm')} ${this.$t('table.delete')} <${row.name}> ?`, this.$t('table.deleteConfirm'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        api.dataRule.delete(row.id).then(result => {
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
        Promise.all(rows.map(v => api.dataRule.delete(v.id))).then(result => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadData()
        })
      })
    },
    loadData() {
      api.dataRule.list(this.pager.pager.pageNumber, this.pager.pager.pageSize, this.listQuery.dataModule, this.listQuery.dataRuleType).then(result => {
        this.pager = result.pager
        this.listLoading = false
      })
    }
  }
}
</script>
