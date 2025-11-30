<template>
    <view class="container">
        <!-- 订单列表 -->
        <view class="order-list" v-if="orderList.length > 0">
            <checkbox-group @change="onCheckboxChange">
                <view class="order-item" v-for="item in orderList" :key="item.id">
                    <view class="order-content">
                        <view class="order-header">
                            <text class="order-label">订单编号：</text>
                            <text class="order-number">{{ item.orderNumber }}</text>
                        </view>
                        <view class="order-info">
                            <view class="info-row">
                                <text class="label">订单金额：</text>
                                <text class="value">{{ item.orderTotalAmount }}</text>
                            </view>
                            <view class="info-row">
                                <text class="label">实付金额：</text>
                                <text class="value">{{ item.actualTotalAmount }}</text>
                            </view>
                            <view class="info-row">
                                <text class="label">积分兑换：</text>
                                <text class="value">{{ item.usePoints }}</text>
                            </view>
                            <view class="info-row">
                                <text class="label">订单运费：</text>
                                <text class="value">{{ item.orderTransportationAmount }}</text>
                            </view>
                            <view class="info-row">
                                <text class="label">完成时间：</text>
                                <text class="value">{{ item.orderFinishedTime }}</text>
                            </view>
                        </view>
                    </view>
                    <view class="checkbox-wrapper">
                        <checkbox :value="item.id" :checked="selectedOrderIds.includes(item.id)" class="custom-checkbox" activeBackgroundColor="#ee0a24" iconColor="#ffffff" />
                    </view>
                </view>
            </checkbox-group>

            <!-- 加载更多提示 -->
            <view class="load-more" v-if="loading && orderList.length > 0">
                <text>正在加载...</text>
            </view>

            <!-- 没有更多数据提示 -->
            <view class="no-more" v-if="!hasMore && orderList.length > 0">
                <text>没有更多数据了</text>
            </view>
        </view>

        <!-- 空数据状态 -->
        <view class="empty-container" v-if="!loading && orderList.length === 0 && !isFirstLoad">
            <u-empty text="暂无未结算订单" mode="order" margin-top="200"></u-empty>
        </view>

        <!-- 底部操作栏 -->
        <view class="bottom-bar">
            <view class="select-all" @tap="handleSelectAllTap">
                <checkbox :checked="isAllSelected" class="select-all-checkbox" activeBackgroundColor="#ee0a24" iconColor="#ffffff" />
                <text class="select-text">全选</text>
                <text class="count-text"
                    >已选择：<text class="selected-count">{{ selectedCount }}条订单</text></text
                >
            </view>
            <view class="generate-btn" :class="{ disabled: selectedCount === 0 || isGenerating }" @tap="generateSettlement">
                <text v-if="isGenerating" class="loading-icon">⏳</text>
                <text>{{ isGenerating ? '生成中...' : '生成结算单' }}</text>
            </view>
        </view>
    </view>
</template>

<script>
import { getNoSettlementOrderList, submitSettlement } from '@/api/dealerCenter'
import { getUserInfo } from '@/api/members'

