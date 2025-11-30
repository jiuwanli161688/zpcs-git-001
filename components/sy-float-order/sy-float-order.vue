<template>
  <view v-if="floatShow" class="card">
    <u-avatar :src="img" mode="square" size="96"></u-avatar>
    <view class="info">
      <view class="name">{{ name }}</view>
      <view class="card-bottom">
        <view class="left">
          <!-- <view class="tags">
            <u-tag v-for="(item, index) in tags" :key="index" color="#C83F24" border-color="#FFAEAE" bg-color="#FFFFFF"
              :text="item" size="mini" />
          </view> -->
          <view class="pirce">￥{{ formattedPrice }}</view>
        </view>
        <view class="right">
          <button size="mini" @tap="handSendproduct">发送</button>
        </view>
      </view>
    </view>
    <u-icon class="close-btn" @tap="close_oldOrder" name="close" size="20"></u-icon>
  </view>
</template>

<script>
export default {
  props: {
    img: {
      type: String,
      // default: '/static/1.jpg'
    },
    name: {
      type: String,
      default: 'name'
    },
    price: {
      type: Number,
      default: 0
    },

  },
  data() {
    return {
      floatShow: true,
      tags: ['7天无理由退款']
    }
  },
  computed: {
    formattedPrice() {
      return parseFloat(this.price).toFixed(2);
    }
  },
  methods: {
    close_oldOrder() {
      this.floatShow = false
    },
    handSendproduct() {
      const info = {
        img: this.img,
        name: this.name,
        tags: this.tags,
        price: this.price
      }
      this.$emit('emitSend', info)
    }
  }
}
</script>
<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  padding: 14rpx;
  border-radius: 16rpx;
  position: relative;
  margin: 24rpx 24rpx 0 24rpx;

  .info {
    margin-left: 16rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // width: calc(100% - 80rpx);
    width: 100%;

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
      align-items: center;

      .tags {
        display: flex;
        gap: 4rpx;
      }

      .pirce {
        margin-top: 4rpx;
        font-size: 26rpx;
        color: #C83F24;
      }

      button {
        background-color: #C83F24;
        height: 44rpx;
        font-size: 24rpx;
        border: none;
        display: flex;
        align-items: center;
        color: #FFFFFF;
      }
    }
  }

  .close-btn {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
  }
}
</style>