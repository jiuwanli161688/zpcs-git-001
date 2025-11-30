<template>
  <view class="review-page">
    <!-- 导航栏 -->
    <nav-bar :title="shopName" @back="goBack" @info="showTips = true" />

    <!-- 星级评分 -->
    <star-rating
      :value.sync="rating"
      :labels="ratingLabels"
      class="rating-section"
    />

    <!-- 文字评价 -->
    <text-input
      v-model="reviewText"
      :maxlength="maxLength"
      :placeholder="placeholder"
      class="text-section"
    />

    <!-- 图片上传 -->
    <image-uploader
      :images.sync="images"
      :max-count="maxImageCount"
      class="image-section"
    />

    <!-- 底部提交按钮 -->
    <view class="submit-wrapper">
      <button class="submit-btn" @click="handleSubmit">发表评价</button>
    </view>

    <!-- 规则提示弹窗 -->
    <tips-modal :visible.sync="showTips" />
  </view>
</template>

<script>
import NavBar from "./components/nav-bar.vue";
import StarRating from "./components/star-rating.vue";
import TextInput from "./components/text-input.vue";
import ImageUploader from "./components/image-uploader.vue";
import TipsModal from "./components/tips-modal.vue";

export default {
  name: "ReviewPage",

  components: {
    NavBar,
    StarRating,
    TextInput,
    ImageUploader,
    TipsModal,
  },

  data() {
    return {
      shopName: "拜勒福·健康生活养生馆",
      rating: 3.3,
      reviewText: "",
      images: [],
      showTips: false,

      maxLength: 100,
      maxImageCount: 9,
      placeholder: "请输入您对本次消费的体验如何？",

      ratingLabels: [
        { value: 1, label: "很糟糕" },
        { value: 2, label: "比较差" },
        { value: 3, label: "一般般" },
        { value: 4, label: "还可以" },
        { value: 5, label: "很满意" },
      ],
    };
  },

  methods: {
    goBack() {
      uni.navigateBack();
    },

    handleSubmit() {
      if (!this.validateForm()) {
        return;
      }
      this.submitReview();
    },

    validateForm() {
      if (this.rating === 0) {
        uni.showToast({
          title: "请选择评分",
          icon: "none",
        });
        return false;
      }

      if (!this.reviewText.trim()) {
        uni.showToast({
          title: "请输入评价内容",
          icon: "none",
        });
        return false;
      }

      return true;
    },

    async submitReview() {
      uni.showLoading({ title: "提交中..." });

      try {
        // 上传图片
        const imageUrls = await this.uploadImages();

        // 提交评价
        const result = await this.submitData({
          rating: this.rating,
          content: this.reviewText,
          images: imageUrls,
        });

        uni.hideLoading();
        uni.showToast({
          title: "评价成功",
          icon: "success",
        });

        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: error.message || "提交失败",
          icon: "none",
        });
      }
    },

    async uploadImages() {
      if (this.images.length === 0) return [];

      const uploadPromises = this.images.map((image) => {
        return new Promise((resolve, reject) => {
          uni.uploadFile({
            url: "YOUR_UPLOAD_API",
            filePath: image,
            name: "file",
            success: (res) => {
              const data = JSON.parse(res.data);
              resolve(data.url);
            },
            fail: reject,
          });
        });
      });

      return Promise.all(uploadPromises);
    },

    async submitData(data) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: "YOUR_REVIEW_API",
          method: "POST",
          data,
          success: (res) => {
            if (res.data.code === 200) {
              resolve(res.data);
            } else {
              reject(new Error(res.data.message));
            }
          },
          fail: reject,
        });
      });
    },
  },
};
</script>

<style scoped>
.review-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 0 20rpx;
  padding-bottom: 100rpx;
}

.rating-section {
  margin-top: 20rpx;
}

.submit-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.submit-btn {
  width: 100%;
  height: 80rpx;
  background: linear-gradient(90deg, #ff4444 0%, #ff2222 100%);
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: 500;
  color: #ffffff;
  border: none;
  line-height: 80rpx;
}

.submit-btn::after {
  border: none;
}
</style>
