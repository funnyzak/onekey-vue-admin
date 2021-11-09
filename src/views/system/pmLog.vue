
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.pm_type"
        style="width: 120px;"
        :placeholder="$t('table.pmType')"
        :clearable="true"
        @change="pager.pager.pageNumber = 1; loadData()"
      >
        <el-option
          v-for="key in Object.keys(pmType)"
          :key="key"
          :label="pmType[key]"
          :value="key"
        />
      </el-select>
      <el-select
        v-model="listQuery.use"
        style="width: 120px;"
        :placeholder="$t('table.use')"
        :clearable="true"
        @change="pager.pager.pageNumber = 1; loadData()"
      >
        <el-option
          v-for="key in Object.keys(pmUse)"
          :key="key"
          :label="pmUse[key]"
          :value="key"
        />
      </el-select>
      <el-select
        v-model="listQuery.server"
        style="width: 120px;"
        :placeholder="$t('table.pmServer')"
        :clearable="true"
        @change="pager.pager.pageNumber = 1; loadData()"
      >
        <el-option
          v-for="key in Object.keys(pmServer)"
          :key="key"
          :label="pmServer[key]"
          :value="key"
        />
      </el-select>
      <el-date-picker
        v-model="dateVal"
        type="date"
        style="width: 150px;"
        :placeholder="$t('table.date')"
      />
      <el-input
        v-model="listQuery.ip"
        :placeholder="$t('table.clientIp')"
        style="width: 150px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.receive"
        :placeholder="$t('table.receive')"
        style="width: 200px;"
        class="filter-item"
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
        :label="$t('table.sendTime')"
        width="170"
        align="left"
      >
        <template slot-scope="scope">
          <span>
            {{ scope.row.addTime | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.receive')"
        align="left"
        min-width="150"
      >
        <template slot-scope="scope">
          <span>
            {{ scope.row.receive | defaultHTML }}
            <i :class="scope.row.success ? 'el-icon-check': 'el-icon-close'" />
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.pmType')"
        align="left"
        min-width="100"
      >
        <template slot-scope="scope">
          <span>{{ pmType[scope.row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.use')"
        align="left"
        min-width="100"
      >
        <template slot-scope="scope">
          <span>{{ pmUse[scope.row.use] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.code')"
        align="left"
        min-width="110"
      >
        <template slot-scope="scope">
          <span>
            {{ scope.row.code }}
            <i :class="scope.row.verify ? 'el-icon-check': 'el-icon-close'" />
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.content')"
        min-width="200"
        show-overflow-tooltip
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.content | defaultHTML }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.clientIp')"
        align="left"
        min-width="150"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.ip | defaultHTML }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.pmServer')"
        align="left"
        min-width="100"
      >
        <template slot-scope="scope">
          <span>{{ pmServer[scope.row.server] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.log')"
        align="left"
        min-width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.errMsg | defaultHTML("正常") }}</span>
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
import { pmPlatform, pmServer, pmUse, pmType } from '@/utils/constants'

export default {
  name: 'OperationLog',
  components: {
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
      pmPlatform,
      pmServer,
      pmUse,
      pmType,
      dateVal: null,
      listLoading: false,
      listQuery: {
        pm_type: null,
        receive: null,
        use: null,
        add_time_start: null,
        add_time_end: null,
        success: null,
        verify: null,
        server: null,
        ip: null
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
  watch: {
    dateVal: function(t) {
      if (t !== null) {
        this.listQuery.add_time_start = t.getTime() / 1000
        this.listQuery.add_time_end = this.listQuery.add_time_start + 3600 * 24
      } else {
        this.listQuery.add_time_start = null
        this.listQuery.add_time_end = null
      }
    }
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
      api.Pm.list(this.pager.pager.pageNumber, this.pager.pager.pageSize, this.listQuery).then(result => {
        this.pager = result.pager
        this.listLoading = false
      })
    }
  }
}
</script>
