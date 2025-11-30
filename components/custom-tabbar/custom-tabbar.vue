<template>
  <view class="custom-tabbar" :class="{ 'safe-area-bottom': safeAreaBottom }">
    <view class="tabbar-container">
      <!-- 第一个tab：地域 -->
      <!-- <view
        class="tab-item"
        :class="{ active: currentIndex === 0 }"
        @click="switchTab(0, '/pages/tabbar/home/index')"
      > -->
      <view
        class="tab-item"
        :class="{ active: currentIndex === 0 }"
        @click="switchTab(0, '/pages/shop/index')"
      >
                <image
          :src="currentIndex === 0 ? iconNav1Hov : iconNav1"
          class="tab-icon"
        />
        <text class="tab-text" :class="{ active: currentIndex === 0 }">地域</text>
      </view>

      <!-- 第二个tab：维度精品（凸出效果） -->
      <!-- #ifndef MP-WEIXIN -->
      <view
        class="tab-item special-tab"
        :class="{ active: currentIndex === 1 }"
        @click="switchTab(1, '/pages/region/weidu-boutique')"
      >
                <view class="special-tab-bg">
          <image
            :src="currentIndex === 1 ? iconNav2Hov : iconNav2"
            class="tab-icon special-icon"
          />
        </view>
        <text class="tab-text special-text" :class="{ active: currentIndex === 1 }">维度精品</text>
      </view>

      <!-- 第三个tab：购物车 -->
      <view
        class="tab-item"
        :class="{ active: currentIndex === 2 }"
        @click="switchTab(2, '/pages/tabbar/cart/cartList')"
      >
                <view class="cart-icon-container">
          <image
            :src="currentIndex === 2 ? '/static/tabbar/icon-nav3-hov.png' : '/static/tabbar/icon-nav3.png'"
            class="tab-icon"
          />
          <!-- 购物车角标 -->
          <view v-if="cartCount > 0" class="cart-badge">
            <text class="cart-badge-text">{{ cartCount > 99 ? '99+' : cartCount }}</text>
          </view>
        </view>
        <text class="tab-text" :class="{ active: currentIndex === 2 }">购物车</text>
      </view>
      <!-- #endif -->

      <!-- 第四个tab：我的 -->
      <view
        class="tab-item"
        :class="{ active: (currentIndex === 3) || (currentIndex === 2 && isWeixinMP) }"
        @click="switchTab(isWeixinMP ? 2 : 3, '/pages/tabbar/user/profile')"
      >
                <image
          :src="((currentIndex === 3) || (currentIndex === 2 && isWeixinMP)) ? '/static/tabbar/icon-nav4-hov.png' : '/static/tabbar/icon-nav4.png'"
          class="tab-icon"
        />
        <text class="tab-text" :class="{ active: (currentIndex === 3) || (currentIndex === 2 && isWeixinMP) }">我的</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CustomTabbar',
  props: {
    current: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentIndex: 0,
      safeAreaBottom: false,
      isWeixinMP: false,
      iconNav1Hov: `${this.iconCommon}/static/region/icon-nav1-hov.png`,
      iconNav1: `${this.iconCommon}/static/region/icon-nav1.png`,
      iconNav2Hov: `${this.iconCommon}/static/region/icon-nav2-hov.png`,
      iconNav2: `${this.iconCommon}/static/region/icon-nav2.png`,
    }
  },
  computed: {
    ...mapState(['cartCount'])
  },
  watch: {
    current: {
      handler(newVal) {
        this.currentIndex = newVal
      },
      immediate: true
    }
  },
  mounted() {
    // this.checkSafeArea()
    this.checkPlatform()
  },
  methods: {
            switchTab(index, url) {
      if (this.currentIndex === index) return

      this.currentIndex = index
      this.$emit('change', index)

      // 使用reLaunch进行页面切换，避免页面栈问题
      uni.reLaunch({
        url: url
      })
    },

    checkSafeArea() {
      // 检查是否需要适配安全区域
      const systemInfo = uni.getSystemInfoSync()
      this.safeAreaBottom = systemInfo.safeAreaInsets && systemInfo.safeAreaInsets.bottom > 0
    },

    checkPlatform() {
      // #ifdef MP-WEIXIN
      this.isWeixinMP = true
      // #endif
    }
  }
}
</script>

<style lang="scss">
/* 强制隐藏原生tabbar */
uni-tabbar,
.uni-tabbar,
.uni-tabbar-border,
.uni-app--showtabbar .uni-tabbar,
page .uni-tabbar,
body .uni-tabbar {
  display: none !important;
  height: 0 !important;
  visibility: hidden !important;
  opacity: 0 !important;
  z-index: -1 !important;
}

.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #ffffff;
  border-top: 1px solid #e5e5e5;
  padding-bottom: 8rpx; // 为安卓设备添加底部内边距

  &.safe-area-bottom {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

.tabbar-container {
  display: flex;
  align-items: center;
  height: 98rpx; // 恢复原来的高度
  position: relative;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rpx 0 12rpx 0; // 增加底部padding，为安卓设备提供更多空间
  position: relative;
  height: 100%; // 占满容器高度

  &.active .tab-text {
    color: #ff573e;
  }
}

.tab-icon {
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 4rpx; // 减少图标和文字的间距
}

.tab-text {
  font-size: 20rpx;
  color: #666666;
  line-height: 1;

  &.active {
    color: #ff573e;
  }
}

// 特殊tab样式（点击后变大凸出效果）
.special-tab {
  position: relative;
  transition: all 0.3s ease; // 添加过渡动画

  .special-tab-bg {
    width: 48rpx; // 默认和图标一样大小
    height: 48rpx;
    border-radius: 50%;
    background: transparent; // 透明背景
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4rpx; // 减少底部间距
    transition: all 0.3s ease; // 添加过渡动画
  }

  .special-icon {
    width: 48rpx; // 和其他图标一样大
    height: 48rpx;
    transition: all 0.3s ease;
  }

  .special-text {
    font-size: 20rpx;
    margin-top: 2rpx; // 减少顶部间距
    margin-bottom: 4rpx; // 为安卓设备添加底部间距
    color: #666666; // 默认颜色
    transition: all 0.3s ease;
  }

    // 激活时变大凸出
  &.active {
    z-index: 10; // 确保凸出部分在最上层

    .special-tab-bg {
      width: 100rpx; // 激活时变大到100rpx，更明显的凸出效果
      height: 100rpx;
      background: transparent; // 激活时也保持透明
      margin-top: -40rpx; // 增加向上偏移量，让凸出更明显
    }

    .special-icon {
      width: 92rpx; // 激活时图标变大到100rpx
      height: 92rpx;

    }

    .special-text {
      color: #ff573e;
      font-weight: bold;
    }
  }
}

// 购物车角标
.cart-icon-container {
  position: relative;
  width: 48rpx;
  height: 48rpx;
}

.cart-badge {
  position: absolute;
  top: -8rpx;
  right: -12rpx;
  background: #ff573e;
  border-radius: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #ffffff;
}

.cart-badge-text {
  color: #ffffff;
  font-size: 18rpx;
  font-weight: bold;
  line-height: 1;
  padding: 0 6rpx;
}

// 微信小程序适配
// #ifdef MP-WEIXIN
.special-tab {
  display: none !important;
}

.tab-item:nth-child(3) {
  display: none !important;
}
// #endif
</style>
