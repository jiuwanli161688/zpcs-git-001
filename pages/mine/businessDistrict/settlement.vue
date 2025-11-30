<template>
  <view class="container">
    <!-- Payment Card -->
    <view class="payment-card">
        <!-- Header -->
        <view class="card-header">
            <view class="text-content">
                <view class="title">中品商圈付款</view>
                <view class="subtitle">兑换智能饮水机</view>
            </view>
            <view class="mascot-placeholder">
                <!-- Placeholder for Mascot -->
                <image src="/static/cbd/workbench/mascot.png" mode="aspectFit" class="mascot-img"></image>
            </view>
            <view class="gradient-bg"></view>
        </view>
        
        <!-- QR Code Section -->
        <view class="qr-section">
            <view class="qr-box">
                <!-- Placeholder for QR Code -->
                <image src="/static/cbd/workbench/qr_placeholder.png" mode="aspectFit" class="qr-img"></image>
            </view>
            <view class="merchant-name">旺德福超市</view>
        </view>
        
        <!-- Footer -->
        <view class="card-footer">
            <view class="logo-row">
                <image src="/static/cbd/workbench/Logo@3x.png" mode="aspectFit" class="logo-icon-img"></image>
                <text class="logo-text">中品赋能百业</text>
            </view>
        </view>
    </view>
    
    <!-- Download Button -->
    <view class="action-area">
        <view class="download-btn" @click="handleDownload">下载我的收款码</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      
    };
  },
  methods: {
    handleDownload() {
        uni.showToast({
            title: '下载成功',
            icon: 'success'
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'TaoBaoMaiCaiTi';
  src: url('/static/fonts/TaoBaoMaiCaiTi-Regular.ttf');
}

.container {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding: 30rpx;
  display: flex;
  margin-top: 120rpx;
  flex-direction: column;
  align-items: center;
}

.payment-card {
    width: 100%;
    background-color: #fff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
    margin-top: 20rpx;
    
    .card-header {
        position: relative;
        height: 240rpx;
        padding: 40rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 20rpx;
        border-top-right-radius: 20rpx;
        
        .text-content {
            z-index: 2;
            .title {
                font-family: 'TaoBaoMaiCaiTi', sans-serif;
                font-size: 40rpx;
                color: #333333;
                margin-bottom: 10rpx;
                font-weight: bold;
            }
            
            .subtitle {
                font-family: 'TaoBaoMaiCaiTi', sans-serif;
                font-size: 40rpx;
                color: #333333;
            }
        }
        
        .mascot-placeholder {
            z-index: 2;
            width: 236rpx;
            height: 384rpx;
            position: absolute;
            right: 150rpx;
            bottom: -42rpx;
            
            .mascot-img {
                width: 100%;
                height: 100%;
            }
        }
        
        .gradient-bg {
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            border-top-left-radius: 20rpx;
            border-top-right-radius: 20rpx;
            background: linear-gradient(270deg, #FF0101 0%, rgba(255, 1, 1, 0) 38%);
            z-index: 1;
        }
    }
    
    .qr-section {
        padding: 40rpx 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .qr-box {
            width: 400rpx;
            height: 400rpx;
            position: relative;
            margin-bottom: 30rpx;
            
            .qr-img {
                width: 100%;
                height: 100%;
            }
            
            .center-logo {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80rpx;
                height: 80rpx;
                background-color: #fff;
                border-radius: 10rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 4rpx solid #fff;
                box-shadow: 0 0 10rpx rgba(0,0,0,0.1);
                
                text {
                    color: #FF0101;
                    font-weight: bold;
                    font-size: 40rpx;
                }
            }
        }
        
        .merchant-name {
            font-size: 32rpx;
            color: #333;
            font-weight: bold;
        }
    }
    
    .card-footer {
        padding: 30rpx;
        border-top: 1rpx solid #eee;
        display: flex;
        justify-content: center;
        
        .logo-row {
            display: flex;
            align-items: center;
            
            .logo-icon-img {
                width: 60rpx;
                height: 60rpx;
                margin-right: 10rpx;
            }
            
            .logo-text {
                font-size: 26rpx;
                color: #666;
            }
        }
    }
}

.action-area {
    width: 100%;
    margin-top: 60rpx;
    
    .download-btn {
        background-color: #FF0101;
        color: #fff;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        border-radius: 18rpx;
        font-size: 32rpx;
        font-weight: bold;
    }
}
</style>
