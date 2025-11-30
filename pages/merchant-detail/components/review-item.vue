<template>
  <view class="review-item">
    <view class="review-header">
      <view class="user-info">
        <image :src="review.avatar" class="user-avatar" mode="aspectFill" />
        <view class="user-detail">
          <text class="user-name">{{ review.nickname }}</text>
          <text class="review-time">{{ review.time }}</text>
        </view>
      </view>
      
      <view class="rating-stars">
        <view 
          v-for="i in 5" 
          :key="i"
          :class="['star', i <= review.rating ? 'star-filled' : '']"
        >
          <text class="iconfont icon-star"></text>
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
        v-for="(img, idx) in review.images" 
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
      needExpand: false
    }
  },
  
  mounted() {
    // 判断内容是否需要展开
    this.needExpand = this.review.content && this.review.content.length > 100
  },
  
  methods: {
    previewImage(index) {
      uni.previewImage({
        urls: this.review.images,
        current: index
      })
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
    
    .user-info {
      display: flex;
      gap: 20rpx;
      
      .user-avatar {
        width: 72rpx;
        height: 72rpx;
        border-radius: 50%;
      }
      
      .user-detail {
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
