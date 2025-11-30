<template>
  <view class="container">
    <view class="list">
      <view class="card" v-for="(item, index) in list" :key="index">
        <view class="img-wrap">
            <image class="cert-img" :src="item.img || '/static/cbd/workbench/default_cert.png'" mode="aspectFill"></image>
            <!-- Status Overlay -->
            <view class="status-overlay failed" v-if="item.status === 'failed'">
                <text>审核未通过</text>
            </view>
            <view class="status-overlay pending" v-if="item.status === 'pending'">
                <text>待审核</text>
            </view>
        </view>
        
        <view class="info">
            <view class="title">{{ item.title }}</view>
            <view class="date">上传日期：{{ item.date }}</view>
            
            <view class="btn-row">
                <view class="btn update" :class="{ disabled: item.status === 'pending' }" @click="handleUpdate(item)">更新</view>
                <view class="btn delete" v-if="item.showDelete" @click="handleDelete(item)">删除</view>
            </view>
        </view>
      </view>
    </view>

    <!-- Bottom Button -->
    <view class="bottom-area">
        <view class="add-btn" @click="handleAdd">新增资质证件</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
            title: '营业执照',
            date: '2025-12-20 20:30:35',
            status: 'normal',
            img: '', // Placeholder
            showDelete: false
        },
        {
            title: '卫生许可证',
            date: '2025-12-20 20:30:35',
            status: 'normal',
            img: '',
            showDelete: false
        },
        {
            title: '消防许可证',
            date: '2025-12-20 20:30:35',
            status: 'failed',
            img: '',
            showDelete: true
        },
        {
            title: '非必要证件信息',
            date: '2025-12-20 20:30:35',
            status: 'normal',
            img: '',
            showDelete: false
        },
        {
            title: '一个待审核的证件',
            date: '2025-12-20 20:30:35',
            status: 'pending',
            img: '',
            showDelete: true
        }
      ]
    };
  },
  methods: {
    handleUpdate(item) {
        if (item.status === 'pending') return;
        console.log('Update', item.title);
    },
    handleDelete(item) {
        console.log('Delete', item.title);
    },
    handleAdd() {
        console.log('Add New');
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding: 20rpx 30rpx 180rpx; // Bottom padding for fixed button
}

.card {
    background-color: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    display: flex;
    
    .img-wrap {
        width: 240rpx;
        height: 160rpx;
        margin-right: 24rpx;
        position: relative;
        // border-radius: 8rpx; // Moved to image
        // overflow: hidden; // Removed to allow overlay to extend
        flex-shrink: 0;
        
        .cert-img {
            width: 100%;
            height: 100%;
            border-radius: 8rpx;
        }
        
        .status-overlay {
            position: absolute;
            bottom: 0rpx; // Lift up slightly or keep at bottom? User said wider. Let's keep at bottom relative to image but wider.
            left: -10rpx; // Center the extra width (20rpx total extra)
            width: calc(100% + 20rpx); // 10px wider (approx 20rpx)
            height: 42rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24rpx;
            color: #fff;
            z-index: 1;
            border-radius: 4rpx; // Optional: rounded corners for the bar
            
            &.failed {
                background-color: rgba(255, 1, 1, 0.44);; // Red overlay
            }
            
            &.pending {
                background-color: rgba(255, 149, 0, 0.5); // Orange/Yellow overlay
            }
        }
    }
    
    .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        .title {
            font-size: 30rpx;
            color: #333;
            font-weight: bold;
            margin-bottom: 10rpx; // 5px
        }
        
        .date {
            font-size: 24rpx;
            color: #999;
            margin-bottom: 20rpx;
        }
        
        .btn-row {
            display: flex;
            justify-content: flex-end;
            
            .btn {
                width: 120rpx;
                height: 50rpx;
                line-height: 50rpx;
                text-align: center;
                border-radius: 5px;
                font-size: 24rpx; 
                margin-left: 20rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                
                &.update {
                    background-color: #FF0101;
                    color: #fff;
                    
                    &.disabled {
                        background-color: #ccc;
                    }
                }
                
                &.delete {
                    border: 1px solid #FF0101;
                    color: #FF0101;
                    background-color: #fff;
                }
            }
        }
    }
}

.bottom-area {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    padding: 20rpx 30rpx 40rpx; // Safe area
    box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
    
    .add-btn {
        width: 100%;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        background-color: #FF0101;
        color: #fff;
        font-size: 32rpx;
        border-radius: 8px;
        opacity: 1;
        margin: 0 auto; // Center it if container is wider
    }
}
</style>
