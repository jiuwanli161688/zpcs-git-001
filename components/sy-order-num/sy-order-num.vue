<template>
  <view class="order-card">
    <view class="data">
      <view class="num">{{ type }}:{{ orderNum }}</view>
      <view class="time">{{ time }}</view>
    </view>
    <view class="info">
      <view class="img">
        <u-avatar :src="img" mode="square" size="120"></u-avatar>
      </view>
      <view class="text">
        <view class="name">{{ name }}</view>
        <view class="state" :style="{ gap: state1 && state2 ? '20rpx' : '0' }">
          <view class="state1" v-if="state1">{{ state1 }}</view>
          <view class="state2" v-if="state2">{{ state2 }}</view>
        </view>
      </view>
      <view class="price">
        <view class="money">￥{{ formattedPrice }}</view>
        <view class="num">共{{ num }}件</view>
        <view class="btns">
          <button size="mini" @tap="handSendproduct">发送</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "type"
    },
    orderNum: {
      type: String,
      default: ""
    },
    time: {
      type: String,
      default: ""
    },
    img: {
      type: String,
      //   default: "/static/1.jpg"
    },
    name: {
      type: String,
      default: "name"
    },
    orderStatus: {
      type: String,
      default: ""
    },
    state1: {
      type: String,
      default: ""
    },
    state2: {
      type: String,
      default: ""
    },
    price: {
      type: String,
      default: ''
    },
    num: {
      type: Number,
      default: 0
    },
    serviceStatus: {
      type: String,
      default: ''
    },
    serviceType: {
      type: String,
      default: ''
    },
  },
  computed: {
    formattedPrice() {
      return parseFloat(this.price).toFixed(2);
    },
  },
  methods: {
    handSendproduct() {
      let info = {}
      if (!this.state1) {
        info = {
          thumbnail: this.img,
          goodsName: this.name,
          orderStatus: this.orderStatus,
          orderStatusValue: this.state2,
          sn: this.orderNum,
          price: this.price
        }
      } else {
        info = {
          goodsName: this.name,
          serviceType: this.serviceType,
          goodsImage: this.img,
          serviceStatus: this.serviceStatus,
          sn: this.orderNum,
          price: this.price,
          serviceStatusText: this.state2
        }
      }
      this.$emit('emitSend', info, 1)
    }
  },

}
</script>
<style lang="scss" scoped>
.order-card {
  // width: calc(100% - 48rpx);
  margin: 20rpx 24rpx;
  padding: 20rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;

  .data {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 22rpx;
    color: #999999;
  }

  .info {
    max-height: 120rpx;
    margin-top: 8rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 14rpx;

    .text {
      // max-width: 370rpx;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .name {
        font-size: 28rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .state {
        font-size: 20rpx;
        // gap: 24rpx;
        display: flex;
        flex-direction: row;

        .state1 {
          color: #C83F24;
        }

        .state2 {
          color: #999999;
        }
      }
    }

    .price {
      min-width: 20%;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-around;

      .money {
        font-size: 26rpx;
        color: #333333
      }

      .num {
        font-size: 20rpx;
        color: #999999;
      }

      .btns {

        button {
          background-color: #C83F24;
          height: 44rpx;
          font-size: 22rpx;
          border: none;
          display: flex;
          align-items: center;
          color: #FFFFFF;
        }
      }
    }
  }
}
</style>