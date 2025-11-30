<template>
  <view class="review-page">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <view class="back-btn" @tap="goBack">
        <uni-icons type="back" size="20" color="#333"></uni-icons>
      </view>
      <view class="search-input-wrapper" @tap="goSearch">
        <uni-icons type="search" size="20" color="#999" class="search-icon"></uni-icons>
        <input class="search-input" placeholder="此处跳转商家搜索" placeholder-style="color: #999" />
        <view class="search-btn">搜索</view>
      </view>
    </view>

    <!-- 筛选标签 -->
    <scroll-view class="filter-tabs">
      <view v-for="(tab, index) in tabs" :key="index" class="tab-item" @tap="switchTab(index)">
        <text class="tab-text" :class="{ active: activeTab === index }">{{ tab.name }}</text>
        <text v-if="tab.count" class="tab-count">{{ tab.count }}</text>
      </view>
    </scroll-view>

    <!-- 评价列表 -->
    <scroll-view class="review-list" scroll-y>
      <review-item v-for="(review, index) in reviewList" :key="index" :review="review"></review-item>
    </scroll-view>
  </view>
</template>

<script>
import reviewItem from './components/review-item.vue'

export default {
  components: {
    reviewItem
  },
  data() {
    return {
      activeTab: 1, // 默认选中"最新"
      tabs: [
        { name: '全部', count: 999 },
        { name: '最新', count: 999 },
        { name: '差评', count: 123 },
        { name: '中评', count: 123 },
        { name: '好评', count: 123 },
        { name: '有图', count: 123 }
      ],
      reviewList: [
        {
          avatar: '/static/cbd/shop/detail/test-img.png',
          username: '刘大脑袋',
          time: '2小时前',
          rating: 3.5,
          content: '紫光园口碑特别好，不管是彩品还是服务都是我心目中的天花板了。首先说说环境，免费只停车，交通方便，清真也吃这放心。紫光园口碑特别好，不管是彩品还是服务都是我心目中的天花板了。首先说说环境，免费只停车，交通方便。',
          images: [
            '/static/cbd/shop/detail/test-img.png',
            '/static/cbd/shop/detail/test-img.png',
            '/static/cbd/shop/detail/test-img.png',
            '/static/cbd/shop/detail/test-img.png',
            '/static/cbd/shop/detail/test-img.png',
            '/static/cbd/shop/detail/test-img.png',
          ]
        },
        {
          avatar: 'https://via.placeholder.com/80',
          username: '侯美妮',
          time: '2025-12-30 23:00:32',
          rating: 4,
          content: '紫光园口碑特别好，不管是彩品还是服务都是我心目中的天花板了。首先说说环境，免费只停车，交通方便。',
          images: []
        },
        {
          avatar: 'https://via.placeholder.com/80',
          username: '刘大脑袋',
          time: '2小时前',
          rating: 3.5,
          content: '紫光园口碑特别好，不管是彩品还是服务都是我心目中的天花板了。首先说说环境，免费只停车，交通方便，清真也吃这放心。紫光园口碑特别好，不管是彩品还是服务都是我心目中的天花板了。首先说说环境，免费只停车，交通方便。',
          images: [
            'https://via.placeholder.com/200x150'
          ]
        }
      ]
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    goSearch() {
      uni.navigateTo({
        url: "/pages/merchant-detail/merchant-search",
      });
    },
    switchTab(index) {
      this.activeTab = index
      // 这里可以添加切换标签后的数据加载逻辑
    }
  }
}
</script>

<style lang="scss" scoped>
.review-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  box-sizing: border-box;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 20rpx 10rpx 12rpx;
  background-color: #fff;

  .back-btn {
    margin-right: 10rpx;
  }

  .search-input-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    height: 70rpx;
    background-color: #fff;
    border: 4rpx solid #F7C54D;
    border-radius: 38rpx;
    padding: 4rpx 4rpx 4rpx 30rpx;

    .search-icon {
      margin-right: 10rpx;
    }

    .search-input {
      flex: 1;
      font-size: 26rpx;
      color: #333;
    }
  }

  .search-btn {
    width: 120rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    background: linear-gradient(135deg, #FFD700 0%, #FFB800 100%);
    border-radius: 30rpx;
    font-size: 26rpx;
    color: #333;
  }
}

.uni-scroll-view-content {
  // justify-content: space-around;
}

.filter-tabs {
  display: flex;
  white-space: nowrap;
  padding: 20rpx 20rpx;
  background-color: #fff;

  .tab-item {
    display: inline-flex;
    align-items: center;
    margin-right: 20rpx;
    position: relative;

    .tab-text {
      font-size: 26rpx;
      color: #666;

      &.active {
        .tab-text {
          font-weight: bold;
          color: #333;
        }

        &::after {
          content: '';
          position: absolute;
          bottom: 0rpx;
          left: 0;
          right: 0;
          width: 50rpx;
          height: 8rpx;
          border-radius: 4rpx;
          background: linear-gradient(to top, #FFD700 0%, #FFB800 100%);
        }
      }
    }

    .tab-count {
      margin-left: 8rpx;
      font-size: 24rpx;
      color: #999;
    }
  }
}

.review-list {
  height: calc(100vh - 300rpx);
  padding: 20rpx;
  box-sizing: border-box;

}
</style>
