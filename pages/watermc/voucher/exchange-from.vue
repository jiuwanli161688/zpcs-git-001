<template>
  <view class="container">
    <!-- 当前状态 -->
    <view class="status">
      <image :src="status==0?iconComponent:iconComponent" />
      <text>{{status==0?"已完成":"审核中"}}</text>
    </view>
    <!-- 地址 -->
    <exchange-address />
    <!-- 签收状态 -->
    <view class="receipt bor-r">
      <view class="receipt-img">
        <image src="/static/cbd/watermc/voucher/icon-exchange.png" />
        <view>已签收</view>
      </view>
      <view class="h"></view>
      <view class="receipt-text">
        <text>2025-12-12 23:00:54</text>
        <text>快递已送达菜鸟驿站，请尽快领取。</text>
      </view>
    </view>
    <!-- 商品 -->
    <exchange-product />
    <!-- 单号信息 -->
    <view class="freight bor-r" v-if="status == 0">
      <view class="freight-item">
        <view class="freight-text">兑换单号</view>
        <view class="freight-num">
          <view class="view">
            <text class="nums copyNums">7644400003222</text>
            <text @tap="copyNum" class="copy">复制</text>
          </view>
        </view>
      </view>
      <view class="freight-item">
        <view class="freight-text">使用兑换券</view>
        <view class="freight-num">30200</view>
      </view>
      <view class="freight-item">
        <view class="freight-text">快递单号</view>
        <view class="freight-num">京东快递 200033200033</view>
      </view>
      <view class="freight-item">
        <view class="freight-text">留言信息</view>
        <view class="freight-num">没什么，尽快发货就OK</view>
      </view>
      <view class="freight-item">
        <view class="freight-text">提交时间</view>
        <view class="freight-num">2025-12-12 23:00:54</view>
      </view>
      <view class="freight-item">
        <view class="freight-text">核验时间</view>
        <view class="freight-num">2025-12-12 23:00:54</view>
      </view>
      <view class="freight-item">
        <view class="freight-text">发货时间</view>
        <view class="freight-num">2025-12-12 23:00:54</view>
      </view>
      <view class="freight-item">
        <view class="freight-text">完成时间</view>
        <view class="freight-num">2025-12-12 23:00:54</view>
      </view>
    </view>
    <view class="freight bor-r" v-else>
      <view class="freight-item">
        <view class="freight-text">兑换单号</view>
        <view class="freight-num">
          <view class="view">
            <text class="nums copyNums">7644400003222</text>
            <text @tap="copyNum" class="copy">复制</text>
          </view>
        </view>
      </view>
      <view class="freight-item">
        <view class="freight-text">使用兑换券</view>
        <view class="freight-num">30200</view>
      </view>
      <view class="freight-item">
        <view class="freight-text">留言信息</view>
        <view class="freight-num">没什么，尽快发货就OK</view>
      </view>
      <view class="freight-item">
        <view class="freight-text">提交时间</view>
        <view class="freight-num">2025-12-12 23:00:54</view>
      </view>
      <view class="freight-item">
        <view class="freight-text">核验时间</view>
        <view class="freight-num">---</view>
      </view>
    </view>
  </view>
</template>
<script>
import ExchangeAddress from './components/exchange-address.vue'
import ExchangeProduct from './components/exchange-product.vue'
export default {
  name: '',
  components: {
    ExchangeAddress,
    ExchangeProduct,
  },
  data() {
    return {
      iconComponent: '/static/cbd/watermc/voucher/incon-complete.png',
      status: 0, //0已完成，1审核中
    }
  },
  methods: {
    copyNum() {
      uni.showToast({
        title: '复制单号成功',
        icon: 'success',
        duration: 2000,
      })
    },
  },
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
  height: auto;
  padding: 0 20rpx;
  display: flex;
  flex-direction: column;
}
.status {
  width: 100%;
  height: 196rpx;
  padding-top: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  image {
    width: 86rpx;
    height: 86rpx;
  }
  text {
    display: inline-block;
    margin-top: 10rpx;
    width: 100%;
    height: 54rpx;
    text-align: center;
    font-size: 36rpx;
    font-weight: 500;
    color: #333333;
  }
}

.receipt {
  width: 100%;
  height: 130rpx;
  padding-top: 20rpx;
  margin-top: 22rpx;
  background: #ffffff;
  .receipt-img {
    width: 84rpx;
    height: 100%;
    margin: 0 20rpx 0 22rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    float: left;
    image {
      width: 64rpx;
      height: 64rpx;
    }
    view {
      font-weight: 500;
      font-size: 28rpx;
      color: #07c160;
    }
  }
  .h {
    width: 4rpx;
    height: 40rpx;
    background: #d8d8d8;
    float: left;
    margin-top: 40rpx;
  }
  .receipt-text {
    width: calc(100% - 84rpx - 4rpx - 20rpx - 22rpx);
    height: 100%;
    float: left;
    padding-top: 20rpx;
    padding-left: 26rpx;
    font-weight: 400;
    font-size: 28rpx;
    text {
      display: inline-block;
    }
    text:nth-child(1) {
      color: #666666;
    }
    text:nth-child(2) {
      color: #333333;
    }
  }
}
.freight {
  width: 100%;
  height: auto;
  padding: 20rpx;
  margin-top: 30rpx;
  margin-bottom: 20rpx;
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
      .view {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: right;
        align-items: center;
        .nums {
          display: inline-block;
          margin-right: 20rpx;
        }
        .nums::after {
          content: '';
          border-right: 4rpx solid #d8d8d8;
          width: 0;
          height: 40rpx;
          padding-left: 20rpx;
        }
        .copy {
          color: #ff0101;
        }
      }
    }
  }
}
</style>
