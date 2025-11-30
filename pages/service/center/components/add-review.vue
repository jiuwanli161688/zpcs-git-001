<template>
  <!-- 步骤三 平台审核 -->
  <view>
    <view v-show="signingStatus == 0">
      <view class="cen-platform-img">
        <image :src="iconWait"/>
      </view>
      <view class="bspan">等待平台审核</view>
      <view class="textspan">您提交的商家信息已提交，请等待审核···</view>
    </view>
    <view v-show="signingStatus == 1">
      <view class="cen-platform-img">
        <image :src="iconFailure"></image>
      </view>
      <view class="bspan">资料审核失败</view>
      <view class="textspan">这里是后台输入的审核失败原因···</view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      signingStatus:1,
      iconWait: `/static/cbd/service/icon-wait.png`, //等待img
      iconFailure: `/static/cbd/service/icon-failure.png`, //失败img
    }
  },
}
</script>
<style scoped lang="scss">
.cen-platform {
  width: 100%;
  height: 362rpx;
  margin-top: 40rpx;
  background-color: white;
  border-radius: 20rpx;
  padding-top: 60rpx;
}

.cen-platform-img {
  width: 100%;
  height: 112rpx;
  display: flex;
  justify-content: center;
  align-items: center;

  image {
    width: 112rpx;
    height: 112rpx;
  }
}
.cen-platform {
  width: 100%;
  height: 362rpx;
  margin-top: 40rpx;
  background-color: white;
  border-radius: 20rpx;
  padding-top: 60rpx;
}

.cen-platform-img {
  width: 100%;
  height: 112rpx;
  display: flex;
  justify-content: center;
  align-items: center;

  image {
    width: 112rpx;
    height: 112rpx;
  }
}

.bspan {
  width: 100%;
  font-size: 36rpx;
  font-weight: 500;
  color: #333333;
  text-align: center;
  margin-top: 20rpx;
}

.textspan {
  width: 100%;
  font-size: 24rpx;
  font-weight: 400;
  color: #999999;
  text-align: center;
  margin-top: 24rpx;
}

.cen-sign {
  width: 100%;
  height: auto;
  margin-top: 40rpx;
  background-color: white;
  border-radius: 20rpx;
  padding-top: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.bsub {
  width: 286rpx;
  height: 62rpx;
  border-radius: 40rpx;
  background-color: #ff0101;
  text-align: center;
  line-height: 62rpx;
  margin: 54rpx auto 0;
  font-size: 28rpx;
  font-weight: 400;
  color: white;
}

.s-textss {
  padding-right: 14rpx !important;
}
</style>
