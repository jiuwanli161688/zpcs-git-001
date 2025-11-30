<template>
  <view class="image-uploader">
    <view class="images-grid">
      <!-- 已上传图片 -->
      <view 
        v-for="(image, index) in imageList" 
        :key="index"
        class="image-item"
      >
        <image 
          :src="image" 
          mode="aspectFill"
          class="image"
          @click="previewImage(index)"
        />
        <view class="delete-btn" @click="deleteImage(index)">
          <text class="delete-icon">×</text>
        </view>
      </view>
      
      <!-- 添加按钮 -->
      <view 
        v-if="imageList.length < maxCount"
        class="add-btn"
        @click="chooseImage"
      >
        <view class="camera-icon">
          <view class="camera-body"></view>
          <view class="camera-lens"></view>
        </view>
        <text class="add-text">添加照片</text>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  name: 'ImageUploader',
  
  props: {
    images: {
      type: Array,
      default: () => []
    },
    maxCount: {
      type: Number,
      default: 9
    }
  },
  
  data() {
    return {
      imageList: [...this.images]
    }
  },
  
  watch: {
    images(val) {
      this.imageList = [...val]
    }
  },
  
  methods: {
    chooseImage() {
      const count = this.maxCount - this.imageList.length
      
      uni.chooseImage({
        count,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.imageList.push(...res.tempFilePaths)
          this.updateImages()
        }
      })
    },
    
    deleteImage(index) {
      uni.showModal({
        title: '提示',
        content: '确定删除这张照片吗？',
        success: (res) => {
          if (res.confirm) {
            this.imageList.splice(index, 1)
            this.updateImages()
          }
        }
      })
    },
    
    previewImage(index) {
      uni.previewImage({
        urls: this.imageList,
        current: index
      })
    },
    
    updateImages() {
      this.$emit('update:images', this.imageList)
      this.$emit('change', this.imageList)
    }
  }
}
</script>

<style scoped>
.image-uploader {
  background-color: #fff;
  padding: 20rpx;
  border-bottom-right-radius: 20rpx;
  border-bottom-left-radius: 20rpx;
}

.images-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.image-item {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  overflow: hidden;
  position: relative;
}

.image {
  width: 100%;
  height: 100%;
}

.delete-btn {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 44rpx;
  height: 44rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-icon {
  font-size: 40rpx;
  color: #fff;
  line-height: 1;
  font-weight: 300;
}

.add-btn {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #ddd;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.camera-icon {
  width: 60rpx;
  height: 50rpx;
  position: relative;
}

.camera-body {
  width: 60rpx;
  height: 44rpx;
  border: 4rpx solid #ccc;
  border-radius: 8rpx;
  position: absolute;
  bottom: 0;
}

.camera-body::before {
  content: '';
  width: 20rpx;
  height: 8rpx;
  background-color: #ccc;
  border-radius: 4rpx 4rpx 0 0;
  position: absolute;
  top: -8rpx;
  left: 50%;
  transform: translateX(-50%);
}

.camera-lens {
  width: 24rpx;
  height: 24rpx;
  border: 4rpx solid #ccc;
  border-radius: 50%;
  position: absolute;
  bottom: 10rpx;
  left: 50%;
  transform: translateX(-50%);
}

.add-text {
  font-size: 24rpx;
  color: #999;
}
</style>
