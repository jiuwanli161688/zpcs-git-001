<template>
  <view class="clock-in-page">
    <!-- Background Image -->
    <image class="bg-image" src="/static/cbd/clockIn/bg.png" mode="aspectFill"></image>

    <!-- Navbar Back Button -->
    <view class="custom-nav" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <u-icon name="arrow-left" size="48" color="#FFFFFF" @click="goBack"></u-icon>
        <text class="nav-title">商圈打卡</text>
      </view>
    </view>

    <view class="content-container" :style="{ marginTop: (statusBarHeight + 44) + 'px' }">
      <!-- Top Card: Clock In Info -->
      <view class="card top-card">
        <view class="dots-decoration">
          <view class="dot" v-for="i in 6" :key="i"></view>
        </view>
        
        <view class="clock-info">
          <view class="location-icon-wrapper">
             <image class="location-icon" src="/static/cbd/clockIn/location.png" mode="widthFix"></image>
          </view>
          <view class="text-info">
            <text class="time-text">2025-09-13 08:35:33 打卡</text>
            <text class="count-text">我2025年第8次打卡</text>
          </view>
        </view>
        
        <view class="yellow-divider"></view>
        
        <!-- Main Image Area -->
        <view class="main-image-wrapper">
          <image class="main-image" src="/static/cbd/clockIn/main_food.png" mode="aspectFill"></image>
        </view>

        <!-- Connection Lines -->
        <view class="connection-lines">
           <view class="line-left"></view>
           <view class="line-right"></view>
        </view>
      </view>

      <!-- Bottom Card: Restaurant Info -->
      <view class="card bottom-card">
        <view class="shop-info">
          <image class="shop-logo" src="/static/cbd/clockIn/shop_logo.png" mode="aspectFill"></image>
          <view class="shop-details">
            <view class="shop-header">
              <text class="shop-name">咱家小院铁锅炖（亦庄店）</text>
            </view>
            
            <view class="shop-middle">
              <view class="rating-section">
                <view class="stars">
                  <image class="star-icon" src="/static/cbd/clockIn/star_filled.png" mode="aspectFit" v-for="i in 4" :key="`filled-${i}`"></image>
                  <image class="star-icon" src="/static/cbd/clockIn/star_empty.png" mode="aspectFit"></image>
                </view>
                <text class="score">3.8</text>
              </view>
              <text class="status-tag">营业中</text>
            </view>

            <view class="shop-footer">
              <text class="category">东北菜 亦庄</text>
              <text class="distance">365m</text>
            </view>
            
            <!-- Test Button -->
            <u-button size="mini" type="error" @click="goToPayment" style="margin-top: 20rpx;">去付款(测试)</u-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 20
    };
  },
  onLoad() {
    const sysInfo = uni.getSystemInfoSync();
    this.statusBarHeight = sysInfo.statusBarHeight || 20;
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    goToPayment() {
      uni.navigateTo({
        url: '/pages/mine/businessDistrict/payToMerchant'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/* Font Family */
@font-face {
  font-family: 'Alimama ShuHeiTi';
  src: url('/static/fonts/AlimamaShuHeiTi-Bold.ttf');
}

.clock-in-page {
  min-height: 100vh;
  background-color: #333;
  position: relative;
  overflow: hidden;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.custom-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  
  .nav-content {
    height: 88rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    
    .nav-title {
      color: #FFFFFF;
      font-size: 36rpx;
      font-weight: bold;
      margin-left: 20rpx;
      flex: 1;
      text-align: center;
      margin-right: 68rpx;
    }
  }
}

.content-container {
  position: relative;
  z-index: 10;
  padding: 0 56rpx; /* 28px * 2 */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 40rpx;
  padding-top: 100rpx; /* 50px * 2 gap from header */
}

.card {
  background: #FFFFFF;
  border-radius: 40rpx;
  width: 100%;
  box-sizing: border-box;
}

.top-card {
  padding: 60rpx 40rpx 0;
  position: relative;
  padding-bottom: 90rpx;
}

.dots-decoration {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40rpx;
  padding: 0 30rpx;
  
  .dot {
    width: 24rpx;
    height: 24rpx;
    background-color: #8B5E3C;
    border-radius: 50%;
  }
}

.clock-info {
  display: flex;
  align-items: flex-end; /* Bottom align */
  margin-bottom: 40rpx;
  
  .location-icon-wrapper {
    margin-right: 30rpx;
    .location-icon {
      width: 56rpx; /* 28px * 2 */
      height: 78rpx; /* 39px * 2 */
    }
  }
  
  .text-info {
    display: flex;
    flex-direction: column;
    
    .time-text {
      font-size: 28rpx;
      color: #999999;
      margin-bottom: 16rpx;
    }
    
    .count-text {
      font-family: 'Alimama ShuHeiTi', sans-serif;
      font-size: 50rpx; /* 25px * 2 */
      font-weight: bold;
      line-height: normal;
      text-align: center;
      letter-spacing: 0em;
      color: #3D3D3D;
    }
  }
}

.yellow-divider {
  height: 8rpx;
  background-color: #F7C54D;
  margin: 0 -40rpx 40rpx;
}

.main-image-wrapper {
  width: 100%;
  height: 600rpx;
  border-radius: 0; /* No border radius */
  overflow: hidden;
  
  .main-image {
    width: 100%;
    height: 100%;
  }
}

.connection-lines {
  position: absolute;
  bottom: -90rpx;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 0 140rpx;
  box-sizing: border-box;
  
  .line-left, .line-right {
    width: 16rpx; /* 6px * 2 */
    height: 140rpx; /* 51px * 2 */
    background-color: #FFFFFF;
    position: relative;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);

    
    &::before, &::after {
      content: '';
      position: absolute;
      width: 24rpx; /* 12px * 2 */
      height: 24rpx; /* 12px * 2 */
      background-color: #3D3D3D;
      border-radius: 50%;
      left: 50%;
      transform: translateX(-50%);
    }
    &::before { top: -12rpx; }
    &::after { bottom: -12rpx; }
  }
}

.bottom-card {
  margin-top: 60rpx;
  padding: 62rpx 40rpx 22rpx 20rpx;
  
  .shop-info {
    display: flex;
    
    .shop-logo {
      width: 160rpx;
      height: 160rpx;
      border-radius: 20rpx;
      margin-right: 30rpx;
      background-color: #eee;
    }
    
    .shop-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      
      .shop-header {
        .shop-name {
          font-family: 'Source Han Sans', sans-serif;
          font-size: 28rpx; /* 14px * 2 */
          font-weight: 500;
          line-height: normal;
          letter-spacing: 0em;
          color: #333;
        }
      }
      
      .shop-middle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .rating-section {
          display: flex;
          align-items: center;
          
          .stars {
            display: flex;
            margin-right: 20rpx;
            
            .star-icon {
              width: 24rpx; /* 12px * 2 */
              height: 24rpx; /* 12px * 2 */
              margin-right: 6rpx;
            }
          }
          
          .score {
            color: #FE5C3C;
            font-family: 'Source Han Sans', sans-serif;
            font-size: 24rpx; /* 12px * 2 */
            font-weight: bold;
            line-height: normal;
            letter-spacing: 0em;
          }
        }
        
        .status-tag {
          color: #F7C54D;
          font-size: 24rpx;
          /* No border */
        }
      }
      
      .shop-footer {
        display: flex;
        justify-content: space-between;
        font-size: 28rpx;
        color: #999999;
        
        .distance {
          /* Aligned right by flex justify-between */
        }
      }
    }
  }
}
</style>
