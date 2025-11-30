<template>
  <view class="message-item user-area">
    <view class="product-item-message">
      <view class="card-top">
        <view class="product-img">
          <u-avatar class="avatar" :src="info.goodsImage" mode="square" size="140"></u-avatar>
          <!-- <image class="avatar" :src="info.goodsImage" mode="scaleToFill" /> -->
        </view>
        <view class="info">
          <view class="name">{{ info.goodsName }}</view>
          <view class="pirce">￥{{ formattedPrice }}</view>
        </view>
      </view>
      <!-- <view class="card-bottom">
        <view class="text_box">
          <view class="text" v-for="(item, index) in tags" :key="index">{{ item }}</view>
        </view>
        <u-icon name="arrow-right" size="24" color="#CACACA" @click="handleButtonClick(url)"></u-icon>
      </view> -->
    </view>
  </view>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      tags: ['7天无理由退款']
    }
  },
  computed: {
    formattedPrice() {
      return parseFloat(this.info.price).toFixed(2);
    }
  },
  methods: {
    handleButtonClick(url) {
      //   uni.navigateTo({
      //     url: url
      //   })
      console.log(url)
    }
  }

}
</script>
<style lang="scss" scoped>
.message-item {
  margin: 20rpx 0;


  .product-item-message {
    width: 578rpx;
    background-color: white;
    padding: 24rpx;
    border-radius: 16rpx;

    .card-top {
      display: flex;
      flex-direction: row;
      align-items: start;

      .product-img {
        width: 140rpx;
        height: 140rpx;
        border-radius: 8rpx;
        background-color: #fff;
        box-shadow: 0 3.50rpx 8.76rpx rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }

      .product-img image {
        width: 140rpx;
        height: 140rpx;
        border-radius: 8rpx;
      }

      .info {
        margin-left: 16rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 140rpx;
        // width: calc(100% - 80rpx);

        .name {
          font-size: 28rpx;
          color: #333;
          // 超出两行显示省略号
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          // -webkit-box-orient: vertical;
        }

        .pirce {
          font-size: 26rpx;
          color: #C83F24;
          text-align: left;
          margin-top: auto;
        }
      }
    }

    .card-bottom {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-top: 12rpx;
      font-size: 22rpx;
      color: #C87224;

      .text_box {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .text {
          margin-right: 8rpx;
          // padding: 4rpx 8rpx;
          border-radius: 8rpx;
          color: #C87224;
          font-size: 20rpx;
        }
      }
    }
  }
}

.user-area {
  display: flex;
  flex-direction: row-reverse;
}
</style>