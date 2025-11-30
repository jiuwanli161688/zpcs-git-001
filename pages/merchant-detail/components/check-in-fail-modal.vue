<template>
  <view class="popup-wrapper" v-if="visible" @tap="handleMaskClick">
    <!-- 遮罩层 -->
    <view class="popup-mask"></view>

    <!-- 弹窗内容 -->
    <view class="popup-content" @tap.stop>
      <!-- 添加顶部弧形装饰 -->
      <view class="arc-top">
        <!-- 文字内容 -->
        <view class="text-content">
          <text class="title">{{ title }}</text>
          <text class="subtitle">{{ subtitle }}</text>
        </view>
      </view>

      <!-- 关闭按钮 -->
      <view class="close-btn" @tap="handleClose">
        <text class="close-icon">×</text>
      </view>
      <!-- 定位图标 -->
      <view class="icon-wrapper">
        <view class="location-icon">
          <image
            src="/static/cbd/shop/detail/addr_fail.png"
            class="check-in-err"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "CheckInFailPopup",
  props: {
    // 是否显示弹窗
    value: {
      type: Boolean,
      default: false,
    },
    // 标题
    title: {
      type: String,
      default: "打卡失败",
    },
    // 副标题
    subtitle: {
      type: String,
      default: "不在商家附近无法进行打卡",
    },
    // 点击遮罩是否关闭
    maskClosable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  watch: {
    value: {
      handler(val) {
        this.visible = val;
      },
      immediate: true,
    },
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.visible = false;
      this.$emit("input", false);
      this.$emit("close");
    },
    // 点击遮罩
    handleMaskClick() {
      if (this.maskClosable) {
        this.handleClose();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.popup-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
  position: relative;
  width: 100%;
  border-radius: 0;
  padding: 140rpx 40rpx 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.arc-top {
  position: absolute;
  bottom: 0;
  left: -10%;
  width: 120%;
  height: 360rpx;
  background-color: #ffffff;
  border-radius: 100% 100% 0 0;
}

.close-btn {
  position: absolute;
  top: -300rpx;
  right: 30rpx;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  border: 2rpx solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.close-icon {
  font-size: 30rpx;
  color: #fff;
  line-height: 1;
  margin-top: -4rpx;
}

.icon-wrapper {
  position: absolute;
  top: -310rpx;
  display: flex;
  justify-content: center;
  z-index: 5;
}

.location-icon {
  border-radius: 50% 50% 50% 0;
  transform: rotate(-3deg);
  position: relative;
}

.check-in-err {
  width: 160rpx;
  height: 230rpx;
}

.icon-circle {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 40rpx;
  height: 40rpx;
  background-color: #ffffff;
  border-radius: 50%;
}

.text-content {
  margin-top: 140rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 12rpx;
}

.subtitle {
  font-size: 24rpx;
  color: #666666;
}
</style>
