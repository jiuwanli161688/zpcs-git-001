<template>
  <view class="check-in-page">
    <!-- 顶部返回按钮 -->
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="back-btn" @click="goBack">
        <uni-icons class="" type="left" size="24" color="#333333"></uni-icons>
      </view>
    </view>
    <canvas
      canvas-id="watermarkCanvas"
      class="watermark-canvas"
      :style="{
        width: canvasWidth + 'px',
        height: canvasHeight + 'px',
        position: 'fixed',
        left: '-9999px',
      }"
    ></canvas>
    <!-- 背景图 -->
    <image
      src="/static/cbd/shop/detail/header-bg.png"
      class="top-bg-image"
      mode="aspectFill"
    />

    <!-- 打卡成功标题 -->
    <view class="title-section">
      <text class="title-text">我今年第 </text>
      <text class="title-count">{{ checkInCount }}</text>
      <text class="title-text">次</text>
      <view class="title-line">
        <text class="title-text">打卡点评中品维度商圈！</text>
      </view>
    </view>

    <!-- 评分区域 -->
    <view class="rating-section">
      <view class="star-list">
        <!-- <view v-for="(item, index) in 5" :key="item" class="star-item">
          <view class="star-icon" :class="index <= rating ? 'star-active' : ''">
            <uni-icons
              type="star-filled"
              size="80rpx"
              :color="index <= rating ? '#ff5757' : '#e0e0e0'"
            ></uni-icons>
          </view>
          <text class="star-label">{{ starLabels[index] }}</text>
        </view> -->
      </view>
      <user-rating :current-rating="rating"> </user-rating>
    </view>

    <!-- 打卡照片卡片 -->
    <view class="photo-card">
      <image
        class="card-image"
        :src="photoUrl || defaultPhoto"
        mode="aspectFill"
      />
      <view v-if="!photoUrl" class="card-overlay">
        <view class="date-info">
          <text class="date">{{ currentDate }}</text>
          <view>
            <view class="weekday">{{ currentWeekday }}</view>
            <view class="merchant-name">{{ merchantName }}</view>
          </view>
        </view>
      </view>
      <!-- 拍照按钮 - 未拍照时显示 -->
      <view v-if="!photoUrl" class="photo-action" @click="takePhoto">
        <view class="camera-icon">
          <uni-icons
            class="camera-text-icon"
            type="camera"
            size="30"
            color="#999999"
          ></uni-icons>
        </view>
        <text class="photo-text">轻点拍照</text>
      </view>

      <!-- 操作按钮 - 拍照后显示 -->
      <view v-else class="action-buttons">
        <view class="btn btn-outline" @click="viewRecords"> 查看打卡记录 </view>
        <view class="btn btn-primary" @click="shareCheckIn"> 分享打卡 </view>
      </view>
    </view>
  </view>
</template>

<script>
import UserRating from "./../merchant-detail/components/user-rating.vue";

