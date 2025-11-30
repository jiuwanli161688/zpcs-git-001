<template>
  <view class="shop-item" @click="onClick">
    <!-- 左侧图片 -->
    <view class="shop-img-box">
      <image
        class="shop-img"
        :src="item.image"
        mode="aspectFill"
        :lazy-load="true"
      ></image>
    </view>

    <!-- 右侧内容 -->
    <view class="shop-info">
      <!-- 第一行：标题 + 营业状态 -->
      <view class="row-title">
        <text class="shop-name">{{ item.name }}</text>
        <view class="status-tag" :class="{ closed: !item.isOpen }">
          <text>{{ item.isOpen ? "营业中" : "休息中" }}</text>
        </view>
      </view>

      <!-- 第二行：评分 + 距离 -->
      <view class="row-rate">
        <view class="rate-box">
          <rate-score :score="item.rating" />
        </view>
        <text class="distance">{{ item.distance }}</text>
      </view>

      <!-- 第三行：分类 + 区域 -->
      <view class="row-tags">
        <text v-for="ele in item.tags" :key="ele" class="category-text">{{
          ele
        }}</text>
      </view>

      <!-- 第四行：优惠券 -->
      <view class="row-coupon" v-if="item.coupon">
        <view class="coupon-tag">
          <text class="coupon-icon">券</text>
          <text class="coupon-text">{{ item.coupon }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import RateScore from "../../../components/shop/rate-score.vue";

export default {
  name: "shop-item",
  components: {
    RateScore,
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    onClick() {
      this.$emit("click", this.item);
    },
  },
};
</script>

<style lang="scss" scoped>
.shop-item {
  display: flex;
  padding: 24rpx;
  background-color: #ffffff;
  margin-bottom: 20rpx;
  border-radius: 16rpx;

  .shop-img-box {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    overflow: hidden;
    margin-right: 24rpx;
    flex-shrink: 0;

    .shop-img {
      width: 100%;
      height: 100%;
      background-color: #eee;
    }
  }

  .shop-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .row-title {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      .shop-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        line-height: 1.4;
        flex: 1;
        margin-right: 10rpx;
      }

      .status-tag {
        position: absolute;
        top: 50rpx;
        right: 0;
        font-size: 24rpx;
        color: #ffc300;
        padding: 2rpx 8rpx;
        border-radius: 4rpx;
        flex-shrink: 0;

        &.closed {
          color: #999;
          border-color: #999;
        }
      }
    }

    .row-rate {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8rpx;

      .rate-box {
        display: flex;
        align-items: center;

        .stars {
          display: flex;
          margin-right: 8rpx;

          .star-icon {
            font-size: 24rpx;
            color: #ddd;

            &.full {
              color: #ff4500;
            }

            &.half {
              color: #ff4500;
            }
          }
        }

        .score {
          font-size: 28rpx;
          color: #ff4500;
          font-weight: bold;
        }
      }

      .distance {
        position: absolute;
        top: 48rpx;
        right: 6rpx;
        font-size: 24rpx;
        color: #666;
      }
    }

    .row-tags {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #999;
      margin-top: 8rpx;

      .category-text {
        margin-right: 10rpx;
      }
    }

    .row-coupon {
      margin-top: 12rpx;
      display: flex;

      .coupon-tag {
        display: flex;
        align-items: center;
        border-radius: 4rpx;
        overflow: hidden;
        height: 32rpx;

        .coupon-icon {
          background-color: #fff;
          color: #ff4500;
          font-size: 20rpx;
          padding: 0 6rpx;
          height: 100%;
          display: flex;
          align-items: center;
          font-style: italic;
          border: 2rpx solid #fe5c3c;
					border-radius: 2px 0px 0px 2px;
        }

        .coupon-text {
          color: #FE5C3C;
          font-size: 20rpx;
          padding: 0 8rpx;
          line-height: 32rpx;
          font-style: italic;
          background: #ffedea;
        }
      }
    }
  }
}
</style>
