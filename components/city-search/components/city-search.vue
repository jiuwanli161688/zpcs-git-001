<template>
  <view class="city-search-container" :class="{ 'h-full': isFocus }">
    <view class="search-header">
      <view class="back-btn" @click="onBack">
        <uni-icons type="back" size="25" color="#333"></uni-icons>
      </view>

      <view class="search-box">
        <view class="icon-wrap">
          <uni-icons type="search" size="18" color="#999"></uni-icons>
        </view>

        <input
          class="search-input"
          type="text"
          v-model="keyword"
          placeholder="搜索城市/区县"
          placeholder-style="color: #999"
          confirm-type="search"
          @confirm="onSearch"
          @focus="onFocus"
          @input="onInput"
        />

        <view class="action-btn" @click="onSearch">
          <text class="btn-text">搜索</text>
        </view>
      </view>
    </view>

    <slot name="main">
      <template v-if="isFocus">
        <!-- 历史搜索 -->
        <view class="history-search" v-if="!keyword && historyList.length > 0">
          <view class="history-header">
            <text class="history-title">历史搜索</text>
            <view class="delete-btn" @click="clearHistory">
              <image
                class="delete-icon"
                src="@/static/icon/delete.png"
                mode="aspectFit"
              ></image>
            </view>
          </view>
          <view class="history-list">
            <view
              class="history-item"
              v-for="(item, index) in historyList"
              :key="index"
              @click="selectHistory(item)"
            >
              <text class="history-text">{{ item }}</text>
            </view>
          </view>
        </view>
        <view v-else-if="keyword && !filteredCities.length" class="empty">
          <image
            class="empty-img"
            src="@/static/icon/empty.png"
            mode="aspectFit"
          ></image>
          <view class="tips">暂无数据</view>
        </view>
        <!-- 搜索联想 -->
        <view class="history-search" v-if="keyword && filteredCities.length">
          <view class="history-list">
            <view
              class="history-item"
              v-for="(item, index) in filteredCities"
              :key="index"
              @click="selectSelectCity(item)"
            >
              <text class="history-text">{{ item.name }}</text>
            </view>
          </view>
        </view>
      </template>
    </slot>
  </view>
</template>

<script>
export default {
  props: {
    filteredCities: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isGoSearch: false,
      cityInfo: {},
      keyword: "",
      isFocus: false,
      historyList: [], // 历史搜索列表
    };
  },
  created() {
    this.loadHistory();
  },
  methods: {
    onBack() {
      uni.navigateBack({
        fail: () => {
          uni.redirectTo({ url: "/pages/tabbar/home/index" });
        },
        success: () => {
          this.isFocus = false;
        },
      });
    },
    onSearch() {
      if (!this.keyword.trim()) {
        uni.showToast({
          title: "请输入搜索内容",
          icon: "none",
        });
        return;
      }
      // 保存到历史记录
      this.saveHistory(this.keyword.trim());
      this.isGoSearch = true;
      this.$emit("search", this.keyword);
      const timer = setTimeout(() => {
        this.isGoSearch = false;
      }, 2000)
    },
    onFocus() {
      this.isFocus = true;
      this.$emit("focus");
    },
    onInput(e) {
      this.keyword = e.detail.value;
      // 实时触发搜索，用于显示联想提示
      if (this.keyword.trim()) {
        this.$emit("input", this.keyword);
        // 触发搜索事件（用于实时搜索）
        this.$emit("search", this.keyword);
      } else {
        this.$emit("clear");
        // 清除搜索时也触发搜索事件，传递空值
        this.$emit("search", "");
      }
    },
    // 加载历史搜索
    loadHistory() {
      try {
        const history = uni.getStorageSync("citySearchHistory");
        if (history && Array.isArray(history)) {
          this.historyList = history;
        }
      } catch (e) {
        console.error("加载历史搜索失败", e);
      }
    },
    // 保存历史搜索
    saveHistory(keyword) {
      if (!keyword) return;
      this.historyList = this.historyList.filter((item) => item !== keyword);
      this.historyList.unshift(keyword);
      // 最多保留10个
      if (this.historyList.length > 10) {
        this.historyList = this.historyList.slice(0, 10);
      }
      uni.setStorageSync("citySearchHistory", this.historyList);
    },
    // 选择历史记录
    selectHistory(keyword) {
      this.keyword = keyword;
      this.$emit("search", keyword);
    },
    selectSelectCity(item) {
      this.cityInfo = item;
      this.keyword = item.name;
      this.$emit("select", item);
    },
    // 清除历史记录
    clearHistory() {
      uni.showModal({
        title: "提示",
        content: "确定要清除历史搜索记录吗？",
        success: (res) => {
          if (res.confirm) {
            this.historyList = [];
            uni.removeStorageSync("citySearchHistory");
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.city-search-container {
  background-color: #f5f5f5;
  z-index: 100;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #f5f5f5;
}

.back-btn {
  margin-right: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20rpx;
  height: 36rpx;
}

.search-box {
  flex: 1;
  height: 72rpx;
  background-color: #ffffff;
  border-radius: 36rpx;
  display: flex;
  align-items: center;
  padding-left: 24rpx;
  padding-right: 6rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.icon-wrap {
  display: flex;
  align-items: center;
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  height: 100%;
}

.action-btn {
  width: 120rpx;
  height: 60rpx;
  background-color: #fcc037;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10rpx;
}

.btn-text {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.history-search {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  background-color: #ffffff;
  border-radius: 20rpx;
  max-height: calc(100vh - 170rpx);
  overflow-y: auto;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
}

.history-title {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx;
}

.delete-icon {
  width: 28rpx;
  height: 30rpx;
}

.history-list {
  padding-bottom: 20rpx;
}

.history-item {
  display: flex;
  align-items: center;
  height: 80rpx;
  padding: 0 20rpx;
  position: relative;
}

.history-item::after {
  content: "";
  position: absolute;
  left: 20rpx;
  bottom: 0;
  width: calc(100% - 40rpx);
  height: 2rpx;
  background: #e5e5e5;
  transform: scaleY(0.5);
}

.history-item:last-child::after {
  display: none;
}

.history-text {
  font-size: 28rpx;
  color: #666;
}

.empty {
  width: calc(100vw - 40rpx);
  margin: 20rpx;
  padding: 60rpx 0;
  box-sizing: border-box;
  background: #fff;
  border-radius: 10rpx;
  .empty-img {
    display: block;
    width: 370rpx;
    height: 320rpx;
    margin: 0 auto;
    filter: opacity(0.8);
    mix-blend-mode: luminosity;
  }
  .tips {
    width: 100%;
    text-align: center;
    font-size: 24rpx;
    color: #666;
  }
}
</style>