export default {
  components: {
    UserRating,
  },
  data() {
    return {
      statusBarHeight: 0,
      merchantId: "",
      checkInCount: 8,
      rating: 3,
      merchantName: "拜勒福·健康生活养生馆",
      photoUrl: "",
      defaultPhoto: "/static/cbd/shop/detail/checkin-def.png",
      starLabels: ["很糟糕", "比较差", "一般般", "还可以", "很满意"],
      currentDate: "",
      currentWeekday: "",

      // 拍照打卡
      originalImage: "",
      canvasWidth: 300,
      canvasHeight: 300,
      locationInfo: "获取中...",
      uploading: false,
      uploadProgress: 0,
      uploadResult: "",
    };
  },
  created() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
  },
  onLoad(options) {
    if (options.merchantId) {
      this.merchantId = options.merchantId;
    }
    if (options.merchantName) {
      this.merchantName = decodeURIComponent(options.merchantName);
    }
    if (options.checkInCount) {
      this.checkInCount = parseInt(options.checkInCount);
    }

    this.initDateTime();
  },

  methods: {
    // 初始化日期时间
    initDateTime() {
      const date = new Date();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      this.currentDate = `${month}/${day}`;

      const weekdays = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      this.currentWeekday = weekdays[date.getDay()];
    },

    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    // 查看打卡记录
    viewRecords() {
      uni.navigateTo({
        url: `/pages/check-in-album/index?merchantId=${this.merchantId}`,
      });
    },

    // 分享打卡
    shareCheckIn() {
      uni.share({
        provider: "weixin",
        type: 0, // 0 是图文
        title: "我在点评中品维度商圈打卡啦！",
        summary: "快来看看我在这里的打卡点评吧～",
        imageUrl: this.photoUrl || this.defaultPhoto,
        miniProgram: {
          id: "", // APP的微信小程序ID，若有小程序跳转需求可填，否则可省略
          path: "", // 跳转的小程序页面路径
        },
        success: () => {
          uni.showToast({
            title: "分享成功",
            icon: "success",
          });
        },
        fail: (err) => {
          uni.showToast({
            title: "分享失败",
            icon: "none",
          });
          console.error("分享失败", err);
        },
      });
    },
    // 选择图片
    takePhoto() {
      uni.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.originalImage = res.tempFilePaths[0];
          this.addWatermark(res.tempFilePaths[0]);
        },
      });
    },

    // 添加水印
    addWatermark(imagePath) {
      uni.showLoading({ title: "处理中..." });

      // 获取图片信息
      uni.getImageInfo({
        src: imagePath,
        success: (imageInfo) => {
          console.log("图片中", imageInfo);
          this.canvasWidth = imageInfo.width;
          this.canvasHeight = imageInfo.height;

          // 等待canvas尺寸更新
          this.$nextTick(() => {
            setTimeout(() => {
              this.drawWatermark(imagePath, imageInfo.width, imageInfo.height);
            }, 100);
          });
        },
        fail: () => {
          uni.hideLoading();
          uni.showToast({ title: "获取图片信息失败", icon: "none" });
        },
      });
    },

    // 绘制水印
    drawWatermark(imagePath, width, height) {
      console.log("drawWatermark绘制图", imagePath, width, height);

      const ctx = uni.createCanvasContext("watermarkCanvas", this);

      // 绘制原图
      ctx.drawImage(imagePath, 0, 0, width, height);

      // 水印配置
      const padding = width * 0.03; // 边距
      const fontSize = Math.max(width * 0.04, 24); // 字体大小
      const lineHeight = fontSize * 1.4; // 行高

      // 获取水印文字
      const watermarkLines = this.getWatermarkText();

      // 计算水印区域
      const watermarkHeight = lineHeight * watermarkLines.length + padding * 2;
      const watermarkY = height - watermarkHeight - padding;

      // 绘制水印文字（白色带阴影，确保可见性）
      ctx.setFillStyle("#FFFFFF");
      ctx.setFontSize(fontSize);
      ctx.setShadow(2, 2, 4, "rgba(0,0,0,0.5)");

      watermarkLines.forEach((line, index) => {
        const textY = watermarkY + padding + fontSize + lineHeight * index;
        ctx.fillText(line, padding * 2, textY);
      });

      // 绘制完成后导出图片
      ctx.draw(false, () => {
        setTimeout(() => {
          uni.canvasToTempFilePath(
            {
              canvasId: "watermarkCanvas",
              width: width,
              height: height,
              destWidth: width,
              destHeight: height,
              fileType: "jpg",
              quality: 0.9,
              success: (res) => {
                uni.hideLoading();
                // 本地图片，上传服务器后替换
                this.photoUrl = res.tempFilePath;
              },
              fail: (err) => {
                console.error("导出失败:", err);
                uni.hideLoading();
                uni.showToast({ title: "水印添加失败", icon: "none" });
              },
            },
            this
          );
        }, 300);
      });
    },

    // 获取水印文字内容
    getWatermarkText() {
      const now = new Date();

      // 第一行：日期 MM/DD
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const dateLine = `${month}/${day}`;

      // 第二行：星期几
      const weekDays = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      const weekLine = weekDays[now.getDay()];

      // 第三行：位置信息
      const locationLine = this.locationInfo;

      return [dateLine, weekLine, locationLine];
    },
  },

  onShareAppMessage() {
    return {
      title: `我在${this.merchantName}打卡啦！这是我今年第${this.checkInCount}次打卡`,
      path: `/pages/merchant-detail/index?id=${this.merchantId}`,
      imageUrl: this.photoUrl || this.defaultPhoto,
    };
  },

  onShareTimeline() {
    return {
      title: `我在${this.merchantName}打卡啦！`,
      query: `id=${this.merchantId}`,
      imageUrl: this.photoUrl || this.defaultPhoto,
    };
  },
};
</script>

