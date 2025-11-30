<template>
  <view class="browse-card">
    <u-avatar :src="img" mode="square" size="96"></u-avatar>
    <view class="info">
      <view class="name">{{ name }}</view>
      <view class="card-bottom">
        <view class="left">
          <!-- <view class="tags">
            <u-tag v-for="(item, index) in tags" :key="index" color="#C83F24" border-color="#FFAEAE" :text="item"
              size="mini" />
          </view> -->
          <view class="pirce">￥{{ price }}</view>
        </view>
        <view class="price">
          <button size="mini" @tap="handSendproduct">发送</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    img: {
      type: String,
      // default: "/static/1.jpg"
    },
    name: {
      type: String,
      default: "name"
    },
    tags: {
      type: Array,
      default: () => ["tags", "tags"]
    },
    price: {
      type: String,
      default: '0'
    },
    skuId: {
      type: String,
      default: ''
    },
    goodsId: {
      type: String,
      default: ''
    },
  },
  methods: {
    handSendproduct() {
      const info = {
        thumbnail: this.img,
        goodsName: this.name,
        price: this.price,
        id: this.skuId,
        goodsId: this.goodsId,
      }
      this.$emit('emitSend', info, 1)
    }
  }
}

</script>
<style lang="scss" scoped>
.browse-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10rpx 24rpx;
  padding: 20rpx 24rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;

  .info {
    width: 100%;
    margin-left: 16rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .name {
      font-size: 24rpx;
      color: #333;
      // 超出两行显示省略号
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    .card-bottom {
      display: flex;
      justify-content: space-between;

      .tags {
        margin-top: 8rpx;
        display: flex;
        gap: 4rpx;
      }

      .pirce {
        margin-top: 4rpx;
        font-size: 26rpx;
        color: #C83F24;
      }

      .price {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-end;

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