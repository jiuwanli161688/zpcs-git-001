<template>
  <view class="merchant-info">
    <!-- 商家名称和距离 -->
    <view class="info-header">
      <text class="merchant-name">{{ merchant.name }}</text>
      <view class="distance">
        <uni-icons type="location" size="15" color="#ff0000"></uni-icons>
        <text class="distance-text">{{ merchant.distance }}m</text>
      </view>
    </view>

    <!-- 评分和分类 -->
    <view class="rating-row">
      <rate-score :score="merchant.rating" />

      <view class="categories">
        <text
          v-for="(cat, idx) in merchant.categories"
          :key="idx"
          class="category-tag"
        >
          {{ cat }}
        </text>
      </view>
    </view>

    <!-- 营业时间 -->
    <view class="business-hours">
      <!-- <text class="status" :class="merchant.status === '营业中' ? 'status-open' : 'status-closed'"> -->
      <text class="status">
        {{ merchant.status }}
      </text>
      <text class="hours">{{ merchant.hours }}</text>
    </view>

    <view class="address-content">
      <!-- 地址 -->
      <view class="address-row" @click="$emit('navigate')">
        <text class="address-text">{{ merchant.address }}</text>
        <uni-icons type="right" size="13" color="#666"></uni-icons>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <view class="action-btn" @click="$emit('navigate')">
          <view class="btn-icon">
            <image src="/static/cbd/shop/detail/car.png" class="icon-car" />
          </view>
          <text class="btn-text">打车</text>
        </view>

        <view class="action-btn" @click="$emit('call')">
          <view class="btn-icon">
            <image src="/static/cbd/shop/detail/phone.png" class="icon-car" />
          </view>
          <text class="btn-text">电话</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import RateScore from "../../../components/shop/rate-score.vue";

export default {
  components: {
    RateScore,
  },
  props: {
    merchant: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style lang="scss" scoped>
.merchant-info {
  padding: 20rpx;
  background: #fff;
  border-radius: 24rpx;

  .info-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24rpx;

    .merchant-name {
      flex: 1;
      font-size: 40rpx;
      font-weight: bold;
      color: #1a1a1a;
      line-height: 1.4;
    }

    .distance {
      display: flex;
      align-items: center;
      gap: 8rpx;
      margin-left: 10rpx;

      .distance-text {
        color: #666;
        font-size: 24rpx;
      }
    }
  }

  .rating-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;

    .rating-stars {
      display: flex;
      align-items: center;
      gap: 16rpx;

      .stars {
        display: flex;
        gap: 4rpx;

        .star {
          .icon-star {
            color: #e0e0e0;
            font-size: 32rpx;
          }

          &.star-filled .icon-star {
            color: #ff5757;
          }
        }
      }

      .rating-number {
        font-size: 32rpx;
        font-weight: 500;
        color: #1a1a1a;
      }
    }

    .categories {
      display: flex;
      gap: 12rpx;

      .category-tag {
        color: #999;
        font-size: 24rpx;
      }
    }
  }

  .business-hours {
    display: flex;
    align-items: center;
    gap: 16rpx;

    .status {
      font-size: 24rpx;

      &.status-open {
        color: #52c41a;
      }

      &.status-closed {
        color: #999;
      }
    }

    .hours {
      color: #666;
      font-size: 28rpx;
    }
  }
  .address-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .address-row {
    display: flex;
    align-items: center;
    gap: 16rpx;
    width: 560rpx;
    height: 100%;

    .address-text {
      // flex: 1;
      color: #333;
      font-size: 24rpx;
    }
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8rpx;

      .btn-icon {
        width: 50rpx;
        height: 50rpx;
        background: #f2f2f2;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .btn-text {
        color: #999;
        font-size: 20rpx;
      }

      .icon-car {
        width: 29rpx;
        height: 24rpx;
      }
    }
  }
}
</style>
