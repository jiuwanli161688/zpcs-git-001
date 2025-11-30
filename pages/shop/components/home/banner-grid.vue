<template>
  <view class="banner">
    <!-- 左侧大图 -->
    <view class="banner__left" @click="onClickMain">
      <image class="banner__img" :src="mainBanner.image"></image>
      <view class="banner__mask"></view>
      <view class="banner__text">
        <text class="banner__title">{{ mainBanner.title }}</text>
        <view class="banner__sub">
          <text>{{ mainBanner.subtitle }}</text>
          <image v-if="mainBanner.flag" class="banner__flag" :src="mainBanner.flag" mode="aspectFit"></image>
        </view>
      </view>
    </view>
    
    <!-- 右侧小卡片 -->
    <view class="banner__right">
      <view 
        class="banner__card" 
        v-for="(item, index) in subBanners" 
        :key="index"
        @click="onClickSub(item)"
      >
        <image class="banner__card-img" :src="item.image" mode="aspectFill"></image>
        <text class="banner__card-title">{{ item.title }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'BannerGrid',
  props: {
    // 主 banner
    mainBanner: {
      type: Object,
      default: () => ({
        title: '',
        subtitle: '',
        image: '',
        flag: '',
        code: ''
      })
    },
    // 副 banner 列表
    subBanners: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onClickMain() {
      this.$emit('click-main', this.mainBanner)
    },
    onClickSub(item) {
      this.$emit('click-sub', item)
    }
  }
}
</script>

<style lang="scss" scoped>
$border-radius-md: 16rpx;

.banner {
  display: flex;
  gap: 16rpx;
  height: 380rpx;
  margin-bottom: 30rpx;
  
  &__left {
    flex: 2;
    position: relative;
    border-radius: $border-radius-md;
    overflow: hidden;
  }
  
  &__img {
    width: 100%;
    height: 100%;
  }
  
  &__mask {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
  }
  
  &__text {
    position: absolute;
    left: 24rpx;
    bottom: 24rpx;
    z-index: 1;
  }
  
  &__title {
    display: block;
    font-size: 40rpx;
    font-weight: bold;
    color: #fff;
  }
  
  &__sub {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #fff;
    margin-top: 8rpx;
  }
  
  &__flag {
    width: 28rpx;
    height: 28rpx;
    margin-left: 8rpx;
  }
  
  &__right {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }
  
  &__card {
    flex: 1;
    position: relative;
    border-radius: $border-radius-md;
    overflow: hidden;
    
    &-img {
      width: 100%;
      height: 100%;
    }
    
    &-title {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
      font-size: 26rpx;
      font-weight: bold;
      text-align: center;
      color: #fff;
      text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.3);
    }
  }
}
</style>
