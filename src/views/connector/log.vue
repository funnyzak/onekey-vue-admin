<template>
  <div class="app-container">
    <div class="filter-container">
      <select-connector v-model="listQuery.connectorId" style="width:150px" @change="loadData()" />
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
    </div>

    <el-table
      v-loading="listLoading"
      header-row-class-name="table-header-hightlight"
      :data="pager.dataList"
      fit
      style="width: 100%;"
    >
      <el-table-column
        :label="$t('table.connector')"
        min-width="150"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.connector && scope.row.connector !== null ? scope.row.connector.name : '未设置' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.requestTime')"
        show-overflow-tooltip
        align="left"
        min-width="170"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.requestTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.system')"
        show-overflow-tooltip
        align="left"
        min-width="120"
      >
        <template slot-scope="scope">
          <span v-default-html="'无'">{{ scope.row.system }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.methodName')"
        show-overflow-tooltip
        align="left"
        min-width="240"
      >
        <template slot-scope="scope">
          <span>
            <el-tooltip :content="scope.row.methodName" placement="top">
              <span>{{ scope.row.methodName.split('.').filter((v, i) => i > (scope.row.methodName.split('.').length - 5)).join('.') }}</span>
            </el-tooltip>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.ip')"
        show-overflow-tooltip
        align="left"
        min-width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.elapsedTime')"
        show-overflow-tooltip
        align="left"
        min-width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.elapsedTime }} ms</span>
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
  </div>
</template>
<script>
import { parseTime } from '@/utils'
import waves from '@/directive/waves'
import defaultHtml from '@/directive/defaultHtml'
import SelectConnector from './components/SelectConnector'
import api from '@/api'
export default {
  name: 'ConnectorLogList',
  components: {
    SelectConnector
  },
  directives: {
    waves,
    defaultHtml
  },
  filters: {
    parseTime
  },
  data() {
    return {
      listLoading: false,
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
      }
    }
  },
  mounted: function() {
    this.loadData()
  },
  methods: {
    handleCurrentChange() {
      this.loadData()
    },
    handleSizeChange(val) {
      this.pager.pager.pageSize = val
      this.$store.commit('SET_PAGESIZE', val)
      this.loadData()
    },
    loadData() {
      api.Connector.logList(this.pager.pager.pageNumber, this.pager.pager.pageSize, this.listQuery.searchKey, this.listQuery.connectorId).then(result => {
        this.pager = result.pager
        this.listLoading = false
      })
    }
  }
}
</script>
