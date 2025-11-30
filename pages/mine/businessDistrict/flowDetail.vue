<template>
  <view class="container">
    <!-- Consumer Info Section -->
    <view class="section">
        <view class="section-header">
            <view class="indicator"></view>
            <text class="title">消费者信息</text>
        </view>
        <view class="info-list">
            <view class="row">
                <text class="label">消费者账号</text>
                <text class="value">{{ detail.consumerAccount }}</text>
            </view>
            <view class="row">
                <text class="label">服务商手机</text>
                <text class="value">{{ detail.providerPhone }}</text>
            </view>
            <view class="row">
                <text class="label">注册日期</text>
                <text class="value">{{ detail.registerDate }}</text>
            </view>
        </view>
    </view>
    
    <!-- Transaction Flow Section -->
    <view class="section">
        <view class="section-header">
            <view class="indicator"></view>
            <text class="title">交易流水</text>
        </view>
        <view class="info-list">
            <view class="row">
                <text class="label">流水号</text>
                <text class="value">{{ detail.flowNo }}</text>
            </view>
            <view class="row">
                <text class="label">商户号</text>
                <text class="value">{{ detail.merchantNo }}</text>
            </view>
            <view class="row">
                <text class="label">商户全称</text>
                <text class="value">{{ detail.merchantName }}</text>
            </view>
            <view class="row">
                <text class="label">收款机构</text>
                <text class="value">{{ detail.institution }}</text>
            </view>
            <view class="row">
                <text class="label">交易时间</text>
                <text class="value">{{ detail.time }}</text>
            </view>
            <view class="row">
                <text class="label">支付方式</text>
                <text class="value">{{ detail.paymentMethod }}</text>
            </view>
        </view>
    </view>
    
    <!-- Tip -->
    <view class="tip-box">
        <u-icon name="info-circle" color="#999" size="28" style="margin-right: 10rpx; margin-top: 4rpx;"></u-icon>
        <view class="text-content">
            <view class="text">温馨提示：平台支持交易日七天内（含交易日）可以发生退款，退款后平台发放的水机兑换券也将自动退回。</view>
            <view class="text">备付金账户余额不足时，无法进行线上退款。</view>
        </view>
    </view>
    
    <!-- Footer Button -->
    <view class="footer">
        <view class="refund-btn" @click="handleRefund">退回付款</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      detail: {
        consumerAccount: '136****2933',
        providerPhone: '136****2933',
        registerDate: '2025-12-12',
        flowNo: '32423423423423423',
        merchantNo: '534243345453',
        merchantName: '北京某某某某公司',
        institution: '上海汇付某某某',
        time: '2025-12-12 23:34:30',
        paymentMethod: '微信'
      }
    };
  },
  methods: {
    handleRefund() {
        uni.showModal({
            title: '提示',
            content: '确定要退回这笔付款吗？',
            success: (res) => {
                if (res.confirm) {
                    console.log('Refund confirmed');
                    // Implement refund logic here
                }
            }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding: 20rpx;
  padding-bottom: 120rpx; // Space for footer
}

.section {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .section-header {
        display: flex;
        align-items: center;
        margin-bottom: 30rpx;
        
        .indicator {
            width: 8rpx;
            height: 30rpx;
            background-color: #FF0101;
            border-radius: 4rpx;
            margin-right: 16rpx;
        }
        
        .title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
        }
    }
    
    .info-list {
        .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20rpx;
            
            &:last-child {
                margin-bottom: 0;
            }
            
            .label {
                font-size: 28rpx;
                color: #666;
            }
            
            .value {
                font-size: 28rpx;
                color: #999;
                text-align: right;
                flex: 1;
                margin-left: 20rpx;
            }
        }
    }
}

.tip-box {
    display: flex;
    align-items: flex-start;
    padding: 0 10rpx;
    
    .text-content {
        flex: 1;
        
        .text {
            font-size: 24rpx;
            color: #999;
            line-height: 1.5;
            margin-bottom: 5rpx;
        }
    }
}

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
    
    .refund-btn {
        background-color: #FF0101;
        color: #fff;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        border-radius: 16rpx;
        font-size: 32rpx;
        font-weight: bold;
    }
}
</style>
