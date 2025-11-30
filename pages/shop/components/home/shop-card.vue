<template>
  <view class="shop-card" @click="onClick">
    <image class="shop-card__img" :src="shop.image" mode="aspectFill"></image>
    <view class="shop-card__info">
      <text class="shop-card__name">{{ shop.name }}</text>
      
      <view class="shop-card__rating">
        <view class="shop-card__stars">
          <uni-icons 
            v-for="star in 5" 
            :key="star"
            type="star-filled" 
            size="12" 
            :color="star <= Math.floor(shop.score) ? '#ff5252' : '#ddd'"
          ></uni-icons>
        </view>
        <text class="shop-card__score">{{ shop.score }}</text>
        <text v-if="shop.isOpen" class="shop-card__status">营业中</text>
      </view>
      
      <view class="shop-card__meta">
        <text class="shop-card__category">{{ shop.category }} {{ shop.area }}</text>
        <text class="shop-card__distance">{{ shop.distance }}</text>
      </view>
      
      <view v-if="shop.coupon" class="shop-card__coupon">
        <text class="shop-card__coupon-tag">券</text>
        <text class="shop-card__coupon-text">{{ shop.coupon }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ShopCard',
  props: {
    // 商家信息
    shop: {
      type: Object,
      default: () => ({
        id: '',
        name: '',
        image: '',
        score: 0,
        isOpen: false,
        category: '',
        area: '',
        distance: '',
        coupon: ''
      })
    }
  },
  methods: {
    onClick() {
      this.$emit('click', this.shop)
    }
  }
}
</script>

<style lang="scss" scoped>
$danger-color: #ff5252;
$text-primary: #333;
$text-placeholder: #999;
$bg-white: #fff;
$border-radius-sm: 8rpx;
$border-radius-md: 16rpx;

.shop-card {
  display: flex;
  background-color: $bg-white;
  border-radius: $border-radius-md;
  padding: 24rpx;
  margin-bottom: 20rpx;
  
  &__img {
    width: 180rpx;
    height: 180rpx;
    border-radius: $border-radius-sm;
    flex-shrink: 0;
    margin-right: 24rpx;
  }
  
  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  
  &__name {
    font-size: 32rpx;
    font-weight: bold;
    color: $text-primary;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  &__rating {
    display: flex;
    align-items: center;
    margin-top: 10rpx;
  }
  
  &__stars {
    display: flex;
  }
  
  &__score {
    font-size: 26rpx;
    font-weight: bold;
    color: $danger-color;
    margin-left: 10rpx;
  }
  
  &__status {
    margin-left: auto;
    font-size: 22rpx;
    color: #f57f17;
    padding: 0 12rpx;
    border: 1rpx solid #f57f17;
    border-radius: 4rpx;
  }
  
  &__meta {
    display: flex;
    justify-content: space-between;
    margin-top: 10rpx;
  }
  
  &__category,
  &__distance {
    font-size: 24rpx;
    color: $text-placeholder;
  }
  
  &__coupon {
    display: flex;
    align-items: center;
    margin-top: 10rpx;
    
    &-tag {
      font-size: 20rpx;
      color: $danger-color;
      background-color: #ffebee;
      padding: 2rpx 10rpx;
      border-radius: 4rpx;
      margin-right: 10rpx;
    }
    
    &-text {
      font-size: 22rpx;
      color: $danger-color;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
