<template>
  <view class="container">
        <!-- Content Wrapper -->
    <view class="content-wrapper">
        <!-- Top Red Background -->
        <view class="red-bg"></view>

        <!-- Merchant Info -->
        <view class="merchant-info">
            <image class="avatar" :src="merchantInfo.avatar || '/static/cbd/workbench/default_avatar.png'" mode="aspectFill"></image>
            <view class="info-right">
                <view class="name">{{ merchantInfo.name || '商家名称' }}</view>
                <view class="tag-wrap">
                    <image class="tag-bg" src="/static/cbd/workbench/tag_bg.png" mode="heightFix"></image>
                    <text class="tag-text">中品维度商家</text>
                </view>
            </view>
        </view>

        <!-- Turnover Card -->
        <view class="card turnover-card">
            <view class="item">
                <view class="num">3,200</view>
                <view class="label">今日营业额</view>
            </view>
            <view class="divider"></view>
            <view class="item">
                <view class="num">3,200</view>
                <view class="label">未结营业额</view>
            </view>
        </view>

        <!-- Menu List -->
        <view class="card menu-list">
            <view class="menu-item" v-for="(item, index) in menuList" :key="index" @click="handleMenuClick(item)">
                <view class="left">
                    <image class="icon" :src="item.icon" mode="aspectFit"></image>
                    <text class="text">{{ item.text }}</text>
                </view>
                <u-icon name="arrow-right" color="#999" size="28"></u-icon>
            </view>
        </view>

        <!-- Unactivated Tip -->
        <view class="unactivated-tip" v-if="!isActivated">
            系统为您开通Z类服务商资格，请前往结算系统激活。
        </view>

    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isActivated: true, // Toggle this to test the unactivated state
      merchantInfo: {
          name: '旺旺雪饼',
          avatar: '' // User will provide image
      },
      menuList: [
          { text: '商家资料', icon: '/static/cbd/workbench/icon_profile.png', path: '' },
          { text: '营业资质', icon: '/static/cbd/workbench/icon_qualification.png', path: '/pages/mine/businessDistrict/qualification' },
          { text: '相册管理', icon: '/static/cbd/workbench/icon_album.png', path: '/pages/mine/businessDistrict/album' },
          { text: '结算账户', icon: '/static/cbd/workbench/icon_account.png', path: '' },
          { text: '合同管理', icon: '/static/cbd/workbench/icon_contract.png', path: '/pages/mine/businessDistrict/contract' },
          { text: '流水管理', icon: '/static/cbd/workbench/icon_flow.png', path: '/pages/mine/businessDistrict/flow' },
          { text: '结算管理', icon: '/static/cbd/workbench/icon_settlement.png', path: '/pages/mine/businessDistrict/settlement' },
      ]
    };
  },
  onLoad() {
    // Check activation status (Mock logic)
    // this.checkActivationStatus();
  },
  methods: {
    handleMenuClick(item) {
        console.log('Clicked:', item.text);
        if (item.path) {
            uni.navigateTo({ url: item.path });
        }
    },
    checkActivationStatus() {
        // Implement actual check logic here
        this.isActivated = false; 
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #F8F8F8;
  position: relative;
}



.content-wrapper {
    position: relative;
}

.red-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 300rpx; // Adjust as needed
    background-color: #E22222;
    z-index: 0;
}

.merchant-info {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    padding: 30rpx 40rpx 40rpx;
    
    .avatar {
        width: 110rpx;
        height: 110rpx;
        border-radius: 500rpx;
        border: 4rpx solid #fff;
        margin-right: 30rpx;
        background-color: #eee;
        flex-shrink: 0;
        padding: 0;
        margin-bottom: 0;
    }
    
    .info-right {
        .name {
            color: #fff;
            font-size: 36rpx;
            font-weight: 500;
            margin-bottom: 12rpx;
        }
        
        .tag-wrap {
            position: relative;
            display: inline-flex;
            align-items: center;
            height: 44rpx;
            
            .tag-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 0;
            }
            
            .tag-text {
                position: relative;
                z-index: 1;
                color: #A76B00; // Assuming white text on the tag
                font-size: 24rpx;
                padding: 0 20rpx; // Adjust padding based on the background image
            }
        }
    }
}

.card {
    background-color: #fff;
    border-radius: 20rpx;
    margin: 0 30rpx 30rpx;
    position: relative;
    z-index: 1;
    box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
}

.turnover-card {
    display: flex;
    align-items: center;
    padding: 40rpx 0;
    margin-top: 0; // Overlap the red background
    
    .item {
        flex: 1;
        text-align: center;
        
        .num {
            font-family: 'Source Han Sans';
            font-size: 50rpx; // 25px * 2
            font-weight: bold;
            color: #333;
            margin-bottom: 16rpx;
        }
        
        .label {
            font-size: 28rpx; // 14px * 2
            color: #999999;
        }
    }
    
    .divider {
        width: 2rpx;
        height: 60rpx;
        background-color: #eee;
    }
}

.menu-list {
    padding: 10rpx 0;
    
    .menu-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 30rpx 30rpx;
        border-bottom: 2rpx solid #f5f5f5;
        
        &:last-child {
            border-bottom: none;
        }
        
        .left {
            display: flex;
            align-items: center;
            
            .icon {
                width: 40rpx;
                height: 40rpx;
                margin-right: 20rpx;
                // background-color: #eee; // Placeholder
            }
            
            .text {
                font-family: 'Source Han Sans';
                font-size: 28rpx; // 14px * 2
                color: #333;
            }
        }
    }
}

.unactivated-tip {
    margin: 30rpx;
    padding: 24rpx;
    background-color: #484C6A;
    color: #fff;
    font-size: 28rpx;
    border-radius: 12rpx;
    text-align: center;
}
</style>
