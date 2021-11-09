<template>
  <div>
    <el-tooltip placement="right" effect="dark">
      <div slot="content" class="user-info">
        <div class="user-image">
          <image-view
            width="50px"
            height="50px"
            thumb
            :url="userInfo.headKey?userInfo.headKey:userDefault"
            :def="userDefault"
          />
        </div>
        <p>{{ $t('table.realName') }} : {{ userInfo.realName }}</p>
        <p>{{ $t('table.userName') }} : {{ userInfo.name }}</p>
        <p>{{ $t('table.phone') }} : {{ userInfo.phone }}</p>
        <p>{{ $t('table.email') }} : {{ userInfo.email }}</p>
      </div>
      <span class="link-type">{{ userInfo.realName }}</span>
    </el-tooltip>
  </div>
</template>

<script>
import ImageView from '@/components/ImageView'
import userDefault from '@/assets/images/avatar.png'
export default {
  name: 'UserInfoCard',
  components: {
    ImageView
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    userDefault() {
      return userDefault
    }
  }
}
</script>

<style lang="scss" scoped>
.user-info {
  font-size: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  p{
    margin:7px 0;
  }
  .user-image {
    border-radius: 50%;
    align-self: center;
    margin-bottom: 20px;
  }
}
</style>
