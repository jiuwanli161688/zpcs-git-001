<template>
  <view class="user-rating">
    <slot name="top"></slot>
    
    <view class="rating-stars">
      <view 
        v-for="i in 5" 
        :key="i"
        class="star-item"
        @click="handleRate(i)"
      >
        <view class="star-icon" :class="i <= currentRating ? 'star-active' : ''">
          <uni-icons type="star-filled" size="80rpx" :color="i <= currentRating ? '#ff5757' : '#e0e0e0'"></uni-icons>
        </view>
        <text class="star-label">{{ labels[i - 1] }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    days: {
      type: Number,
      default: 0
    },
    currentRating: {
      type: Number,
      default: 0
    }
  },
  
  data() {
    return {
      labels: ['很糟糕', '比较差', '一般般', '还可以', '很满意']
    }
  },
  
  methods: {
    handleRate(rating) {
      this.$emit('rate', rating)
    }
  }
}
</script>

<style lang="scss" scoped>
.user-rating {
  padding: 20rpx;
  margin-top: 20rpx;
  background: #fff;
  border-radius: 24rpx;
  
  .rating-title {
    margin-bottom: 32rpx;
    
    text {
      color: #333;
      font-size: 32rpx;
      font-weight: 500;
    }
  }
  
  .rating-stars {
    display: flex;
    justify-content: space-between;
    padding: 0 20rpx;
    
    .star-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16rpx;
      
      .star-icon {
        width: 88rpx;
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .icon-star {
          color: #e0e0e0;
          font-size: 64rpx;
        }
        
        &.star-active .icon-star {
          color: #ff5757;
        }
      }
      
      .star-label {
        color: #999;
        font-size: 24rpx;
        margin-top: -16rpx;
      }
    }
  }
}
</style>
