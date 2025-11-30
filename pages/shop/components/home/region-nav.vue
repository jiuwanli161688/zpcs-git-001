<template>
  <view class="region-nav">
    <view class="region-nav__list">
      <!-- 乡愁导航入口 -->
      <view class="region-nav__item">
        <view class="region-nav__icon region-nav__icon--main">
          <uni-icons type="location" size="24" color="#666"></uni-icons>
        </view>
        <text class="region-nav__name region-nav__name--bold">乡愁导航</text>
      </view>
      
      <!-- 地区列表 -->
      <view 
        class="region-nav__item" 
        v-for="(item, index) in list" 
        :key="index"
        @click="onItemClick(item)"
      >
        <image class="region-nav__avatar" :src="item.image" mode="aspectFill"></image>
        <text class="region-nav__name">{{ item.name }}</text>
      </view>
      
      <!-- 查看更多 -->
      <view class="region-nav__item" @click="onMoreClick">
        <view class="region-nav__more">
          <text class="region-nav__more-text">查看\n更多</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'RegionNav',
  props: {
    // 地区列表
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onItemClick(item) {
      this.$emit('item-click', item)
    },
    onMoreClick() {
      this.$emit('more-click')
    }
  }
}
</script>

<style lang="scss" scoped>
$text-primary: #333;
$text-secondary: #666;
$text-placeholder: #999;
$bg-white: #fff;

.region-nav {
  white-space: nowrap;
  margin-bottom: 30rpx;
  /* 添加横向滚动并隐藏滚动条 */
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;

  
  /* 隐藏滚动条 - 兼容多端 */
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    background: transparent;
  }
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  
  &__list {
    display: inline-flex;
    padding: 10rpx 0;
  }
  
  &__item {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    margin-right: 40rpx;
  }
  
  &__icon {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &--main {
      border: 2rpx solid #ddd;
      background-color: $bg-white;
    }
  }
  
  &__avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    border: 4rpx solid $bg-white;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
  }
  
  &__name {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 24rpx;
    color: #fff;
    
    &--bold {
      font-weight: bold;
      color: $text-primary;
    }
  }
  
  &__more {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background-color: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &-text {
      font-size: 20rpx;
      color: $text-placeholder;
      text-align: center;
      line-height: 1.3;
    }
  }
}
</style>
