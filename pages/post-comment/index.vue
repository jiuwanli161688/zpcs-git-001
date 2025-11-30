<template>
  <view class="review-page">
    <!-- 导航栏 -->
    <nav-bar :title="shopName" @back="goBack" @info="showTips = true" />

    <!-- 星级评分 -->
    <star-rating
      :rating="rating"
      :labels="ratingLabels"
      @rate="val => rating = val"
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
import { createEvaluation, isRecentDays } from "@/api/shop/list/detail.js";

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
      storeId: "",
      shopName: "",
      rating: 0,
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

  onLoad(options) {
    if (options.id) {
      this.storeId = options.id;
    }
    if (options.name) {
      this.shopName = decodeURIComponent(options.name);
    }
  },

  methods: {
    goBack() {
      uni.navigateBack();
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }
      await this.checkRecentComment();
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

    async checkRecentComment() {
      try {
        uni.showLoading({ title: "检查中..." });
        const res = await isRecentDays();
        uni.hideLoading();
        
        if (res.data.success && res.data.result) {
          // 已评论过
          uni.showToast({
            title: "24小时内已评论过，请稍后再试",
            icon: "none",
          });
          return;
        }
        // 未评论过，可以提交
        this.submitReview();
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: "检查失败，请重试",
          icon: "none",
        });
      }
    },

    async submitReview() {
      uni.showLoading({ title: "提交中..." });

      try {
        // 上传图片
        const imageUrls = await this.uploadImages();

        const res = await createEvaluation({
          grade: this.rating,
          content: this.reviewText,
          images: imageUrls.join(","),
          storeId: this.storeId,
        });

        uni.hideLoading();
        
        if (res.data.success) {
          uni.showToast({
            title: "评价成功",
            icon: "success",
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } else {
          uni.showToast({
            title: res.data.message || "提交失败",
            icon: "none",
          });
        }
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: error.message || "提交失败",
          icon: "none",
        });
      }
    },

    async uploadImages() {
      console.log('开始上传', this.images)
      if (this.images.length === 0) return [];

      const uploadPromises = this.images.map((image) => {
        return new Promise((resolve, reject) => {
          uni.uploadFile({
            url: `${this.$config?.baseUrl || ""}/common/upload`,
            filePath: image,
            name: "file",
            success: (res) => {
              const data = JSON.parse(res.data);
              if (data.success) {
                resolve(data.result);
              } else {
                reject(new Error(data.message));
              }
            },
            fail: reject,
          });
        });
      });

      return Promise.all(uploadPromises);
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
