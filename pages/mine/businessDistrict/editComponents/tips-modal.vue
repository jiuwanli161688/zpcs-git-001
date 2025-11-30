<template>
  <view v-if="show" class="modal-overlay" @click="handleMaskClick">
    <view class="modal-content" @click.stop>
      <view class="modal-header">
        <view class="modal-title">评价发布小贴士</view>
        <image src="/static/cbd/shop/detail/light.png" class="light-icon" />
      </view>
      
      <view class="modal-body">
        <text class="intro-text">鼓励真实有帮助的评价，以下违反规则的评价将不被展示：</text>
        
        <view class="rules-list">
          <view v-for="(rule, index) in rules" :key="index" class="rule-item">
            <text class="rule-number">{{ index + 1 }}.</text>
            <text class="rule-text">{{ rule }}</text>
          </view>
        </view>
      </view>
      
      <view class="modal-footer">
        <button class="confirm-btn" @click="handleConfirm">
          我已知悉此规则
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'TipsModal',
  
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      show: this.visible,
      rules: [
        '有违法律法规、公序良俗的内容；',
        '含有网址链接、微信号、手机号QQ号、二维码或广告营销信息；',
        '受利益诱导发布的指定评价；',
        '虚构、引人误解、与服务商品无关的评价；',
        '冒用他人身份或搬运他人图片、文字、视频等侵犯他人合法权益的评价。'
      ]
    }
  },
  
  watch: {
    visible(val) {
      this.show = val
    }
  },
  
  methods: {
    handleMaskClick() {
      // 可选：点击遮罩层关闭
      // this.close()
    },
    
    handleConfirm() {
      this.close()
      this.$emit('confirm')
    },
    
    close() {
      this.show = false
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
.modal-overlay {
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
  padding: 50rpx;
}

.modal-content {
  width: 100%;
  max-width: 600rpx;
  background-color: #fff;
  border-radius: 24rpx;
  overflow: hidden;
}

.modal-header {
  padding: 30rpx 30rpx 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-left: 140rpx;
}

.bulb-icon {
  font-size: 48rpx;
}

.modal-body {
  padding: 0 30rpx 30rpx;
}

.intro-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  display: block;
  margin-bottom: 20rpx;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.rule-item {
  display: flex;
  line-height: 1.6;
}

.rule-number {
  font-size: 26rpx;
  color: #666;
  margin-right: 8rpx;
  flex-shrink: 0;
}

.rule-text {
  font-size: 26rpx;
  color: #666;
  flex: 1;
}

.modal-footer {
  padding: 20rpx 30rpx 30rpx;
}

.confirm-btn {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(90deg, #ff4444 0%, #ff2222 100%);
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #ffffff;
  border: none;
  line-height: 80rpx;
}

.confirm-btn::after {
  border: none;
}
.light-icon {
  width: 94rpx;
  height: 94rpx;
}
</style>
