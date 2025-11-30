<template>
  <view class="search-page">
    <!-- 搜索栏 -->
    <view class="search-header">
      <view class="back-btn" @click="goBack">
        <uni-icons type="left" size="20" color="#333"></uni-icons>
      </view>
      <view class="search-box">
        <uni-icons type="search" size="18" color="#999"></uni-icons>
        <input
          class="search-input"
          v-model="keyword"
          placeholder="奈雪的茶"
          placeholder-class="placeholder"
          confirm-type="search"
          @confirm="handleSearch"
        />
        <view class="search-btn" @click="handleSearch">搜索</view>
      </view>
    </view>

    <view class="bottom-content">
      <!-- 历史搜索 -->
      <view class="section" v-if="historyList.length">
        <view class="section-header">
          <text class="section-title">历史搜索</text>
          <uni-icons
            type="trash"
            size="20"
            color="#999"
            @click="clearHistory"
          ></uni-icons>
        </view>
        <view class="tag-list">
          <view
            class="tag-item"
            v-for="(item, index) in historyList"
            :key="index"
            @click="selectKeyword(item)"
          >
            {{ item }}
          </view>
        </view>
      </view>

      <!-- 猜你想搜 -->
      <view class="section suggest">
        <view class="section-header">
          <text class="section-title">猜你想搜</text>
        </view>
        <view class="suggest-list">
          <view
            class="suggest-item"
            v-for="(item, index) in suggestList"
            :key="index"
            @click="selectKeyword(item)"
          >
            {{ item }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      keyword: "",
      historyList: [
        "清真拉面",
        "北京紫光园",
        "烙馍村",
        "日本料理",
        "火锅",
        "兰州牛肉面",
        "铜锅涮",
      ],
      suggestList: [
        "茶百道",
        "霸王茶姬",
        "沪上阿姨",
        "CoCo奶茶",
        "星巴克",
        "Costa",
        "库迪咖啡",
        "瑞幸咖啡",
      ],
    };
  },
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    // 执行搜索
    handleSearch() {
      if (!this.keyword.trim()) return;
      // 添加到历史记录
      const index = this.historyList.indexOf(this.keyword);
      if (index > -1) {
        this.historyList.splice(index, 1);
      }
      this.historyList.unshift(this.keyword);
      // 保存历史记录
      uni.setStorageSync("searchHistory", this.historyList);
      // 跳转搜索结果页
      uni.navigateTo({
        url: `/pages/search/result?keyword=${this.keyword}`,
      });
    },
    // 选择关键词
    selectKeyword(keyword) {
      this.keyword = keyword;
      this.handleSearch();
    },
    // 清空历史
    clearHistory() {
      uni.showModal({
        title: "提示",
        content: "确定清空历史搜索记录？",
        success: (res) => {
          if (res.confirm) {
            this.historyList = [];
            uni.removeStorageSync("searchHistory");
          }
        },
      });
    },
  },
  onLoad() {
    // 读取历史记录
    const history = uni.getStorageSync("searchHistory");
    if (history) {
      this.historyList = history;
    }
  },
};
</script>

<style lang="scss" scoped>
.search-page {
  height: 100vh;
  background-color: #f9f9f9;
  overflow: hidden;
}
.bottom-content {
  height: 100vh;
  background: #fff;
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
}

// 搜索栏
.search-header {
  display: flex;
  align-items: center;
  padding: 20rpx 0;

  .back-btn {
    padding: 10rpx;
    margin-right: 10rpx;
  }

  .search-box {
    flex: 1;
    display: flex;
    align-items: center;
    height: 72rpx;
    background-color: #fff;
    border-radius: 36rpx;
    padding: 0 10rpx 0 20rpx;
    margin-right: 20rpx;

    .search-input {
      flex: 1;
      height: 100%;
      margin-left: 16rpx;
      font-size: 28rpx;
    }

    .placeholder {
      color: #999;
    }

    .search-btn {
      width: 116rpx;
      height: 56rpx;
      line-height: 56rpx;
      text-align: center;
      background-color: #F7C54D;
      border-radius: 28rpx;
      font-size: 28rpx;
      color: #333;
    }
  }
}

// 区块通用样式
.section {
  padding: 20rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
  }
}

// 历史搜索标签
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;

  .tag-item {
    padding: 12rpx 30rpx;
    background-color: #F9F9F9;
    border-radius: 32rpx;
    font-size: 24rpx;
    color: #666666;
  }
}

.suggest {
  margin-top: 30rpx;
}
// 猜你想搜列表
.suggest-list {
  display: flex;
  flex-wrap: wrap;

  .suggest-item {
    width: 50%;
    padding: 24rpx 0;
    font-size: 24rpx;
    color: #333;
  }
}
</style>
