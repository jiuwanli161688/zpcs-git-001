<template>
  <view class="message-item user-img-msg">
      <view class="user-message">
          <slot></slot>
      </view>
  </view>
</template>

<script>
export default {

}
</script>
<style lang="scss" scoped>
.message-item {

  margin: 20rpx 0;

  .user-message {
      width: 80%;
      background-color: #F50000;
      font-size: 24rpx;
      color: #333333;
  }
}

.user-img-msg {
  display: flex;
  flex-direction: row-reverse;
}
</style>