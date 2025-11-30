<template>
  <view class="header bor-r">
    <view class="head-box bor-r txts">
      <view class="address">
        <text class="address-text bor-min">默认</text>
        <text class="text">北京市海淀区</text>
      </view>
      <view class="detailedAddress"> 十里河村545号八号公寓8234 </view>
      <view class="name-phone">
        <text class="name">张三</text>
        <text class="phone">138****0000</text>
      </view>
    </view>
  </view>
</template>
<script>
</script>
<style lang="scss" scoped>
//通用10的边框角度
.bor-r {
  border-radius: 20rpx;
}
.bor-min {
  border-radius: 10rpx;
}

.header {
  width: 100%;
  height: 190rpx;
  background: white;
  padding: 6rpx;
  .head-box {
    width: 100%;
    height: 100%;
    padding:16rpx 16rpx 0 16rpx;
    background: linear-gradient(90deg, #e8eaf1 0%, #fff 50%, #fff 100%);
    position: relative; //给右侧三角预留定位
    .address {
      width: 100%;
      font-weight: 400;
      display: flex;
      justify-content: left;
      align-items: center;
      .address-text {
        width: 68rpx;
        height: 30rpx;
        display: inline-block;
        text-align: center;
        font-size: 20rpx;
        line-height: 30rpx;
        color: white;
        padding: 0 14rpx;
        background: linear-gradient(90deg, #ffc96a 0%, #ff2a1a 100%);
      }
      .text {
        display: inline-block;
        margin-left: 14rpx;
        font-size: 20rpx;
        color: #666666;
      }
    }

    .detailedAddress {
      width: 100%;
      height: auto;
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
      margin-top: 10rpx;
    }
    .name-phone {
      width: 100%;
      height: 40rpx;
      margin-top: 20rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: #666666;
      .phone {
        display: inline-block;
        margin-left: 22rpx;
      }
    }
  }
}
//标记>
.txt::after {
  position: absolute;
  content: '';
  width: 12rpx;
  height: 12rpx;
  border: 4rpx solid #333333;
  border-left: none;
  border-bottom: none;
  right: 10rpx;
  top: 47%;
  -webkit-transform: rotate(45deg) translateY(-45%);
  transform: rotate(45deg) translateY(-45%);
}
.txts::after {
  position: absolute;
  content: '';
  width: 12rpx;
  height: 12rpx;
  border: 4rpx solid #999999;
  border-left: none;
  border-bottom: none;
  right: 30rpx;
  top: 45%;
  -webkit-transform: rotate(45deg) translateY(-45%);
  transform: rotate(45deg) translateY(-45%);
}
</style>
