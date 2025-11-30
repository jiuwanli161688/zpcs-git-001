<template>
  <view class="merchant-hero">
    <!-- 轮播图 -->
    <swiper class="hero-swiper" :indicator-dots="images.length > 1" :autoplay="true" :circular="true"
      indicator-color="rgba(255, 255, 255, 0.5)" indicator-active-color="#fff" @change="handleSwiperChange">
      <swiper-item v-for="(image, index) in images" :key="index">
        <image :src="image" mode="aspectFill" class="hero-image" @click="previewImage(index)" />
      </swiper-item>
    </swiper>

    <!-- 顶部操作栏 -->
    <view class="hero-header" :style="{ marginTop: statusBarHeight + 'px' }">
      <view class="header-left">
        <view class="icon-btn" @click="$emit('back')">
          <uni-icons type="left" size="20" color="#fff"></uni-icons>
        </view>
      </view>

      <view class="header-right">
        <view class="icon-btn" @click="$emit('search')">
          <image src="/static/cbd/shop/detail/search.png" mode="aspectFill" class="search-image" />
        </view>
        <view class="icon-btn" @click="$emit('share')">
          <image src="/static/cbd/shop/detail/share.png" mode="aspectFill" class="share-image" />
        </view>
      </view>
    </view>

    <!-- 资质和相册标签 -->
    <view class="hero-badges">
      <view class="badge-item" @click="goPage('/pages/merchant-detail/merchant-info')">
        <text>资质</text>
        <uni-icons type="right" size="10" color="#ffffff"></uni-icons>
      </view>
      <view class="badge-item" @click="goPage('/pages/check-in-album/index')">
        <text>相册</text>
        <uni-icons type="right" size="10" color="#ffffff"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  created() {
    const systemInfo = uni.getSystemInfoSync()
    this.statusBarHeight = systemInfo.statusBarHeight
  },
  data() {
    return {
      statusBarHeight: 0,
      currentIndex: 0
    }
  },

  methods: {
    handleSwiperChange(e) {
      this.currentIndex = e.detail.current
    },
    onShare() {

    },
    previewImage(index) {
      uni.previewImage({
        urls: this.images,
        current: index
      })
    },
    goPage(url) {
      uni.navigateTo({ url })
    }
  }
}
</script>

<style lang="scss" scoped>
.merchant-hero {
  position: relative;
  height: 580rpx;

  .hero-swiper {
    width: 100%;
    height: 100%;

    .hero-image {
      width: 100%;
      height: 100%;
    }
  }

  .hero-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;

    .header-left,
    .header-right {
      display: flex;
      gap: 16rpx;
    }

    .icon-btn {
      width: 60rpx;
      height: 60rpx;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 6rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .search-image {
      width: 40rpx;
      height: 38rpx;
    }

    .share-image {
      width: 30rpx;
      height: 38rpx;
    }
  }

  .hero-badges {
    position: absolute;
    bottom: 70rpx;
    right: 30rpx;
    display: flex;
    gap: 16rpx;
    z-index: 10;

    .badge-item {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10rpx);
      border-radius: 40rpx;
      padding: 6rpx 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8rpx;

      text {
        color: #fff;
        font-size: 20rpx;
      }
    }
  }
}
</style>
