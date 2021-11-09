<template>
  <div class="form-container">
    <div class="header">
      <slot name="header">
        {{ title }}
      </slot>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      required: false,
      default: '表单',
      type: String
    }
  }
}
</script>
<style lang="scss" scoped>
.form-container {
  margin: 0 20px;
  border-radius: 2px;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  .header {
    position: relative;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    border-bottom: 1px solid #f6f6f6;
    color: #333;
    font-weight: bold;
    text-align: center;
    font-size: 20px;
    margin-bottom: 15px;
  }
  .content {
    padding: 20px 0;
    line-height: 24px;
  }
}
</style>