<style scoped>
.check-in-page {
  position: relative;
  height: 100vh;
  background: #f5f5f5;
  padding: 0 20rpx;
}

.header {
  padding: 20rpx 0;
  margin-left: -20rpx;
}
.top-bg-image {
  position: fixed;
  top: -10rpx;
  right: 0;
  width: 350rpx;
  height: 350rpx;
  z-index: 0;
}
.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 44rpx;
  color: #333;
  font-weight: 300;
}

/* 标题区域 */
.title-section {
  margin: 70rpx 0 30rpx 20rpx;
}

.title-text {
  font-size: 48rpx;
  color: #333;
  font-weight: 600;
  line-height: 68rpx;
  font-style: italic;
}

.title-count {
  font-size: 52rpx;
  color: #ff4444;
  font-weight: 700;
  margin: 0 8rpx;
}

.title-line {
  display: block;
}

/* 评分区域 */
.rating-section {
  margin-bottom: 20rpx;
  margin-top: -20rpx;
}

.star-list {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.star-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.star-icon {
  font-size: 68rpx;
  color: #e0e0e0;
  margin-bottom: 12rpx;
  transition: color 0.2s;
}

.star-icon.active {
  color: #ff6347;
}

.star-label {
  font-size: 24rpx;
  color: #999;
}

/* 照片卡片 */
.photo-card {
  width: calc(100vw - 40rpx);
  border-radius: 20rpx;
  overflow: hidden;
  position: relative;
  margin-bottom: 0rpx;
  background: #fff;
}

.card-image {
  display: block;
  width: 658rpx;
  height: 658rpx;
  margin: 20rpx auto;
  border-radius: 20rpx;
}

.card-overlay {
  position: absolute;
  bottom: 136rpx;
  left: 20rpx;
  right: 20rpx;
  padding: 0 20rpx;
}

.date-info {
  display: flex;
  align-items: flex-end;
}

.date {
  font-size: 80rpx;
  color: #fff;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 8rpx;
  margin-right: 20rpx;
}

.weekday {
  font-size: 24rpx;
  color: #fff;
}

.merchant-name {
  font-size: 24rpx;
  margin-bottom: 18rpx;
  color: #fff;
}

/* 拍照按钮 */
.photo-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 16rpx;
}

.camera-text-icon {
  font-size: 80rpx;
  opacity: 0.3;
}

.photo-text {
  font-size: 24rpx;
  color: #999;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24rpx;
  padding: 6rpx 0 26rpx;
}

.btn {
  width: 320rpx;
  height: 78rpx;
  line-height: 80rpx;
  padding: 6rpx 0;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  box-sizing: border-box;
}

.btn-outline {
  border: 2rpx solid #ff3b30;
  color: #ff3b30;
  background: #fff;
}

.btn-primary {
  background: #ff3b30;
  color: #fff;
}
</style>
