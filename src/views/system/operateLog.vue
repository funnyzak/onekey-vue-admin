
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
    </div>

    <el-table
      v-loading="listLoading"
      header-row-class-name="table-header-hightlight"
      :data="pager.dataList"
      fit
      style="width: 100%;"
    >
      <el-table-column
        :label="$t('table.actionTime')"
        width="170"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.actionTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.account')"
        align="left"
      >
        <template slot-scope="scope">
          <user-info-card :user-info="scope.row.addUser" />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.ip')"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.module')"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.module }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.action')"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.action }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.description')"
        min-width="300"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.description !== null && scope.row.description.length <= 30" v-default-html="'无'">{{ scope.row.description | subStrWithTail }}</span>
          <span>{{ scope.row.description }}</span>
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
import { mapGetters } from 'vuex'
import { parseTime, subStrWithTail } from '@/utils'
import waves from '@/directive/waves'
import defaultHtml from '@/directive/defaultHtml'
import api from '@/api'
import UserInfoCard from '@/views/components/UserInfoCard'

export default {
  name: 'OperationLog',
  components: {
    UserInfoCard
  },
  directives: {
    waves,
    defaultHtml
  },
  filters: {
    subStrWithTail(str) {
      if (str === null || str.length === 0) return '无'
      return subStrWithTail(str, 38, 0, '...')
    }
  },
  data() {
    return {
      listLoading: false,
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
      }
    }
  },
  computed: {
    ...mapGetters({
      loginUser: 'user'
    })
  },
  mounted: function() {
    this.loadData()
  },
  methods: {
    parseTime(time) {
      return parseTime(time)
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
      api.Operation.list(this.pager.pager.pageNumber, this.pager.pager.pageSize, this.listQuery.searchKey).then(result => {
        this.pager = result.pager
        this.listLoading = false
      })
    }
  }
}
</script>
