<template>
  <view class="review-section">
    <view class="section-header">
      <text class="section-title">评价（{{ count }}）</text>
      <view class="view-all" @click="$emit('view-all')">
        <text>查看全部</text>
        <uni-icons type="right" size="14" color="#666"></uni-icons>
      </view>
    </view>
    
    <!-- 评价列表 -->
    <view v-if="list.length > 0" class="review-list">
      <review-item 
        v-for="item in list" 
        :key="item.id"
        :review="item"
      />
    </view>
    
    <!-- 空状态 -->
    <view v-else-if="!loading" class="empty-state">
      <image src="/static/icon/empty.png" class="empty-image" mode="aspectFit" />
      <text class="empty-text">暂无数据</text>
    </view>
    
    <!-- 加载中 -->
    <view v-if="loading" class="loading-state">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script>
import ReviewItem from './review-item.vue'

export default {
  components: {
    ReviewItem
  },
  
  props: {
    count: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.review-section {
  padding: 20rpx;
  margin-top: 20rpx;
  background: #fff;
  border-radius: 24rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32rpx;
    
    .section-title {
      color: #333333;
      font-size: 28rpx;
      font-weight: bold;
    }
    
    .view-all {
      display: flex;
      align-items: center;
      gap: 8rpx;
      
      text {
        color: #333;
        font-size: 28rpx;
      }
      
      .icon-arrow-right {
        font-size: 20rpx;
      }
    }
  }
  
  .review-list {
    display: flex;
    flex-direction: column;
    padding: 0 20rpx;
    gap: 32rpx;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx 0;
    
    .empty-image {
      width: 200rpx;
      height: 200rpx;
      opacity: 0.4;
      mix-blend-mode: luminosity;
      filter: opacity(0.9);
    }
    
    .empty-text {
      color: #999;
      font-size: 28rpx;
    }
  }
  
  .loading-state {
    text-align: center;
    padding: 40rpx 0;
    color: #999;
    font-size: 28rpx;
  }
}
</style>
