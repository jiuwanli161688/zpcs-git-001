<template>
  <view class="container">
    <!-- 地址 -->
    <exchange-address />
    <!-- 商品 -->
    <exchange-product />
    <!-- 运费以及留言 -->
    <view class="freight bor-r">
      <view class="freight-item">
        <view class="freight-text">运费</view>
        <view class="freight-num">￥0.00</view>
      </view>
      <view class="freight-item">
        <view class="freight-text">兑换券</view>
        <view class="freight-num">30200</view>
      </view>
      <view class="freight-item">
        <view class="freight-text">物流公司</view>
        <view class="freight-num">京东快递</view>
      </view>
      <view class="freight-item">
        <view class="freight-text">留言信息</view>
        <view class="freight-num txt">
          <input type="text" placeholder="如有其他要求，请再次输入留言" />
        </view>
      </view>
    </view>
    <!-- 提交按钮 -->
    <view class="sub">
      <view class="sub-btn bor-r">提交</view>
    </view>
  </view>
</template>
<script>
import ExchangeAddress from './components/exchange-address.vue';
import ExchangeProduct from './components/exchange-product.vue';
export default {
  name: '',
  components: { 
    ExchangeAddress,
    ExchangeProduct
   },
  data() {
    return {}
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
//通用10的边框角度
.bor-r {
  border-radius: 20rpx;
}
.bor-min {
  border-radius: 10rpx;
}

.container {
  width: 100%;
  height: calc(100vh - 88rpx);
  padding: 0 20rpx;
  position: relative;
  display: flex;
  flex-direction: column;
}

.freight {
  width: 100%;
  height: 260rpx;
  padding: 20rpx;
  margin-top: 30rpx;
  background: #ffffff;
  .freight-item {
    width: 100%;
    height: 48rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 6rpx 0;
    view {
      flex: 1;
      font-size: 28rpx;
    }
    view:nth-child(2) {
      flex: 1.7;
    }
    .freight-text {
      color: #999999;
    }
    .freight-num {
      text-align: right;
      position: relative;
    }
    .freight-num input {
      width: 94%;
      height: 40rpx;
      background: white;
      font-size: 28rpx;
      font-weight: 400;
      text-align: left;
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
.sub {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 108rpx;
  background: white;
  padding: 24rpx 20rpx 0;
  .sub-btn {
    width: 100%;
    height: 80rpx;
    background: #ff0101;
    text-align: center;
    line-height: 80rpx;
    color: white;
    font-weight: 400;
  }
}
</style>
