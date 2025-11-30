<template>
  <view class="container">
    <!-- Custom Header -->
    <view class="custom-header">
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <view class="nav-bar">
        <view class="left-icon" @click="goBack">
          <u-icon name="arrow-left" color="#333" size="40"></u-icon>
        </view>
        <view class="title">相册管理</view>
        
        <!-- Normal Mode Actions -->
        <view class="right-actions" v-if="!isManaging">
            <view class="action-btn" @click="handleAdd">
                <u-icon name="plus-circle" color="#333" size="32"></u-icon>
                <text>添加</text>
            </view>
            <view class="action-btn" @click="toggleManage">
                <u-icon name="setting" color="#333" size="32"></u-icon>
                <text>管理</text>
            </view>
        </view>
        
        <!-- Management Mode Actions -->
        <view class="right-actions" v-else>
            <view class="action-btn" @click="handleSelectAll">
                <u-icon :name="isAllSelected ? 'checkmark-circle-fill' : 'checkmark-circle'" :color="isAllSelected ? '#FF0101' : '#333'" size="32"></u-icon>
                <text>全选</text>
            </view>
            <view class="action-btn" @click="toggleManage">
                <u-icon name="checkmark" color="#333" size="32"></u-icon>
                <text>完成</text>
            </view>
        </view>
      </view>
    </view>

    <!-- Content Wrapper -->
    <view class="content-wrapper" :style="{ paddingTop: (statusBarHeight + 44) + 'px' }">
        <view class="grid-list">
            <view class="grid-item" 
                  v-for="(item, index) in list" 
                  :key="index"
                  :class="{ selected: isSelected(index) }"
                  @click="handleItemClick(index)">
                
                <image class="photo" :src="item.img || '/static/cbd/workbench/default_album.png'" mode="aspectFill"></image>
                
                <!-- Selection Overlay (Management Mode) -->
                <view class="selection-overlay" v-if="isManaging">
                    <view class="select-circle" :class="{ active: isSelected(index) }">
                        <text v-if="isSelected(index)">{{ getSelectionOrder(index) }}</text>
                    </view>
                </view>
                
                <!-- Unselected Mask (Management Mode) -->
                <view class="unselected-mask" v-if="isManaging && !isSelected(index)"></view>
                
                <!-- Status Overlays (Normal Mode) -->
                <template v-else>
                    <!-- Pending Overlay -->
                    <view class="status-overlay pending" v-if="item.status === 'pending'">
                        <text>待审核通过后可公开浏览</text>
                    </view>
                    
                    <!-- Failed Overlay -->
                    <view class="status-overlay failed" v-if="item.status === 'failed'">
                        <text>该照片未通过审核</text>
                    </view>
                </template>
            </view>
        </view>
    </view>

    <!-- Bottom Button -->
    <view class="bottom-area">
        <view class="clear-btn" v-if="!isManaging" @click="handleClear">一键清理未过审照片</view>
        
        <!-- Management Bottom Bar -->
        <view class="manage-bottom" v-else>
            <view class="count">已选中 <text class="num">{{ selectedIndices.length }}</text> 张照片</view>
            <view class="delete-btn" @click="handleDeleteSelected">删除照片</view>
        </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 20,
      isManaging: false,
      selectedIndices: [], // Stores indices in order of selection
      list: [
        { status: 'pending', img: '/static/cbd/workbench/album/img1.png' },
        { status: 'pending', img: '/static/cbd/workbench/album/img2.png' },
        { status: 'failed', img: '/static/cbd/workbench/album/img3.png' },
        { status: 'normal', img: '/static/cbd/workbench/album/img4.png' },
        { status: 'normal', img: '/static/cbd/workbench/album/img5.png' },
        { status: 'normal', img: '/static/cbd/workbench/album/img6.png' }
      ]
    };
  },
  computed: {
      isAllSelected() {
          return this.list.length > 0 && this.selectedIndices.length === this.list.length;
      }
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.statusBarHeight = systemInfo.statusBarHeight;
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    handleAdd() {
        console.log('Add Photo');
    },
    toggleManage() {
        this.isManaging = !this.isManaging;
        if (!this.isManaging) {
            this.selectedIndices = [];
        }
    },
    handleClear() {
        console.log('Clear Failed Photos');
    },
    handleItemClick(index) {
        if (!this.isManaging) return;
        
        const selectedIndex = this.selectedIndices.indexOf(index);
        if (selectedIndex > -1) {
            // Deselect: Remove from array
            this.selectedIndices.splice(selectedIndex, 1);
        } else {
            // Select: Add to end of array
            this.selectedIndices.push(index);
        }
    },
    isSelected(index) {
        return this.selectedIndices.includes(index);
    },
    getSelectionOrder(index) {
        return this.selectedIndices.indexOf(index) + 1;
    },
    handleSelectAll() {
        if (this.isAllSelected) {
            this.selectedIndices = [];
        } else {
            this.selectedIndices = this.list.map((_, index) => index);
        }
    },
    handleDeleteSelected() {
        if (this.selectedIndices.length === 0) return;
        
        uni.showModal({
            title: '提示',
            content: `确定删除选中的 ${this.selectedIndices.length} 张照片吗？`,
            success: (res) => {
                if (res.confirm) {
                    // Sort indices descending to delete correctly
                    const sortedIndices = [...this.selectedIndices].sort((a, b) => b - a);
                    sortedIndices.forEach(index => {
                        this.list.splice(index, 1);
                    });
                    this.selectedIndices = [];
                    // Keep management mode on or turn off? Usually keep on or user clicks Done.
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
  background-color: #fff;
  padding-bottom: 180rpx;
}

.custom-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background-color: #fff;

  .nav-bar {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0 30rpx;

    .left-icon {
      position: absolute;
      left: 30rpx;
      display: flex;
      align-items: center;
      height: 100%;
    }

    .title {
      color: #333;
      font-size: 36rpx;
      font-weight: bold;
    }
    
    .right-actions {
        position: absolute;
        right: 30rpx;
        display: flex;
        align-items: center;
        
        .action-btn {
            display: flex;
            align-items: center;
            margin-left: 20rpx;
            
            text {
                font-size: 28rpx;
                color: #333;
                margin-left: 4rpx;
            }
        }
    }
  }
}

.grid-list {
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx;
    justify-content: space-between;
    
    .grid-item {
        width: 345rpx; // (750 - 40 - 20) / 2 approx
        height: 345rpx;
        margin-bottom: 20rpx;
        border-radius: 20rpx;
        overflow: hidden;
        position: relative;
        background-color: #eee;
        box-sizing: border-box;
        
        &.selected {
            border: 4rpx solid #FF0101;
        }
        
        .photo {
            width: 100%;
            height: 100%;
            display: block;
        }
        
        .status-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 60rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24rpx;
            color: #fff;
            
            &.pending {
                background: rgba(0, 0, 0, 0.49);
                border-radius: 0px 0px 10px 10px;
            }
            
            &.failed {
                background-color: rgba(255, 0, 0, 0.6); // Red overlay
            }
        }
        
        .selection-overlay {
            position: absolute;
            top: 20rpx;
            right: 20rpx;
            z-index: 10;
            
            .select-circle {
                width: 60rpx; // 10px
                height: 60rpx; // 10px
                border-radius: 50%;
                border: 2rpx solid #fff;
                background-color: rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                
                &.active {
                    background-color: #FF0101;
                    border-color: #fff; // User said border 1px solid #FFFFFF
                    
                    text {
                        color: #fff;
                        font-size: 32rpx; // Adjusted for smaller size
                        line-height: 1;
                    }
                }
            }
        }
        
        .unselected-mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(216, 216, 216, 0.52);
            z-index: 5;
            pointer-events: none; // Allow clicks to pass through to grid-item
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
    
    .clear-btn {
        width: 100%;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        background-color: #FF0101;
        color: #fff;
        font-size: 32rpx;
        border-radius: 16rpx;
        font-weight: bold;
    }
    
    .manage-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 88rpx;
        
        .count {
            font-size: 30rpx;
            color: #333;
            
            .num {
                color: #FF0101;
            }
        }
        
        .delete-btn {
            width: 200rpx;
            height: 80rpx;
            line-height: 80rpx;
            text-align: center;
            background-color: #FF0101;
            color: #fff;
            font-size: 30rpx;
            border-radius: 10rpx;
        }
    }
}
</style>