export default {
    name: 'AddSettlement',
    data() {
        return {
            isGenerating: false, // 生成结算单loading状态
            selectedOrderIds: [], // 存储选中的订单ID
            orderList: [], // 订单列表数据
            // 分页相关参数
            params: {
                pageNumber: 1,
                pageSize: 10,
                orderDistributeStatus:'NOT_SETTLED'
            },
            loading: false, // 加载状态
            hasMore: true, // 是否还有更多数据
            total: 0, // 总数据量
            isFirstLoad: true // 是否首次加载
        }
    },
    computed: {
        selectedCount() {
            return this.selectedOrderIds.length
        },
        isAllSelected() {
            return this.orderList.length > 0 && this.selectedOrderIds.length === this.orderList.length
        }
    },
    methods: {
        // checkbox-group变化事件
        onCheckboxChange(e) {
            this.selectedOrderIds = e.detail.value
        },

        // 处理全选点击
        handleSelectAllTap() {
            if (this.isAllSelected) {
                // 当前是全选状态，点击后取消全选
                this.selectedOrderIds = []
            } else {
                // 当前不是全选状态，点击后全选
                this.selectedOrderIds = this.orderList.map((item) => item.id)
            }
        },

        // 生成结算单
        async generateSettlement() {
            if (this.selectedCount === 0) {
                uni.showToast({
                    title: '请选择至少一个订单',
                    icon: 'none'
                })
                return
            }
            if (this.isGenerating) {
                return // 防止重复点击
            }
            this.isGenerating = true
           let objInfo = {}
           // 获取个人信息接口
            await getUserInfo().then((user) => {
                if (user.data.success) {
                    objInfo = user.data.result
                }
			})
            // 判断是否需要验真
             if (objInfo.accountVerificationStatus == 'PENDING' || objInfo.accountVerificationStatus == 'IN_PROGRESS' || objInfo.accountVerificationStatus == 'TIMEOUT') {
                // 跳转到验真页面
                uni.navigateTo({
                    url: '/pages/dealerCenter/verify?source=1'
                })
                this.isGenerating = false
                return
            }
            submitSettlement({
                orderIds: this.selectedOrderIds
            }).then((res) => {
                if (res.data.success) {
                    this.isGenerating = false
                    uni.showToast({
                        title: `生成结算单成功`,
                        icon: 'success'
                    })
                    // 生成成功后返回上一页
                    setTimeout(() => {
                        uni.navigateBack()
                    }, 1500)
                } else {
                    this.isGenerating = false
                    that.$u.toast(res.data.message);
                }
            }).catch((err) => {
                this.isGenerating = false
                that.$u.toast(err.data.message);
            })
        },

        // 加载订单数据
        async loadOrderData(isLoadMore = false) {
            if (this.loading) return // 防止重复请求

            this.loading = true

            // 显示loading提示
            uni.showLoading({
                title: isLoadMore ? '加载更多...' : '加载中...'
            })

            try {
                const response = await getNoSettlementOrderList(this.params)
                const { records, total, pages } = response.data.result

                if (isLoadMore) {
                    // 加载更多时追加数据
                    this.orderList = [...this.orderList, ...records]
                } else {
                    // 首次加载或刷新时替换数据
                    this.orderList = records
                    this.isFirstLoad = false
                }

                this.total = total
                // 判断是否还有更多数据
                this.hasMore = this.params.pageNumber < pages
            } catch (error) {
                console.error('加载订单数据失败：', error)
                uni.showToast({
                    title: '加载订单数据失败',
                    icon: 'none'
                })
                this.isFirstLoad = false
            } finally {
                this.loading = false
                // 隐藏loading提示
                uni.hideLoading()
            }
        },

        // 加载更多数据
        loadMore() {
            if (!this.hasMore || this.loading) return
            this.params.pageNumber++
            this.loadOrderData(true)
        }
    },

    onLoad() {
        // 页面加载时从API获取订单数据
        this.loadOrderData()
    },

    // 触底加载更多
    onReachBottom() {
        this.loadMore()
    }
}
</script>

<style lang="scss" scoped>
.container {
    background: #f5f5f5;
    min-height: calc(100vh - 88rpx);
    padding-bottom: 120rpx; // 为底部操作栏留出空间
}

.header {
    background: #fff;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1rpx solid #eee;

    .title {
        font-size: 32rpx;
        font-weight: 600;
        color: #323233;
    }
}

.order-list {
    padding: 20rpx;
}

.order-item {
    background: #fff;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    padding: 24rpx;
    display: flex;
    align-items: flex-start;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
    position: relative;
}

.checkbox-wrapper {
    position: absolute;
    right: 24rpx;
    bottom: 24rpx;
}

.custom-checkbox {
    transform: scale(0.9);
}

.order-content {
    flex: 1;
    padding-right: 60rpx; // 为右下角的复选框留出空间
}

.order-header {
    margin-bottom: 16rpx;
    display: flex;
    align-items: center;

    .order-label {
        font-size: 28rpx;
        font-weight: normal;
        color: #ee0a24;
    }

    .order-number {
        font-size: 28rpx;
        font-weight: normal;
        color: #333;
    }
}

.order-info {
    font-size: 24rpx;
    color: #666;
    .info-row {
        display: flex;
        align-items: center;
        margin-bottom: 8rpx;

        &:last-child {
            margin-bottom: 0;
        }

        .label {
            font-size: 26rpx;
        }

        .value {
            font-size: 26rpx;
            flex: 1;
        }
    }
}

.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    height: 120rpx;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    border-top: 1rpx solid #eee;
    box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.select-all {
    flex: 1;
    display: flex;
    align-items: center;

    .select-all-checkbox {
        margin-right: 16rpx;
        transform: scale(0.9);
    }

    .select-all-checkbox[checked] {
        color: #ee0a24;
    }

    .select-text {
        font-size: 28rpx;
        color: #323233;
        margin-right: 16rpx;
    }

    .count-text {
        font-size: 24rpx;
        color: #666;

        .selected-count {
            color: #e22222;
            font-size: 28rpx;
        }
    }
}

.generate-btn {
    width: 200rpx;
    height: 64rpx;
    background: #e22222;
    border-radius: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    font-weight: 600;
    color: #fff;
    transition: all 0.2s;

    .loading-icon {
        margin-right: 8rpx;
        animation: rotate 1s linear infinite;
    }

    &.disabled {
        background: #ccc;
        color: #999;
    }

    &:not(.disabled):active {
        background: #d60a21;
    }
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

// 加载更多和无更多数据样式
.load-more,
.no-more {
    text-align: center;
    padding: 30rpx 0;
    font-size: 24rpx;
    color: #999;
}

.load-more {
    color: #666;
}

// 空数据容器样式
.empty-container {
    padding-top: 100rpx;
}
</style>
