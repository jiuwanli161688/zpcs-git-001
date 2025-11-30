<template>
  <view class="region-zone">
    <!-- 空状态组件 -->
    <view v-if="!loading && regionList.length === 0" class="empty-container">
      <EmptyBox mode="common" text="暂无地区数据" />
    </view>

    <!-- 地区列表 -->
    <view v-else class="region-list">
      <view
        class="region-item"
        v-for="(item, index) in regionList"
        :key="index"
        :id="`region-${item.provincePinyin}`"
        @click="handleRegionClick(item)"
      >
        <image
          class="region-image"
          :src="item.imageUrl"
          mode="aspectFit"
          :alt="item.name"
        />
      </view>

      <!-- 加载更多组件 -->
      <uni-load-more
        :status="loadingStatus"
        :content-text="{
          contentdown: '上拉显示更多',
          contentrefresh: '正在加载...',
          contentnomore: '没有更多数据了'
        }"
        v-if="regionList.length > 0"
      />
    </view>

    <!-- 右侧字母索引 - 只在有数据时显示 -->
    <view v-if="regionList.length > 0" class="letter-index">
      <view
        class="letter-item"
        v-for="letter in letters"
        :key="letter"
        @click="scrollToLetter(letter)"
      >
        {{ letter }}
      </view>
    </view>
  </view>
</template>

<script>
import { getProvincePage } from '@/api/region'
import { handleNavigation, JUMP_TYPE } from '@/utils/navigation.js'
import EmptyBox from '@/components/Hina/EmptyBox.vue'
export default {
  name: 'RegionZone',
  components: {
    EmptyBox
  },
  data() {
    return {
      letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      regionList: [],
      // 分页相关数据
      currentPage: 1,
      pageSize: 100,
      hasMore: true,
      loading: false,
      loadingStatus: 'more' // more, loading, noMore
    }
  },
  onLoad() {
    // 页面加载时获取第一页数据
    this.loadRegionData(true)
  },
  onReachBottom() {
    // 触底加载更多
    if (this.hasMore && !this.loading) {
      this.loadMore()
    }
  },

  methods: {
    // 加载地区数据
    async loadRegionData(isRefresh = false) {
      if (this.loading) return
      this.loading = true
      this.loadingStatus = 'loading'
      try {
          const params = {
            pageNumber: this.currentPage,
            pageSize: this.pageSize
          }
        const response = await getProvincePage(params)
        const records = response.data.result.records || []
        const total = response.data.result.total || 0
        const current = response.data.result.current || 1
        const size = response.data.result.size || this.pageSize

        if (isRefresh) {
          this.regionList = records
          this.currentPage = 1
        } else {
          this.regionList.push(...records)
        }

        // 判断是否还有更多数据
        const hasMoreData = this.regionList.length < total
        this.hasMore = hasMoreData
        this.loadingStatus = hasMoreData ? 'more' : 'noMore'

      } catch (error) {
        uni.showToast({
            icon: "none",
            title: error.data?.message || '加载失败',
            duration: 2000,
          });
        this.loadingStatus = 'more'
      } finally {
        this.loading = false
      }
    },

    // 触底加载更多
    loadMore() {
      if (this.hasMore && !this.loading) {
        this.currentPage++
        this.loadRegionData(false)
      }
    },
    handleRegionClick(item) {
      // 使用公共导航方法跳转
      handleNavigation(item)
    },

    scrollToLetter(letter) {
      // 查找对应字母开头的第一个地区
      const targetRegion = this.regionList.find(item =>
        item.provincePinyin.toUpperCase().startsWith(letter)
      )

      if (targetRegion) {
        // 滚动到对应元素
        const query = uni.createSelectorQuery().in(this)
        query.select(`#region-${targetRegion.provincePinyin}`).boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec((res) => {
          if (res[0]) {
            uni.pageScrollTo({
              scrollTop: res[1].scrollTop + res[0].top, // 减去100rpx的偏移量
              duration: 300
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.region-zone {
  padding: 20rpx 0;
  background-color: #ffffff;
  min-height: calc(100vh - var(--window-top));
  position: relative;
}

.region-list {
  display: flex;
  flex-direction: column;
}

.region-item {
  position: relative;
  width: 670rpx;
  height: 282rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  margin: 0 auto 20rpx auto;

  &:active {
    transform: scale(0.98);
  }
}

.region-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.region-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  text-align: center;
  padding: 30rpx 20rpx 20rpx;
  font-size: 32rpx;
  font-weight: 600;
}

/* 右侧字母索引样式 */
.letter-index {
  position: fixed;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 30rpx;
  padding: 10rpx 5rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.letter-item {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  color: #333;
  font-weight: 500;
  border-radius: 50%;
  margin: 2rpx 0;
  transition: all 0.2s ease;

  &:active {
    background-color: #007aff;
    color: white;
    transform: scale(1.1);
  }
}

/* 空状态样式 */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 40rpx;
}


</style>
