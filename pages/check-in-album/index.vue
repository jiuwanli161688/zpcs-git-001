<template>
  <view class="album-page">
    <!-- 照片网格 -->
    <view class="photo-grid">
      <view
        v-for="(photo, index) in photoList"
        :key="photo.id"
        class="photo-item"
        @click="previewPhoto(index)"
      >
        <image
          class="photo-image"
          :src="photo.imageUrl"
          mode="aspectFill"
        />
      </view>
    </view>

    <!-- 加载更多 -->
    <view v-if="hasMore" class="load-more" @click="loadMore">
      <text>{{ loading ? '加载中...' : '加载更多' }}</text>
    </view>

    <!-- 空状态 -->
    <view v-if="!loading && photoList.length === 0" class="empty-state">
      <uni-icons class="empty-icon" type="camera" size="30" color="#999999"></uni-icons>
      <text class="empty-text">暂无打卡照片</text>
    </view>
  </view>
</template>

<script>
import { getApprovedAlbum } from "@/api/shop/list/detail.js";

export default {
  components: {
  },
  data() {
    return {
      merchantId: '',
      photoList: [],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      hasMore: true,
    }
  },
  
  onLoad(options) {
    if (options.merchantId) {
      this.merchantId = options.merchantId
    }
    this.loadPhotos()
  },

  onPullDownRefresh() {
    this.pageNumber = 1;
    this.photoList = [];
    this.hasMore = true;
    this.loadPhotos().then(() => {
      uni.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.loadMore();
    }
  },
  
  methods: {
    goBack() {
      uni.navigateBack()
    },
    
    async loadPhotos() {
      if (!this.merchantId || this.loading) return;
      
      this.loading = true;
      try {
        const res = await getApprovedAlbum({
          storeId: this.merchantId,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
        });
        console.log('加载', res)
        if (res.data.success && res.data.result) {
          const records = res.data.result.records || [];
          if (this.pageNumber === 1) {
            this.photoList = records;
          } else {
            this.photoList = [...this.photoList, ...records];
          }
          this.total = res.data.result.total || 0;
          this.hasMore = this.photoList.length < this.total;
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
        this.loadPhotos();
      }
    },
    
    previewPhoto(index) {
      const urls = this.photoList.map(photo => photo.imageUrl)
      uni.previewImage({
        urls: urls,
        current: index
      })
    }
  }
}
</script>

<style scoped>
.album-page {
  min-height: 100vh;
  background: #fff;
}

/* 照片网格 */
.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 20rpx;
}

.photo-item {
  width: 100%;
  height: 348rpx;
  border-radius: 20rpx;
  overflow: hidden;
  background: #f5f5f5;
}

.photo-image {
  width: 100%;
  height: 100%;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
}

.empty-icon {
  font-size: 120rpx;
  opacity: 0.3;
  margin-bottom: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

/* 新增加载更多样式 */
.load-more {
  text-align: center;
  padding: 30rpx;
  color: #999;
  font-size: 26rpx;
}
</style>
