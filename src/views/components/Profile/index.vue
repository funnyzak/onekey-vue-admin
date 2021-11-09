<template>
  <div>
    <div v-transfer-dom>
      <el-dialog
        :visible="show"
        :title="`${uinfo.id === user.id ? $t('acl.profile') : uinfo.id > 0 ? $t('acl.editUser') : $t('acl.addUser')}`"
        width="480px"
        @close="$emit('update:show', false)"
      >
        <el-form
          ref="userForm"
          label-width="100px"
          label-positiorn="center"
          :model="uinfo"
          :rules="formRules"
          style="width: 400px;"
          class="edit-table"
        >
          <el-form-item :label="$t('table.userName')" prop="name">
            <el-input
              v-model="uinfo.name"
              :disabled="uinfo.id !== 0"
              auto-complete="off"
              suffix-icon="el-icon-fa-user"
              :placeholder="`${$t('placeholder.pleaseInput')}用户名`"
            />
          </el-form-item>
          <el-form-item :label="$t('table.realName')" prop="realName">
            <el-input
              v-model="uinfo.realName"
              auto-complete="off"
              suffix-icon="el-icon-fa-vcard"
              :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.realName')}`"
            />
          </el-form-item>
          <el-form-item v-if="!(uinfo.id > 0 && uinfo.id !== user.id)" :label="$t('table.password')">
            <el-input
              v-model="uinfo.password"
              type="password"
              auto-complete="off"
              suffix-icon="el-icon-fa-lock"
              :placeholder="$t('placeholder.password')"
            />
          </el-form-item>

          <el-form-item :label="$t('table.phone')" prop="phone">
            <el-input
              v-model="uinfo.phone"
              auto-complete="off"
              suffix-icon="el-icon-fa-phone"
              :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.phone')}`"
            />
          </el-form-item>
          <el-form-item :label="$t('table.email')" prop="email">
            <el-input
              v-model="uinfo.email"
              auto-complete="off"
              suffix-icon="el-icon-fa-envelope"
              :placeholder="`${$t('placeholder.pleaseInput')}${$t('table.email')}`"
            />
          </el-form-item>
          <el-form-item v-if="!(uinfo.id > 0 && uinfo.id === user.id)" :label="$t('table.status')">
            <el-switch
              v-model="uinfo.status"
              active-value="ACTIVE"
              inactive-value="DISABLED"
            />
          </el-form-item>
          <el-form-item :label="$t('table.headKey')" prop="headKey">
            <single-image-upload v-model="uinfo.headKey" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="$emit('update:show', false)">{{ $t('table.cancel') }}</el-button>
          <el-button type="primary" @click="updateUser('userForm')">{{ $t('table.confirm') }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import rules from '@/utils/formRules'
import api from '@/api/index'
import SingleImageUpload from '@/components/Upload/SingleImageUpload'

export default {
  name: 'UserInfo',
  components: {
    SingleImageUpload
  },
  props: {
    userInfo: {
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
      uinfo: Object.assign({}, this.userInfo, { password: '' }),
      formRules: Object.assign(rules, {
        password: [
          {
            required: false
          }
        ]
      })
    }
  },
  computed: {
    ...mapGetters([
      'user', 'branchNameList'
    ])
  },
  watch: {
    userInfo(value) {
      this.uinfo = Object.assign({}, this.userInfo, { password: '' })
    }
  },
  methods: {
    handleAvatarSuccess(res) {
      this.uinfo.headKey = res.data.file.url
    },
    updateUser() {
      const _uinfo = Object.assign({}, this.uinfo)
      const _updatePromise = (_uinfo.id === this.user.id
        ? api.User.loginUserProfile(_uinfo)
        : _uinfo.id > 0 ? api.User.update(_uinfo)
          : api.User.save(_uinfo))

      _updatePromise.then(rlt => {
        this.$message({
          type: 'success',
          message: '编辑成功'
        })

        this.$emit('update:show', false)

        if (_uinfo.id === this.user.id) {
          this.$store.commit('user/SAVE_LOGIN_USER', _uinfo)
          this.$emit('saveInfo', _uinfo)
        } else if (_uinfo.id > 0) {
          this.$emit('saveInfo', _uinfo)
        } else {
          this.$emit('saveInfo', rlt.user)
        }
      })
    }
  }
}
</script>
