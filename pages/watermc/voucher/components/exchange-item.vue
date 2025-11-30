<template>
  <view class="exchange-list">
    <view class="exchange-item bor-r">
      <view class="tit">
        <view class="tit-data">{{ list.createTime }}</view>
        <view class="tit-coupon" :class="{'grayText':list.inOrExp !== 'IN'}">
            <image :src="iconRed" v-if="list.inOrExp === 'IN'" />
            <image :src="iconCoupon" v-else />
            {{list.inOrExp === 'IN'?'增加':'减少'}}{{ Math.abs(list.num) }}兑换券
        </view>
      </view>
      <view class="name-price">
        <view class="">{{ list.desc }}</view>
        <view class="status" :class="{'grayText':list.inOrExp !== 'IN'}">
          <!-- <text class="statusj">+</text> -->
          <text class="statusj">{{list.inOrExp === 'IN'? '消费':'退款'}}</text>
          <text class="statusM">￥</text>{{ Math.abs(list.oriNum) }}
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      iconRed: '/static/cbd/couponRed.png',
      iconCoupon: '/static/cbd/headCoupon.png',
    }
  },
  props: {
    list:{
        type: Object,
        default: {},//控制每个item右侧文字颜色，0为红色，1为灰色
    },
  },
}
</script>
<style lang="scss" scoped>
.bor-r {
  border-radius: 20rpx;
}
.bor-min {
  border-radius: 10rpx;
}
.exchange-item {
  width: 100%;
  height: 110rpx;
  background: #ffffff;
  padding: 14rpx 12rpx 0 20rpx;
  margin:20rpx 0;
  .tit {
    width: 100%;
    height: 40rpx;
    font-size: 24rpx;
    font-weight: 400;
    display: flex;
    justify-content: center;
    align-items: center;
    view {
      flex: 1;
    }
    view:nth-child(1) {
      color: #999999;
    }
    .tit-coupon {
      color: #ff0101;
      text-align: right;
      display: flex;
      justify-content: right;
      align-items: center;
      image {
        width: 30rpx;
        height: 20rpx;
        margin-top: 4rpx;
        margin-right: 10rpx;
      }
    }
  }
  .name-price {
    width: 100%;
    height: 40rpx;
    font-size: 28rpx;
    font-weight: 400;
    display: flex;
    justify-content: center;
    align-items: center;
    view {
      flex: 1;
    }
    .status {
      text-align: right;
      font-size: 24rpx;
      font-weight: 500;
      display: flex;
      justify-content: right;
      align-items: center;
      text-indent: 2rpx;
      color: #ff0101;
      .statusj {
        display: inline-block;
        margin-right: 4rpx;
      }
      .statusM {
        display: inline-block;
        font-size: 18rpx;
        margin-top: 4rpx;
        margin-right: -2rpx;
      }
    }
  }
}
.minText {
  font-size: 20rpx;
}
.grayText {
  color: #999999 !important;
}
</style>
