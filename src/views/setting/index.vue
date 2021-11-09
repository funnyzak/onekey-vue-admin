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
        v-permission="['config.add']"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
      <el-button
        v-if="multipleSelection.length > 0"
        v-permission="['config.delete']"
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
        v-if="['config.delete']"
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
        :label="$t('table.value')"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.description')"
        width="300"
        show-overflow-tooltip
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
        v-if="checkPermission(['config.edit','config.delete'])"
        :label="$t('table.actions')"
        align="left"
        width="120"
        class-name="small-padding"
      >
        <template slot-scope="scope">
          <div v-default-html="'无'">
            <el-link
              v-permission="['config.edit']"
              type="primary"
              class="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >{{ $t('table.edit') }}</el-link>
            <el-link
              v-if="!scope.row.installed"
              v-permission="['config.delete']"
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
      v-permission="['config.add', 'config.edit']"
      :title="setting.id == 0 ? $t('table.add'): $t('table.edit') "
      :visible.sync="addEditShow"
      width="480px"
    >
      <el-form
        ref="editForm"
        :model="setting"
        :rules="formRules"
        label-width="100px"
        style="width: 400px;"
      >
        <el-form-item :label="$t('table.name')" prop="name">
          <el-input
            v-model="setting.name"
            auto-complete="off"
            :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.name')}`"
            suffix-icon="el-icon-fa-vcard"
          />
        </el-form-item>
        <el-form-item :label="$t('table.value')" prop="value">
          <el-input
            v-model="setting.value"
            :autosize="{ minRows: 3, maxRows: 8}"
            auto-complete="off"
            type="textarea"
            :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.value')}`"
            suffix-icon="el-icon-fa-terminal"
          />
        </el-form-item>
        <el-form-item :label="$t('table.description')" prop="description">
          <el-input
            v-model="setting.description"
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
        <el-button @click="addEditShow = false ; setting = {installed:false}">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="updateSetting('editForm')"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { windowWidth, deepClone } from '@/utils'
import checkPermission from '@/utils/permission'
import waves from '@/directive/waves'
import defaultHtml from '@/directive/defaultHtml'
import rules from '@/utils/formRules'
import api from '@/api'
export default {
  name: 'SettingList',
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
      addEditShow: false,
      setting: {
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
      this.setting = {
        id: 0,
        name: '',
        description: '',
        installed: false
      }
      this.addEditShow = true
    },
    updateSetting(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var callback = result => {
            this.handleCurrentChange()
            this.addEditShow = false
            this.$message({
              type: 'success',
              message: (this.setting.id ? '编辑' : '添加') + '成功!'
            })
          }
          this.setting.id
            ? api.Setting.update(this.setting).then(callback)
            : api.Setting.save(this.setting).then(callback)
        }
      })
    },
    handleUpdate(row) {
      this.setting = deepClone(row)
      this.addEditShow = true
    },
    handleDelete(row) {
      this.$confirm(`${this.$t('table.confirm')} ${this.$t('table.delete')} <${row.name}> ?`, this.$t('table.deleteConfirm'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        api.Setting.delete(row.id).then(result => {
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
        Promise.all(rows.map(v => api.Setting.delete(v.id))).then(result => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadData()
        })
      })
    },
    loadData() {
      api.Setting.list(this.pager.pager.pageNumber, this.pager.pager.pageSize, this.listQuery.searchKey).then(result => {
        this.pager = result.pager
        this.listLoading = false
      })
    }
  }
}
</script>
