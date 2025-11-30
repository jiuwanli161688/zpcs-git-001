<!-- ServiceMessage.vue -->
<template>
    <view class="message-item">
        <view class="service-message" v-html="parsedMessage"></view>
    </view>
</template>

<script>
export default {
  name: 'sy-service-msg',
  props: {
    message: {
      type: String,
      required: true
    }
  },
  computed: {
    parsedMessage() {
      // 这里可以添加对 message 的处理逻辑，比如转义特殊字符等
      return this.message;
    }
  }
}
</script>

<style lang="scss" scoped>
.message-item {
    margin: 20rpx 0;
    max-width: 80%;

    .service-message {
        display: flex;
        width: fit-content; // 添加此行，确保宽度自适应内容
        background-color: white;
        padding: 24rpx;
        border-radius: 16rpx;
        font-size: 24rpx;
        color: #333333;
    }
}
</style>