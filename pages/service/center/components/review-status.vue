<template>
  <view>
    <!-- 步骤四 审核结果 -->
    <view style="height: 302rpx" v-show="onlineStatus == 0">
      <view class="cen-platform-img">
        <image :src="iconWait"></image>
      </view>
      <view class="bspan">等待商家签约</view>
      <view class="textspan">请通知本地商家于2025-11-23 23:00:05前完成签约</view>
    </view>
    <view style="height: 346rpx" v-show="onlineStatus == 1">
      <view class="cen-platform-img">
        <image :src="iconTimeout"></image>
      </view>
      <view class="bspan">签约短信超时</view>
      <view class="bsub">发送签约短信</view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      onlineStatus: 1,
      iconWait: `/static/cbd/service/icon-wait.png`, //等待img
      iconTimeout: `/static/cbd/service/icon-timeout.png`, //超时img
      iconFailure: `/static/cbd/service/icon-failure.png`, //失败img
    }
  },
}
</script>
<style lang="scss" scoped>

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
    background-color: #FF0101;
    text-align: center;
    line-height: 62rpx;
    margin: 40rpx auto 0;
    font-size: 28rpx;
    font-weight: 400;
    color: white;
}

.s-textss {
    padding-right: 14rpx !important;
}

.in-picker {
    font-size: 24rpx;
}

.frm-comm .rs .txt .in-picker {
    font-size: 24rpx;
}

//请选择文字灰色版
.text-xz {
    color: #999999;
}


.s-textss {
  padding-right: 14rpx !important;
}

.in-picker {
  font-size: 24rpx;
}

.frm-comm .rs .txt .in-picker {
  font-size: 24rpx;
}

//请选择文字灰色版
.text-xz {
  color: #999999;
}

//自定以针对验真的css
.s-texts {
  width: calc(100vw - 180rpx - 40rpx - 40rpx);
  height: 72rpx;
  line-height: 72rpx;
  font-size: 20rpx;
  box-sizing: border-box;
  padding: 0 16rpx 0 0;
  text-align: right;
  font-style: 20rpx;
}

.dpF {
  display: flex;
  justify-content: right;
  align-items: center;
}

.text10 {
  color: #999999;
}

.prices {
  font-size: 24rpx;
  font-weight: 700;
  color: #fd0e00;
  padding-left: 6rpx;
}
</style>
