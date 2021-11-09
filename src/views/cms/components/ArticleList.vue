<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
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
      fit
      style="width: 100%;"
      @selection-change="(val) => { multipleSelection = val }"
    >
      <el-table-column
        v-if="checkPermission('delete')"
        type="selection"
        min-width="55"
      />
      <el-table-column
        v-if="conf.listFields.includes('title')"
        :label="$t('table.title')"
        show-overflow-tooltip
        min-width="130px"
        align="left"
      >
        <template slot-scope="scope">
          <span @click="handleDetail(scope.row)">{{ scope.row.title | defaultHTML }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="conf.listFields.includes('subTitle')"
        :label="$t('table.subTitle')"
        show-overflow-tooltip
        min-width="130px"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.subTitle | defaultHTML }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="conf.listFields.includes('pic')"
        :label="$t('table.cover')"
        min-width="90"
        align="left"
      >
        <template slot-scope="scope">
          <img-view min-width="35px" height="35px" :url="scope.row.pic" preview :def="defImg" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="conf.listFields.includes('addTime')"
        :label="$t('table.addTime')"
        min-width="150"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.addTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="conf.listFields.includes('updateTime')"
        :label="$t('table.updateTime')"
        min-width="150"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime | defaultHTML }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="conf.listFields.includes('author')"
        :label="$t('table.author')"
        min-width="100"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.author | defaultHTML }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="conf.listFields.includes('source')"
        :label="$t('table.source')"
        min-width="100"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.source | defaultHTML }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="conf.listFields.includes('published')"
        :label="$t('table.status')"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.published ? 'success':'info'">{{ scope.row.published ? '上线' : '草稿' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="conf.listFields.includes('digCount')"
        :label="$t('table.digCount')"
        min-width="100"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.digCount | defaultHTML }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="conf.listFields.includes('viewCount')"
        :label="$t('table.viewCount')"
        min-width="100"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.viewCount | defaultHTML }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="conf.listFields.includes('description')"
        :label="$t('table.description')"
        min-width="150"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.description | defaultHTML }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission('delete') || checkPermission('edit') || checkPermission('detail')"
        :label="$t('table.actions')"
        align="left"
        width="170"
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
              v-if="checkPermission('detail')"
              type="info"
              class="el-icon-document"
              @click="handleDetail(scope.row)"
            >{{ $t('table.preview') }}</el-link>
            <el-link
              v-if="checkPermission('delete')"
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
    <article-edit v-if="addEditShow" v-model="info" :conf="conf" :show.sync="addEditShow" @success="pager.pager.pageNumber = 1; loadData()" />
    <article-detail v-if="detailShow" v-model="info" :conf="conf" :show.sync="detailShow" />
  </div>
</template>
<script>
import { deepClone } from '@/utils'
import checkPermission from '@/utils/permission'
import waves from '@/directive/waves' // 水波纹指令
import defaultHtml from '@/directive/defaultHtml'
import ImgView from '@/components/ImageView/index'
import defImg from '@/assets/images/noimg.png'
import ArticleEdit from './ArticleEdit'
import ArticleDetail from './ArticleDetail'
import api from '@/api'

export default {
  name: 'ArticleInfoList',
  components: {
    ImgView,
    ArticleDetail,
    ArticleEdit
  },
  directives: {
    waves,
    defaultHtml
  },
  props: {
    querySetting: {
      type: Object,
      default: () => {
        return {
          typeList: 'NORMAL'
        }
      }
    },
    conf: {
      type: Object,
      default: () => {
        return {
          name: '文章',
          // 显示和编辑字段
          listFields: ['title', 'subTitle', 'description', 'pic', 'addTime', 'updateTime', 'published'],
          editFields: ['title', 'subTitle', 'description', 'pic', 'addTime', 'updateTime', 'published'],
          previewFields: ['title'],
          // 权限配置
          permissionName: 'cms.article.',
          type: 'NORMAL'
        }
      }
    }
  },
  data() {
    return {
      defImg,
      listLoading: true,
      listQuery: {
        typeList: null,
        addTimeStart: null,
        addTimeEnd: null,
        keyword: null,
        author: null,
        source: null,
        published: null
      },
      orderBy: {
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
      detailShow: false,
      info: null,
      multipleSelection: []
    }
  },
  created: function() {
    this.listQuery = Object.assign({}, this.listQuery, this.querySetting === null ? {} : this.querySetting)

    this.loadData()
  },
  methods: {
    checkPermission(permissionAction) {
      return checkPermission([this.conf.permissionName + permissionAction])
    },
    handleCreate() {
      this.info = null
      this.addEditShow = true
    },
    updateInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.Cms.Article.save(this.info).then(result => {
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
    handleDetail(row) {
      this.info = deepClone(row)
      this.detailShow = true
    },
    handleDelete(row) {
      this.$confirm(`${this.$t('table.confirm')} ${this.$t('table.delete')} <${row.title}> ?`, this.$t('table.deleteConfirm'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        api.Cms.Article.remove(row.id, this.conf.type).then(result => {
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

      this.$confirm(`${this.$t('table.confirm')} ${this.$t('table.delete')} <${rows.map(v => v.title).join(',')}> ?`, this.$t('table.deleteConfirm'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        Promise.all(rows.map(v => api.Cms.Article.remove(v.id, this.conf.type))).then(result => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadData()
        })
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
    loadData() {
      api.Cms.Article.list(this.pager.pager.pageNumber, this.pager.pager.pageSize, this.listQuery, this.orderBy).then(result => {
        this.pager = result.pager
        this.listLoading = false
      })
    }
  }
}
</script>
