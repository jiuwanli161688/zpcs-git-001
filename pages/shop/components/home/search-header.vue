<template>
  <view class="header">
    <!-- 定位 -->
    <view class="header__location" @click="chooseCity">
      <uni-icons type="location" size="16" color="#333"></uni-icons>
      <text class="header__city">{{ city }}</text>
      <uni-icons type="right" size="12" color="#999"></uni-icons>
    </view>
    
    <!-- 搜索栏 -->
    <view class="header__search">
      <view class="search-box">
        <uni-icons type="search" size="16" color="#999"></uni-icons>
        <input 
          class="search-box__input" 
          type="text" 
          :placeholder="placeholder"
          :value="keyword"
          @input="onInput"
          @confirm="onSearch"
        />
        <view class="search-box__btn" @click="onSearch">搜索</view>
      </view>
      <view class="header__scan" @click="onScan">
        <uni-icons type="scan" size="24" color="#333"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  name: 'SearchHeader',
  props: {
    // 当前城市
    city: {
      type: String,
      default: '北京市'
    },
    // 搜索关键词
    keyword: {
      type: String,
      default: ''
    },
    // 占位文字
    placeholder: {
      type: String,
      default: '搜索城市/区县'
    }
  },
  methods: {
    // 选择城市
    chooseCity() {
      this.$emit('choose-city')
    },
    // 输入
    onInput(e) {
      this.$emit('update:keyword', e.detail.value)
    },
    // 搜索
    onSearch() {
      this.$emit('search', this.keyword)
    },
    // 扫码
    onScan() {
      // #ifdef APP-PLUS || MP-WEIXIN
      uni.scanCode({
        success: (res) => {
          this.$emit('scan', res.result)
        }
      })
      // #endif
      // #ifdef H5
      uni.showToast({ title: 'H5暂不支持扫码', icon: 'none' })
      // #endif
    }
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #ffc107;
$text-primary: #333;
$bg-white: #fff;
$bg-page: #f8f8f8;

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: $bg-page;
  padding: 0 20rpx;
  padding-top: var(--status-bar-height);
  
  &__location {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
  }
  
  &__city {
    font-size: 28rpx;
    font-weight: bold;
    color: $text-primary;
    margin: 0 6rpx;
  }
  
  &__search {
    display: flex;
    align-items: center;
    padding-bottom: 20rpx;
  }
  
  &__scan {
    margin-left: 20rpx;
    padding: 10rpx;
  }
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  height: 72rpx;
  background-color: $bg-white;
  border: 2rpx solid #ffe082;
  border-radius: 36rpx;
  padding-left: 24rpx;
  padding-right: 8rpx;
  
  &__input {
    flex: 1;
    font-size: 28rpx;
    margin-left: 12rpx;
  }
  
  &__btn {
    height: 56rpx;
    line-height: 56rpx;
    padding: 0 32rpx;
    background-color: $primary-color;
    border-radius: 28rpx;
    font-size: 28rpx;
    color: $text-primary;
    font-weight: 500;
  }
}
</style>
