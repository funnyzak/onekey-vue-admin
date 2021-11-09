<template>
  <div>
    <div v-transfer-dom>
      <el-dialog
        :visible="show"
        :title="dept.name + ' ' + $t('table.member')"
        width="800px"
        @close="$emit('update:show', false)"
      >
        <div v-permission="['dept.user.edit']" class="filter-container">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-edit"
            @click="handleGrant(dept)"
          >{{ $t('structure.setMember') }}</el-button>
          <el-button
            v-if="multipleSelection.length > 0"
            class="filter-item"
            style="margin-left: 10px;"
            type="danger"
            icon="el-icon-delete"
            @click="handleDeleteSelected(multipleSelection)"
          >{{ $t('table.remove') }}</el-button>
        </div>

        <el-table
          v-loading="listLoading"
          header-row-class-name="table-header-hightlight"
          :data="list"
          max-height="450px"
          fit
          style="width: 100%;"
          @selection-change="(val) => { multipleSelection = val }"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            :label="$t('table.headKey')"
            min-width="80"
            show-overflow-tooltip
            align="left"
          >
            <template slot-scope="scope">
              <img-view width="35px" height="35px" :url="scope.row.headKey" preview :def="defAvatar" />
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.userName')"
            min-width="100"
            show-overflow-tooltip
            align="left"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.realName')"
            min-width="100"
            show-overflow-tooltip
            align="left"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.realName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.contact')"
            min-width="150"
            show-overflow-tooltip
            align="left"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span><br>
              <span>{{ scope.row.email }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog
        :title="$t('structure.deptMember')"
        :visible.sync="grantShow"
        width="540px"
      >
        <template>
          <el-transfer
            v-model="selected"
            :data="options"
            :titles="[$t('table.waitSelect'), $t('table.selected')]"
            filterable
          />
        </template>
        <div slot="footer" style="paddingRight:5px">
          <el-button @click="grantShow = false">
            {{
              $t('table.cancel')
            }}
          </el-button>
          <el-button type="success" @click="grant">
            {{
              $t('table.confirm')
            }}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import checkPermission from '@/utils/permission'
import waves from '@/directive/waves'
import defAvatar from '@/assets/images/avatar.png'
import ImgView from '@/components/ImageView/index.vue'
import defaultHtml from '@/directive/defaultHtml'
import api from '@/api'
export default {
  name: 'DeptUserList',
  components: {
    ImgView
  },
  directives: {
    waves,
    defaultHtml
  },
  props: {
    dept: {
      type: Object,
      require: true,
      default: () => {}
    },
    show: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      defAvatar,
      listLoading: true,
      list: [],
      grantShow: false,
      selected: [],
      options: [],
      multipleSelection: []
    }
  },
  watch: {
    options: function() {
      this.selected = []
      this.options.forEach(item => {
        if (item.selected && item.selected === 1) {
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
    handleDeleteSelected(rows) {
      if (rows.length === 0) return

      this.$confirm(`${this.$t('table.confirm')} ${this.$t('table.remove')} <${rows.map(v => v.name).join(',')}> ?`, this.$t('table.deleteConfirm'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'warning'
      }).then(() => {
        Promise.all(rows.map(v => api.Department.userRemove(this.dept.id, v.id))).then(result => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.loadData()
        })
      })
    },
    grant() {
      api.Department.grant(this.dept.id, this.selected).then(result => {
        this.$message({
          type: 'success',
          message: '设置成功!'
        })
        this.grantShow = false
        this.loadData()
      })
    },
    handleGrant(row) {
      api.Department.grantInfo(row.id).then(result => {
        this.options = []
        const list = result.list
        list.filter(v => {
          return v.uid !== 1
        }).forEach((item, index) => {
          this.options.push({
            key: item.uid,
            label: item.realName,
            selected: item.selected
          })
        })
        this.grantShow = true
      })
    },
    loadData() {
      api.Department.userList(this.dept.id).then(result => {
        this.list = result.list
        this.listLoading = false
      })
    }
  }
}
</script>
