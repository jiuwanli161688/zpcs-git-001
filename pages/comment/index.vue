<template>
  <view class="review-page">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <view class="back-btn" @tap="goBack">
        <uni-icons type="back" size="20" color="#333"></uni-icons>
      </view>
      <view class="search-input-wrapper" @tap="goSearch">
        <uni-icons
          type="search"
          size="20"
          color="#999"
          class="search-icon"
        ></uni-icons>
        <input
          class="search-input"
          placeholder="此处跳转商家搜索"
          placeholder-style="color: #999"
        />
        <view class="search-btn">搜索</view>
      </view>
    </view>

    <!-- 筛选标签 -->
    <scroll-view scroll-x>
      <view class="filter-tabs">
        <view
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab-item"
          @tap="switchTab(index)"
        >
          <text class="tab-text" :class="{ active: activeTab === index }">{{
            tab.name
          }}</text>
          <text v-if="tab.count" class="tab-count">{{ tab.count }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 评价列表 -->
    <scroll-view class="review-list" scroll-y @scrolltolower="loadMore">
      <review-item
        v-for="(review, index) in reviewList"
        :key="review.id || index"
        :review="review"
      ></review-item>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-text">加载中...</view>
      <view v-else-if="!hasMore && reviewList.length > 0" class="loading-text"
        >没有更多了</view
      >
      <!-- <view v-else-if="reviewList.length === 0" class="empty-text">暂无评价</view> -->
      <view v-else-if="reviewList.length === 0" class="empty-state">
        <image
          src="/static/icon/empty.png"
          class="empty-image"
          mode="aspectFit"
        />
        <text class="empty-text">暂无数据</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import ReviewItem from "./components/review-item.vue";
import { getEvaluation } from "@/api/shop/list/detail.js";

export default {
  components: {
    ReviewItem,
  },
  data() {
    return {
      storeId: "",
      activeTab: 0,
      tabs: [
        { name: "全部", count: 0, type: "" },
        { name: "最新", count: 0, type: "latest" },
        { name: "差评", count: 0, type: "bad" },
        { name: "中评", count: 0, type: "medium" },
        { name: "好评", count: 0, type: "good" },
        { name: "有图", count: 0, type: "hasImage" },
      ],
      reviewList: [],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      hasMore: true,
    };
  },

  onLoad(options) {
    if (options.id) {
      this.storeId = options.id;
    }
    this.loadReviews();
  },

  methods: {
    goBack() {
      uni.navigateBack();
    },
    goSearch() {
      uni.navigateTo({
        url: "/pages/merchant-detail/merchant-search",
      });
    },
    switchTab(index) {
      this.activeTab = index;
      this.pageNumber = 1;
      this.reviewList = [];
      this.hasMore = true;
      this.loadReviews();
    },

    async loadReviews() {
      if (!this.storeId || this.loading) return;

      this.loading = true;
      try {
        const params = {
          storeId: this.storeId,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
        };

        // 根据 tab 类型添加筛选条件
        const tabType = this.tabs[this.activeTab].type;
        if (tabType === "hasImage") {
          params.haveImage = true;
        } else if (tabType === "bad") {
          params.gradeType = "bad"; // 1-2分
        } else if (tabType === "medium") {
          params.gradeType = "medium"; // 3分
        } else if (tabType === "good") {
          params.gradeType = "good"; // 4-5分
        } else if (tabType === "latest") {
          params.orderBy = "createTime";
        }

        const res = await getEvaluation(params);

        if (res.data.success && res.data.result) {
          const records = (res.data.result.records || []).map((item) => ({
            id: item.id,
            avatar:
              item.memberProfile || "/static/cbd/shop/detail/test-img.png",
            username: item.memberName || "匿名",
            time: item.createTime || "",
            rating: Number(item.grade) || 0,
            content: item.content || "",
            images: item.images ? item.images.split(",") : [],
          }));

          if (this.pageNumber === 1) {
            this.reviewList = records;
            // 更新全部标签数量
            this.tabs[0].count = res.data.result.total || 0;
          } else {
            this.reviewList = [...this.reviewList, ...records];
          }

          this.total = res.data.result.total || 0;
          this.hasMore = this.reviewList.length < this.total;
        }
      } catch (error) {
        uni.showToast({ title: "加载失败", icon: "none" });
      } finally {
        this.loading = false;
      }
    },

    loadMore() {
      if (this.hasMore && !this.loading) {
        this.pageNumber++;
        this.loadReviews();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.review-page {
  min-height: 100vh;
  background-color: #f9f9f9;
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
    border: 4rpx solid #f7c54d;
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
    background: linear-gradient(135deg, #ffd700 0%, #ffb800 100%);
    border-radius: 30rpx;
    font-size: 26rpx;
    color: #333;
  }
}

.filter-tabs {
  display: flex;
  white-space: nowrap;
  padding: 20rpx 20rpx;
  background-color: #fff;
  justify-content: space-around;
  .tab-item {
    display: inline-flex;
    align-items: center;
    margin-right: 20rpx;
    position: relative;

    .tab-text {
      font-size: 26rpx;
      color: #666;

      &.active {
        font-weight: bold;
        color: #333;

        &::after {
          content: "";
          position: absolute;
          bottom: 0rpx;
          left: 0;
          right: 0;
          width: 50rpx;
          height: 8rpx;
          border-radius: 4rpx;
          background: linear-gradient(to top, #ffd700 0%, #ffb800 100%);
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

.loading-text,
.empty-text {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 26rpx;
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
</style>
