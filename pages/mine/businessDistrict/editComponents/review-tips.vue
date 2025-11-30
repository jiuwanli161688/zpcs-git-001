<template>
  <view v-if="visible" class="tips-overlay" @click.self="handleClose">
    <view class="tips-dialog">
      <!-- 标题 -->
      <view class="tips-header">
        <text class="tips-title">评价发布小贴士</text>
        <text class="bulb-icon">💡</text>
      </view>

      <!-- 内容 -->
      <view class="tips-content">
        <text class="tips-intro">鼓励真实有帮助的评价，以下违反规则的评价将不被展示：</text>
        
        <view class="tips-list">
          <view class="tip-item">
            <text class="tip-number">1. </text>
            <text class="tip-text">有违法律法规、公序良俗的内容；</text>
          </view>
          <view class="tip-item">
            <text class="tip-number">2. </text>
            <text class="tip-text">含有网址链接、微信号、手机号QQ号、二维码或广告营销信息；</text>
          </view>
          <view class="tip-item">
            <text class="tip-number">3. </text>
            <text class="tip-text">受利益诱导发布的指定评价；</text>
          </view>
          <view class="tip-item">
            <text class="tip-number">4. </text>
            <text class="tip-text">虚构、引人误解、与服务商品无关的评价；</text>
          </view>
          <view class="tip-item">
            <text class="tip-number">5. </text>
            <text class="tip-text">冒用他人身份或搬运他人图片、文字、视频等侵犯他人合法权益的评价。</text>
          </view>
        </view>
      </view>

      <!-- 确认按钮 -->
      <view class="tips-footer">
        <button class="confirm-button" @click="handleConfirm">我已知悉此规则</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose() {
      // 点击遮罩层不关闭，必须点击按钮
    },
    handleConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style scoped>
.tips-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 60rpx;
}

.tips-dialog {
  width: 100%;
  max-width: 600rpx;
  background-color: #fff;
  border-radius: 24rpx;
  overflow: hidden;
}

.tips-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 32rpx 24rpx;
  gap: 12rpx;
}

.tips-title {
  font-size: 36rpx;
  color: #333;
  font-weight: 600;
}

.bulb-icon {
  font-size: 48rpx;
}

.tips-content {
  padding: 0 32rpx 32rpx;
}

.tips-intro {
  display: block;
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  margin-bottom: 24rpx;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.tip-item {
  display: flex;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.tip-number {
  flex-shrink: 0;
}

.tip-text {
  flex: 1;
}

.tips-footer {
  padding: 0 32rpx 32rpx;
}

.confirm-button {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(90deg, #ff3333 0%, #ff0000 100%);
  border-radius: 44rpx;
  font-size: 32rpx;
  color: #fff;
  font-weight: 500;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-button::after {
  border: none;
}
</style>
