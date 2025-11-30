<template>
  <view class="album-page">
    <!-- 照片网格 -->
    <view class="photo-grid">
      <view
        v-for="(photo, index) in photoList"
        :key="index"
        class="photo-item"
        @click="previewPhoto(index)"
      >
        <image
          class="photo-image"
          :src="photo.url"
          mode="aspectFill"
        />
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="photoList.length === 0" class="empty-state">
      <uni-icons class="empty-icon" type="camera" size="30" color="#999999"></uni-icons>
      <text class="empty-text">暂无打卡照片</text>
    </view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      merchantId: '',
      photoList: []
    }
  },
  
  onLoad(options) {
    if (options.merchantId) {
      this.merchantId = options.merchantId
    }
    this.loadPhotos()
  },
  
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack()
    },
    
    // 加载照片列表
    loadPhotos() {
      // 模拟数据，实际应从后端接口获取
      this.photoList = [
        { url: '/static/logo.png' },
        { url: '/static/images/sample2.jpg' },
        { url: '/static/images/sample3.jpg' },
        { url: '/static/images/sample4.jpg' },
        { url: '/static/images/sample5.jpg' },
        { url: '/static/images/sample6.jpg' },
        { url: '/static/images/sample7.jpg' }
      ]
      
      // TODO: 实际应调用后端接口
     
    },
    
    // 预览照片
    previewPhoto(index) {
      const urls = this.photoList.map(photo => photo.url)
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
</style>
