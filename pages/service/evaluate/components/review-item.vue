<template>
  <view class="review-item">
    <view class="review-header">
      <view class="user-info">
        <image :src="review.storeLogo" class="user-avatar" mode="aspectFill" />
        <view class="user-detail">
          <text class="user-name">{{ review.storeName }}</text>
          <text class="review-time">{{ review.storeAddressDetail }}</text>
        </view>
        <!-- 右上角星星数量 -->
        <view class="user-evaluate">
          <image class="star-icon" :src="getStarImage(i)" mode="aspectFit" v-for="i in 5" :key="`filled-${i}`"></image>
        </view>
      </view>
    </view>

    <view class="review-content">
      <text class="content-text" :class="expanded ? 'expanded' : ''">
        {{ review.content }}
      </text>
      <text v-if="needExpand && !expanded" class="expand-btn" @click="expanded = true">
        展开
      </text>
    </view>

    <view v-if="review.images && review.images.length > 0" class="review-images">
      <image
        v-for="(img, idx) in review.images.split(',')"
        :key="idx"
        :src="img"
        class="review-image"
        mode="aspectFill"
        @click="previewImage(idx)"
      />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    review: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      expanded: false,
      needExpand: false,
      stas: `/static/cbd/clockIn/star_filled.png`,
      stats: `/static/cbd/clockIn/star_empty.png`,
      greyStas: `/static/cbd/clockIn/star_grey.png`,

    }
  },

  mounted() {
    // 判断内容是否需要展开
    this.needExpand = this.review.content && this.review.content.length > 100
  },

  methods: {
    previewImage(index) {
      uni.previewImage({
        urls: this.review.images.split(','),
        current: index
      })
    },
    getStarImage(index) {
      const currentRating = Number(this.review.grade) || 0;

      if (index <= currentRating) {
        return this.stas;
      } else if (index - 0.5 <= currentRating) {
        return this.stats;
      } else {
        return this.greyStas;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.review-item {
  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24rpx;
    position: relative;

    .user-info {
      display: flex;
      gap: 20rpx;

      .user-avatar {
        width: 96rpx;
        height: 96rpx;
        border-radius: 50%;
      }

      .user-detail {
        margin-top: 10rpx;
        display: flex;
        flex-direction: column;
        gap: 8rpx;

        .user-name {
          color: #1a1a1a;
          font-size: 28rpx;
          font-weight: 500;
        }

        .review-time {
          color: #999;
          font-size: 24rpx;
        }
      }
      .user-evaluate {
        width: 144rpx;
        height: 96rpx;
        background: transparent;
        position: absolute;
        top: 0;
        right: 0rpx;
        display: flex;
        justify-content: space-around;
        align-items: center;

        image {
          width: 24rpx;
          height: 24rpx;
        }
      }
    }

    .rating-stars {
      display: flex;
      gap: 4rpx;

      .star {
        .icon-star {
          color: #e0e0e0;
          font-size: 28rpx;
        }

        &.star-filled .icon-star {
          color: #ff5757;
        }
      }
    }
  }

  .review-content {
    margin-bottom: 24rpx;

    .content-text {
      color: #333;
      font-size: 28rpx;
      line-height: 1.8;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;

      &.expanded {
        display: block;
        -webkit-line-clamp: unset;
      }
    }

    .expand-btn {
      color: #1890ff;
      font-size: 28rpx;
      margin-top: 8rpx;
    }
  }

  .review-images {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16rpx;

    .review-image {
      width: 210rpx;
      height: 208rpx;
      border-radius: 12rpx;
    }
  }
}
</style>
