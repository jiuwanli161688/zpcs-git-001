<template>
  <view class="merchant-detail">
    <!-- 顶部轮播图 -->
    <merchant-hero
      :images="merchantData.images"
      @back="handleBack"
      @search="handleSearch"
      @share="handleShare"
    />

    <!-- 商家信息卡片 -->
    <view class="merchant-card">
      <merchant-info
        :merchant="merchantData"
        @call="handleCall"
        @navigate="handleNavigate"
      />

      <!-- 用户评分区 -->
      <user-rating
        v-if="showRating"
        :days="checkInDays"
        :current-rating="userRating"
        @rate="handleRate"
      >
        <template #top>
          <view class="rating-title">
            <text>{{ checkInDays }}天前你在这里打卡，体验如何？</text>
          </view>
        </template>
      </user-rating>

      <!-- 评价列表 -->
      <review-section
        :count="reviewData.total"
        :list="reviewData.list"
        :loading="reviewLoading"
        @view-all="handleComment"
      />
    </view>

    <!-- 底部操作栏 -->
    <bottom-actions
      @comment="handleViewAllReviews"
      @checkin="handleCheckIn"
      @scan="handleScan"
    />

    <!-- 添加打卡失败弹窗组件 -->
    <check-in-fail-modal
      v-model="showCheckInFailModal"
      title="打卡失败"
      subtitle="不在商家附近无法进行打卡"
      @close="onPopupClose"
    />
  </view>
</template>

<script>
import MerchantHero from "./components/merchant-hero.vue";
import MerchantInfo from "./components/merchant-info.vue";
import UserRating from "./components/user-rating.vue";
import ReviewSection from "./components/review-section.vue";
import BottomActions from "./components/bottom-actions.vue";
import CheckInFailModal from "./components/check-in-fail-modal.vue";
import { getShopDetail, getEvaluation, getRecentCheckInDays } from "@/api/shop/list/detail.js";

