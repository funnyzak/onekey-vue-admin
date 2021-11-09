<template>
  <div>
    <slot name="select-btn">
      <el-input v-model="currentValue" :disabled="disabled" :placeholder="placeholder">
        <el-button slot="append" icon="el-icon-upload" @click="showDialog = true" />
      </el-input>
    </slot>
    <div v-transfer-dom>
      <el-dialog
        :visible.sync="showDialog"
        :title="`上传`"
        width="420px"
        @close="showDialog = false"
      >

        <el-alert
          close-text="知道了"
          :closable="false"
          type="info"
          show-icon
          style="margin-bottom:20px;"
        >
          <span slot="title">
            请点击 + 上传，上传完毕后，请点击 完成。 <span v-html="uploadTips" />
          </span>
        </el-alert>
        <el-row :gutter="40">
          <el-col :xs="24">
            <FileUpload
              v-if="showDialog"
              v-model="fileUploadValue"
              :mimes="mimes"
              :max-size="maxSize"
              :limit="limit"
              :action="action"
              list-style="text"
            />
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">{{ $t('table.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="uploadConfirm"
          >完成</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import FileUpload from '@/components/Upload/FileUpload'

export default {
  name: 'InputSelectFile',
  components: {
    FileUpload
  },
  props: {
    value: {
      type: String,
      default: null
    },
    action: {
      type: String,
      default: null
    },
    mimes: {
      type: Array,
      default: null
    },
    maxSize: {
      type: Number,
      default: 8192
    },
    limit: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    },
    uploadTips: {
      type: String,
      default: null
    },
    show: {
      type: Boolean,
      required: false,
      default: null
    }
  },
  data() {
    return {
      fileUploadValue: null,
      tempShow: false
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.show === null ? this.tempShow : this.show
      },
      set(val) {
        this.tempShow = val
        if (this.show !== null) {
          this.$emit('update:show', val)
        }
        if (!this.tempShow) {
          this.$emit('close')
        }
      }
    },
    currentValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
        this.$emit('change', val)
      }
    }
  }, methods: {
    uploadConfirm() {
      this.currentValue = this.fileUploadValue
      this.fileUploadValue = null
      this.showDialog = false
    }
  }
}
</script>
