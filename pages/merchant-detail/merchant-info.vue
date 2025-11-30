<template>
  <view class="merchant-info">
    <view class="title">商家资质公式</view>
    <image
      :src="infoImg"
      mode="aspectFill"
      class="merchant-image"
      @click="previewImage(infoImg)"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      infoImg: "/static/cbd/shop/detail/test-img.png",
    };
  },
  onLoad(options) {},
  methods: {
    previewImage(infoImg) {
      uni.previewImage({
        urls: [infoImg],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.merchant-info {
  background: #fff;
  padding: 0 20rpx;
  .title {
    color: #333;
    font-size: 28rpx;
    margin-bottom: 20rpx;
  }
  .merchant-image {
    width: calc(100vw - 40rpx);
    max-height: 500rpx;
    margin-bottom: 20rpx;
  }
}
</style>
