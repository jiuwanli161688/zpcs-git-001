<template>
  <view class="container">
    <view class="list">
      <view class="card" v-for="(item, index) in list" :key="index">
        <!-- Header -->
        <view class="card-header">
            <view class="title-row">
                <text class="label">合同编号：</text>
                <text class="value">{{ item.contractNo }}</text>
                <view class="status-tag" :class="item.status">
                    <text>{{ getStatusText(item.status) }}</text>
                </view>
            </view>
        </view>
        
        <!-- Content -->
        <view class="card-content">
            <view class="info-row">
                <text class="label">起止日期</text>
                <text class="value">{{ item.startDate }}至{{ item.endDate }}</text>
            </view>
            <view class="info-row">
                <text class="label">签约日期</text>
                <text class="value">{{ item.signDate }}</text>
            </view>
        </view>
        
        <!-- Footer Actions -->
        <view class="card-footer" v-if="item.status !== 'cancelled'">
            <view class="btn-row">
                <view class="btn outline" v-if="showRenewBtn(item.status)" @click="handleRenew(item)">
                    <text>{{ item.status === 'pending' ? '立即签约' : '一键续约' }}</text>
                </view>
                <view class="btn primary" @click="handleView(item)">
                    <text>查看合同</text>
                </view>
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
      list: [
        {
            contractNo: 'S783927892',
            status: 'pending', // 待签
            startDate: '2025-02-05',
            endDate: '2026-02-04',
            signDate: '2026-02-04'
        },
        {
            contractNo: 'S783927892',
            status: 'active', // 生效
            startDate: '2025-02-05',
            endDate: '2026-02-04',
            signDate: '2026-02-04'
        },
        {
            contractNo: 'S783927892',
            status: 'expiring', // 临期
            startDate: '2025-02-05',
            endDate: '2026-02-04',
            signDate: '2026-02-04'
        },
        {
            contractNo: 'S783927892',
            status: 'terminated', // 终止
            startDate: '2025-02-05',
            endDate: '2026-02-04',
            signDate: '2026-02-04'
        },
        {
            contractNo: 'S783927892',
            status: 'cancelled', // 解约
            startDate: '2025-02-05',
            endDate: '2026-02-04',
            signDate: '2026-02-04'
        }
      ]
    };
  },
  methods: {
    getStatusText(status) {
        const map = {
            pending: '待签',
            active: '生效',
            expiring: '临期',
            terminated: '终止',
            cancelled: '解约'
        };
        return map[status] || status;
    },
    showRenewBtn(status) {
        return ['pending', 'expiring', 'terminated'].includes(status);
    },
    handleRenew(item) {
        console.log('Renew/Sign', item);
    },
    handleView(item) {
        console.log('View', item);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding: 20rpx 30rpx;
}

.card {
    background-color: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .card-header {
        margin-bottom: 30rpx;
        padding-bottom: 16rpx;
        border-bottom: 1px solid #EDEDED;
        
        .title-row {
            display: flex;
            align-items: center;
            
            .label {
                font-size: 30rpx;
                color: #333;
                font-weight: bold;
            }
            
            .value {
                font-size: 30rpx;
                color: #333;
                font-weight: bold;
                margin-right: 20rpx;
            }
            
            .status-tag {
                padding: 4rpx 16rpx;
                border-radius: 20rpx; // Rounded pill shape
                font-size: 24rpx;
                
                &.pending {
                    background-color: #FFD2D2;
                    color: #FF0101;
                }
                
                &.active {
                    background-color: #C4FFE0;
                    color: #00B054;
                }
                
                &.expiring {
                    background-color: #FFCE89;
                    color: #AA6300;
                }
                
                &.terminated, &.cancelled {
                    background-color: #B3B3B3;
                    color: #fff;
                }
            }
        }
    }
    
    .card-content {
        padding-bottom: 30rpx;
        border-bottom: 1px solid #eee;
        margin-bottom: 20rpx;
        
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16rpx;
            
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
            }
        }
    }
    
    .card-footer {
        display: flex;
        justify-content: flex-end;
        
        .btn-row {
            display: flex;
            
            .btn {
                height: 50rpx;
                padding: 8rpx 30rpx;
                border-radius: 80rpx;
                font-size: 26rpx;
                margin-left: 20rpx;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
                
                &.outline {
                    border: 1px solid #FF0101;
                    color: #FF0101;
                    background-color: #fff;
                }
                
                &.primary {
                    background-color: #FF0101;
                    color: #fff;
                }
            }
        }
    }
}
</style>
