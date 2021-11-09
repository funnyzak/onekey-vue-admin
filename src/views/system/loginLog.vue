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
        :label="$t('table.loginTime')"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.loginTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
import { parseTime } from '@/utils'
import waves from '@/directive/waves'
import UserInfoCard from '@/views/components/UserInfoCard'

import api from '@/api'
export default {
  name: 'LoginLog',
  components: {
    UserInfoCard
  },
  directives: {
    waves
  },
  filters: {
    parseTime
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
      loginUser: 'user',
      branchNameList: 'branchNameList'
    })
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
      api.Trace.list(this.pager.pager.pageNumber, this.pager.pager.pageSize, this.listQuery.searchKey).then(result => {
        this.pager = result.pager
        this.listLoading = false
      })
    }
  }
}
</script>
