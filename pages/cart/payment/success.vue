<template>
  <view class="container">
    <div class="success-box" :style="{ backgroundImage: `url(${orderSuccessBg})` }">
      <div class="success-content">
        <image class="success-logo" :src="messageLogo" mode="aspectFit"></image>
        <div class="success-title">订单支付成功</div>
        <div class="pay-money">￥{{ Number(payPrice) | unitPrice }}</div>
        <div class="order-info">
          <div class="order-row" v-if="orderNo">
            <span>订单编号：</span>
            <span>{{ orderNo }}</span>
          </div>
          <div class="order-row">
            <span>支付方式：</span>
            <span>{{ paymentMethod | paymentTypeFilter }}</span>
          </div>
        </div>
        <div class="btn-group">
          <button class="btn-outline" @click="checkOrder">查看订单</button>
          <button class="btn-primary" @click="navigateTo('/pages/tabbar/home/index', 'switch')">返回首页</button>
        </div>
      </div>
    </div>
    <view class="suggest">
      <goodsRecommend :title="'为你推荐'" />
    </view>
    <GlobalPopup ref="popup"></GlobalPopup>
  </view>
</template>
<script>
import goodsRecommend from "@/components/m-goods-recommend";
import GlobalPopup from "@/components/popups/GlobalPopup";
export default {
  data() {
    return {
      checked: false,
      paymentMethod: "",
      from: "",
      payPrice: 0,
      goodsList: [],
      activeColor: this.$mainColor,
      show: false,
      orderNo: "",
      payTime: "",
      orderSuccessBg: `${this.iconCommon}/static/order-success-bg.png`,
      messageLogo: `${this.iconCommon}/static/order-success-logo.png`,
    };
  },
  components: {
    goodsRecommend,
    GlobalPopup
  },
  filters: {
    paymentTypeFilter(val) {
      switch (val) {
        case "WECHAT":
          return "微信";
        case "ALIPAY":
          return "支付宝";
        case "WALLET":
          return "余额支付";
        case "CLOUD":
          return "云闪付支付";
        default:
          return val || "-";
      }
    },
  },
  onLoad(options) {
    this.paymentMethod = options.paymentMethod || "";
    this.from = options.from || "";
    this.payPrice = options.payPrice || 0;
    this.orderType = options.orderType;
    this.orderNo = options.orderNo || "";
    this.payTime = options.payTime || "";
    setTimeout(() => {
      this.$refs.popup.show('收到一条消息，点击查看', 2500);
    })
  },
  methods: {
    checkOrder() {
      if (this.orderType == "RECHARGE") {
        uni.reLaunch({
          url: `/pages/mine/deposit/operation`,
        });
      } else {
        uni.reLaunch({
          url: `/pages/tabbar/user/profile`,
        })
        uni.navigateTo({
          url: `/pages/profile/order/home?state=2`,
        })
      }
    },
    navigateTo(url, type) {
      if (type === "switch") {
        uni.reLaunch({ url });
      } else {
        uni.redirectTo({ url });
      }
    },
  },
};
</script>
<style scoped lang="scss">
.container {
  position: relative;
  min-height: 100vh;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: flex-start;
}
.success-box {
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 1;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center top;
}
.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  padding: 32px 24px 24px 24px;
  margin: 0 auto;
  width: 90vw;
  max-width: 420px;
  .success-logo {
    width: 90px;
    height: 90px;
    margin-bottom: 10px;
  }
  .success-title {
    font-size: 24px;
    color: #d0021b;
    margin-bottom: 10px;
    font-weight: bold;
  }
  .pay-money {
    font-size: 36px;
    color: #000;
    margin-bottom: 20px;
    font-weight: bold;
  }
  .order-info {
    width: 100%;
    margin: 0 auto 10px auto;
    .order-row {
      display: flex;
      justify-content: space-between;
      font-size: 26rpx;
      color: #666;
      margin-bottom: 8px;
      & span:first-child {
        white-space: nowrap;
      }
    }
  }
  .btn-group {
    display: flex;
    justify-content: center;
    gap: 12px;
    width: 100%;
    .btn-outline, .btn-primary {
      flex: 1;
      min-width: 80px;
      max-width: 120px;
      border-radius: 24px;
      font-size: 16px;
      border: 2px solid #d0021b;
      background: #fff;
      color: #d0021b;
      margin: 0 4px;
      cursor: pointer;
      outline: none;
      transition: background 0.2s, color 0.2s;
    }
    .btn-primary {
      background: #d0021b;
      color: #fff;
    }
  }
}
.suggest {
  margin-top: 30px;
}
</style>
