<template>
  <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="nav-bar-content">
      <view class="nav-left" @click="handleBack">
        <uni-icons type="back" size="24" color="#333"></uni-icons>
      </view>
      <view class="nav-title">{{ title }}</view>
      <view class="nav-right" @click="handleInfo">
        <text class="icon-info">&#xe602;</text>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  name: 'NavBar',
  
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  
  data() {
    return {
      statusBarHeight: 0
    }
  },
  
  created() {
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight
  },
  
  methods: {
    handleBack() {
      this.$emit('back')
    },
    
    handleInfo() {
      this.$emit('info')
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'iconfont';
  src: url('data:font/woff2;charset=utf-8;base64,d09GMgABAAAAAAJQAAsAAAAABmQAAAIFAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcAqBPIEsATYCJAMMCwgABCAFhG0HMBsiBsgOJRFBwAAQAACAPB7+f79v+9z33ph4VbOoJqpZEsl0ySSaVTKJNE0bSfwlglcSyTvz/u69n7bBBXhQ3MRDRaADXAGlqA3Q/5v2A6sWTJjLg+52V7X25cLT8ARnkMAAuymK27DU6DJOONjt1w+kFYRBAgbFO+AOuL0XQoqSxGJjVITG1jY2kBUhMVMQ8RbjAuSpcUEqm8QiqKgLSeMCLkX99/EfDMhKoprhWNs53e3sBZRPwl/4BXZO0kn9+7VAnp5Yjw==') format('woff2');
}
.nav-bar-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin: 0 -20rpx;
}

.nav-left,
.nav-right {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-back,
.icon-info {
  font-family: 'iconfont';
  font-size: 40rpx;
  height: 60rpx;
  color: #333;
}

.icon-back::before {
  content: '<';
}

.icon-info::before {
  content: 'i';
  border: 2rpx solid #999;
  border-radius: 50%;
  width: 32rpx;
  height: 32rpx;
  display: inline-block;
  line-height: 32rpx;
  text-align: center;
  font-size: 28rpx;
  font-style: normal;
  color: #999;
}

.nav-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}
</style>