export default {
  components: {
    MerchantHero,
    MerchantInfo,
    UserRating,
    ReviewSection,
    BottomActions,
    CheckInFailModal,
  },

  data() {
    return {
      merchantId: "",
      merchantData: {
        name: "",
        images: ["/static/cbd/shop/detail/test-img.png"],
        rating: 0,
        distance: 0,
        categories: [],
        status: "",
        hours: "",
        address: "",
        phone: "",
      },
      checkInDays: 0,
      showRating: false, // 控制用户评分区显示
      userRating: 0,
      reviewData: {
        total: 0,
        list: [],
      },
      reviewLoading: false,
      showCheckInFailModal: false,
      userCheckInCount: 0,
    };
  },

  onLoad(options) {
    this.merchantId = options.id || "";
    this.loadMerchantData();
    this.loadReviewData();
    this.loadRecentCheckInDays();
  },

  methods: {
    async loadMerchantData() {
      if (!this.merchantId) return;
      try {
        const res = await getShopDetail(this.merchantId);
        if (res.data.success && res.data.result) {
          const data = res.data.result;
          this.merchantData = {
            name: data.storeName || "",
            images: data.images || ["/static/cbd/shop/detail/test-img.png"],
            rating: data.avgScore || 0,
            distance: 0,
            categories: [],
            status: data.storeDisable === "OPEN" ? "营业中" : "已打烊",
            hours: `${data.businessStartTime || "00:00"} - ${data.businessEndTime || "00:00"}`,
            address: data.storeAddressDetail || "",
            addressPath: data.storeAddressPath || "",
            phone: data.linkPhone || "",
          };
          this.checkInDays = data.recentClockInDays || 0;
        }
      } catch (error) {
        uni.showToast({
          title: "加载失败，请重试",
          icon: "none",
        });
      }
    },

    async loadReviewData() {
      if (!this.merchantId) return;
      this.reviewLoading = true;
      try {
        const res = await getEvaluation({
          storeId: this.merchantId,
          pageNumber: 1,
          pageSize: 5,
        });
        if (res.data.success && res.data.result) {
          this.reviewData = {
            total: res.data.result.total || 0,
            list: (res.data.result.records || []).map(item => ({
              id: item.id,
              avatar: item.memberProfile || "/static/cbd/shop/detail/test-img.png",
              nickname: item.memberName || "匿名用户",
              time: item.createTime || "",
              rating: Number(item.grade) || 0,
              content: item.content || "",
              images: item.images ? item.images.split(",") : [],
            })),
          };
        }
      } catch (error) {
        uni.showToast({
          title: "加载评价失败",
          icon: "none",
        });
      } finally {
        this.reviewLoading = false;
      }
    },

    async loadRecentCheckInDays() {
      if (!this.merchantId) return;
      try {
        const res = await getRecentCheckInDays({ storeId: this.merchantId });
        if (res.data.success && res.data.result > 0) {
          this.checkInDays = res.data.result;
          this.showRating = true;
        }
      } catch (error) {
        console.error("获取打卡天数失败", error);
      }
    },

    // 返回
    handleBack() {
      uni.navigateBack();
    },

    // 搜索
    handleSearch() {
      uni.navigateTo({
        url: "/pages/search/index",
      });
    },

    // 分享
    handleShare() {
      uni.showActionSheet({
        itemList: ["分享到微信"],
        success: (res) => {
          console.log("分享渠道：", res.tapIndex);
        },
      });
    },

    // 拨打电话
    handleCall() {
      uni.makePhoneCall({
        phoneNumber: this.merchantData.phone,
        complete: (err) => {
          console.log('打电话', err)
        }
      });
    },

    // 导航
    handleNavigate() {
      uni.openLocation({
        latitude: 30.2741,
        longitude: 120.1551,
        name: this.merchantData.name,
        address: this.merchantData.address,
      });
    },

    // 用户评分
    async handleRate(rating) {
      this.userRating = rating;
      try {
        // 调用接口提交评分
        // await this.$api.submitRating(this.merchantId, rating)
        uni.showToast({
          title: "评分成功",
          icon: "success",
        });
      } catch (error) {
        uni.showToast({
          title: "评分失败，请重试",
          icon: "none",
        });
      }
    },

    // 查看全部评价
    handleViewAllReviews() {
      uni.navigateTo({
        url: `/pages/post-comment/index?id=${this.merchantId}`,
      });
    },

    // 评价
    handleComment() {
      uni.navigateTo({
        url: `/pages/comment/index?id=${this.merchantId}`,
      });
    },

    // 打卡
    async handleCheckIn() {
      try {
        const location = await this.getUserLocation();

        // 检查是否在商家附近（这里简化处理，实际应该调用后端接口判断）
        const isNearby = this.checkIfNearby(location);

        if (!isNearby) {
          // 不在商家附近，显示失败弹窗
          this.showCheckInFailModal = true;
          return;
        }

        // 在商家附近，跳转到打卡页面
        uni.navigateTo({
          url: `/pages/check-in/index?merchantId=${this.merchantId}&merchantName=${this.merchantData.name}&checkInCount=${this.userCheckInCount}`,
        });
      } catch (error) {
        uni.showToast({
          title: error.message || "打卡失败",
          icon: "none",
        });
      }
    },
    // 扫码
    handleScan() {
      uni.scanCode({
        success: (res) => {
          // 扫码成功后可处理返回内容
          // 这里直接跳转到获得的url，如果内容不是url可做进一步处理
          if (res.result && res.result.startsWith("http")) {
            uni.navigateTo({
              url: res.result,
            });
          } else {
            // 测试
            uni.showModal({
              title: "扫码结果",
              content: res.result,
              showCancel: false,
            });
          }
        },
        fail: (err) => {
          uni.showToast({
            title: "扫码失败",
            icon: "none",
          });
        },
      });
    },
    getUserLocation() {
      return new Promise((resolve, reject) => {
        uni.getLocation({
          type: "gcj02",
          success: (res) => {
            resolve({
              latitude: res.latitude,
              longitude: res.longitude,
            });
          },
          fail: (err) => {
            this.showCheckInFailModal = true;
          },
        });
      });
    },
    onPopupClose() {
      console.log('弹窗已关闭')
    },
    checkIfNearby(userLocation) {
      // 这里简化处理，实际应该：
      // 1. 调用后端接口，传入用户位置和商家ID
      // 2. 后端计算距离，判断是否在允许打卡范围内（例如500米）
      // 3. 返回是否可以打卡

      // 模拟：随机返回true/false用于测试
      // return Math.random() > 0.5

      // 默认返回true，方便测试
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.merchant-detail {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}
.line-gray {
  width: 100vw;
  height: 20rpx;
  background: #f8f8f8;
  margin-left: -30rpx;
}

.merchant-card {
  margin-top: -40rpx;
  position: relative;
  z-index: 2;
}

.rating-title {
  margin-bottom: 32rpx;

  text {
    color: #333;
    font-size: 32rpx;
    font-weight: 500;
  }
}
</style>
