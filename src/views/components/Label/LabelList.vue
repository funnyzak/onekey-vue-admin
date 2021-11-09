<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.key"
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
        v-if="checkPermission('add')"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
      <el-button
        v-if="multipleSelection.length > 0 && checkPermission('delete')"
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
        v-if="checkPermission('delete')"
        type="selection"
        min-width="55"
      />
      <el-table-column
        v-if="conf.listFields.includes('name')"
        :label="$t('table.name')"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="conf.listFields.includes('cover')"
        :label="$t('table.cover')"
        min-width="90"
        align="left"
      >
        <template slot-scope="scope">
          <img-view min-width="35px" height="35px" :url="scope.row.cover" preview :def="defImg" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="conf.listFields.includes('value')"
        :label="$t('table.value')"
        show-overflow-tooltip
        min-width="150"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="conf.listFields.includes('description')"
        :label="$t('table.description')"
        min-width="200"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="conf.listFields.includes('system')"
        :label="$t('table.type')"
        min-width="100"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ !scope.row.system ? 'ACTIVE' : 'DISABLED' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="conf.listFields.includes('orderId')"
        :label="$t('table.order')"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ !scope.row.orderId || scope.row.orderId === null ? '未设置' : scope.row.orderId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission('delete') || checkPermission('edit')"
        :label="$t('table.actions')"
        align="left"
        width="120"
        class-name="small-padding"
        fixed="right"
      >
        <template slot-scope="scope">
          <div v-default-html="'无'">
            <el-link
              v-if="checkPermission('edit')"
              type="primary"
              class="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >{{ $t('table.edit') }}</el-link>
            <el-link
              v-if="!scope.row.system && checkPermission('delete')"
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
    <label-edit v-model="info" :conf="conf" :show.sync="addEditShow" @success="pager.pager.pageNumber = 1; loadData()" />
  </div>
</template>
<script>
import { deepClone } from '@/utils'
import LabelEdit from './LabelEdit'
import checkPermission from '@/utils/permission'
import waves from '@/directive/waves'
import defaultHtml from '@/directive/defaultHtml'
import api from '@/api'
import ImgView from '@/components/ImageView/index'
import defImg from '@/assets/images/noimg.png'

export default {
  directives: {
    waves,
    defaultHtml
  },
  components: {
    LabelEdit,
    ImgView
  },
  props: {
    querySetting: {
      type: Object,
      default: () => {
        return {
          type: 'ARTICLE_CATE',
          parentId: 0
        }
      }
    },
    conf: {
      type: Object,
      default: () => {
        return {
          name: '文章分类',
          // 是否显示上级
          parent: false,
          // 显示和编辑字段
          listFields: ['name', 'cover', 'description', 'orderId'],
          editFields: ['name', 'cover', 'description', 'orderId'],
          // api对象
          apiService: api.Label,
          // 权限配置
          permissionName: null,
          type: 'ARTICLE_CATE'
        }
      }
    }
  },
  data() {
    return {
      defImg,
      listLoading: true,
      listQuery: {
        type: null,
        parentId: null,
        system: null,
        key: null
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
      info: null,
      multipleSelection: []
    }
  },
  computed: {

  },
  watch: {

  },
  created: function() {
    this.listQuery = Object.assign({}, this.listQuery, this.querySetting === null ? {} : this.querySetting)

    this.loadData()
  },
  methods: {
    checkPermission(permissionAction) {
      return checkPermission({
        logic: 'AND',
        list: ['label.info.' + permissionAction].concat(this.conf.permissionName === null ? [] : this.conf.permissionName)
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
    setList(list) {
      if (list === null) {
        return []
      }
      return list.map(item => {
        item.hasChildren = this.conf.parent
        return item
      })
    },
    remote(row, treeNode, resolve) {
      this.conf.apiService.list(1, 100, Object.assign(this.querySetting, { parentId: row.id })).then(result => {
        resolve(this.setList(result.pager.dataList))
      })
    },
    handleCreate() {
      this.info = null
      this.addEditShow = true
    },
    updateInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.conf.apiService.save(this.info).then(result => {
            this.handleCurrentChange()
            this.addEditShow = false

            this.$message({
              type: 'success',
              message: (this.info.id !== null ? '编辑' : '添加') + '成功!'
            })
          })
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
        this.conf.apiService.remove(row.id, this.conf.type).then(result => {
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
        Promise.all(rows.map(v => this.conf.apiService.remove(v.id, this.conf.type))).then(result => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadData()
        })
      })
    },
    loadData() {
      this.conf.apiService.list(this.pager.pager.pageNumber, this.pager.pager.pageSize, this.listQuery).then(result => {
        this.pager = result.pager
        this.listLoading = false
        this.pager.dataList = this.setList(result.pager.dataList)
      })
    }
  }
}
</script>
