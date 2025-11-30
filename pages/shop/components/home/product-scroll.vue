<template>
  <view class="product">
    <view class="product__header">
      <text class="product__title">{{ title }}</text>
      <view class="product__more" @click="onMoreClick">
        <text>查看更多</text>
        <uni-icons type="right" size="12" color="#999"></uni-icons>
      </view>
    </view>
    <view class="product-scroll">
      <view class="product-list">
        <view 
          class="product-item" 
          v-for="(item, index) in list" 
          :key="index"
          @click="onItemClick(item)"
        >
          <image class="product-item__img" :src="item.image" mode="aspectFit"></image>
          <text class="product-item__name">{{ item.name }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProductScroll',
  props: {
    // 标题
    title: {
      type: String,
      default: '热卖商品'
    },
    // 商品列表
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
$border-radius-md: 16rpx;

.product {
  margin-bottom: 30rpx;
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
  }
  
  &__title {
    font-size: 32rpx;
    font-weight: bold;
    color: $text-primary;
  }
  
  &__more {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: $text-placeholder;
  }
}

.product-scroll {
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  
  /* 隐藏滚动条 - 兼容多端 */
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    background: transparent;
  }
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.product-list {
  display: inline-flex;
  padding: 10rpx 0;
}

.product-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin-right: 30rpx;
  
  &__img {
    width: 120rpx;
    height: 120rpx;
    background-color: $bg-white;
    border-radius: $border-radius-md;
    padding: 10rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
  }
  
  &__name {
    font-size: 24rpx;
    color: $text-secondary;
    margin-top: 12rpx;
  }
}
</style>