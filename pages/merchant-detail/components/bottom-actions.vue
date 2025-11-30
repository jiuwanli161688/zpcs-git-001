<template>
  <view class="bottom-actions">
    <view class="action-item" @click="$emit('comment')">
      <image src="/static/cbd/shop/detail/chat.png" class="chat-icon" />
      <text class="action-text">评价</text>
    </view>
    
    <view class="action-item" @click="$emit('checkin')">
      <image src="/static/cbd/shop/detail/addr.png" class="addr-icon" />
      <text class="action-text">打卡</text>
    </view>
    
    <view class="action-item" @click="$emit('scan')">
      <image src="/static/cbd/shop/detail/scan.png" class="scan-icon" />
      <text class="action-text">扫码</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'BottomActions'
}
</script>

<style lang="scss" scoped>
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  padding: 16rpx 0;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  z-index: 100;
  
  .action-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    
    .iconfont {
      font-size: 44rpx;
      color: #333;
    }
    .chat-icon {
      width: 44rpx;
      height: 40rpx;
    }
    .addr-icon {
      width: 44rpx;
      height: 44rpx;
    }
    .scan-icon {
      width: 42rpx;
      height: 42rpx;
    }
    .action-text {
      color: #666;
      font-size: 28rpx;
      font-weight: 500;
      margin-left: 6rpx;
    }
    
    &:active {
      opacity: 0.6;
    }
  }
}
</style>
