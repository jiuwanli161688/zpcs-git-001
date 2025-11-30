<template>
  <view class="review-item">
    <view class="review-header">
      <view class="user-info">
        <image
          class="user-avatar"
          :src="review.avatar"
          mode="aspectFill"
        ></image>
        <view class="user-detail">
          <text class="username">{{ review.username }}</text>
          <text class="time">{{ review.time }}</text>
        </view>
      </view>
      <star-rating :score="review.rating" :show-num="false"></star-rating>
    </view>

    <view class="review-content">
      <text>{{ review.content }}</text>
    </view>

    <view
      v-if="review.images && review.images.length > 0"
      class="review-images"
    >
      <image
        v-for="(img, index) in review.images"
        :key="index"
        class="review-img"
        :src="img"
        mode="aspectFill"
        @tap="previewImage(index)"
      ></image>
    </view>
  </view>
</template>

<script>
import starRating from "../../../components/shop/rate-score.vue";

export default {
  components: {
    starRating,
  },
  props: {
    review: {
      type: Object,
      required: true,
    },
  },
  methods: {
    previewImage(index) {
      uni.previewImage({
        current: index,
        urls: this.review.images,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.review-item {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20rpx;
    .user-avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }
    .user-info {
      display: flex;
      align-items: center;

      .user-detail {
        display: flex;
        flex-direction: column;

        .username {
          font-size: 30rpx;
          color: #333;
          font-weight: bold;
          margin-bottom: 10rpx;
        }

        .time {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }

  .review-content {
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
    margin-bottom: 20rpx;
  }

  .review-images {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;

    .review-img {
      width: 200rpx;
      height: 200rpx;
      border-radius: 12rpx;
    }
  }
}
</style>
