<template>
    <view class="container">
        <!-- 订单列表 -->
        <view class="order-list" v-if="orderList.length > 0">
            <SettlementOrderItem v-for="(item, index) in orderList" :key="index" :orderData="item" />
        </view>

        <!-- 空状态 -->
        <u-empty text="暂无订单数据" mode="order" v-else-if="!loading"></u-empty>

        <!-- 没有更多数据提示 -->
        <view class="no-more" v-if="orderList.length > 0">
            <text class="no-more-text">没有更多数据了</text>
        </view>
    </view>
</template>

<script>
import { getSettlementInfoDetail } from '@/api/dealerCenter'
import SettlementOrderItem from '@/components/Hina/SettlementOrderItemForDealer.vue'

export default {
    name: 'SettlementOrderDetail',
    components: {
        SettlementOrderItem
    },
    data() {
        return {
            id: '',
            orderList: [],
            loading: false
        }
    },
    methods: {
        // 加载订单数据
        loadOrderData() {
            if (this.loading) return

            this.loading = true

            // 显示加载提示
            uni.showLoading({
                title: '加载中...',
                mask: true
            })

            getSettlementInfoDetail({
                id: this.id
            })
                .then((res) => {
                    this.loading = false
                    uni.hideLoading()

                    if (res.data.code == 200) {
                        const result = res.data.result
                        this.orderList = result.settlementOrderVOS || []
                    } else {
                        uni.showToast({
                            title: res.data.message || '加载失败',
                            icon: 'none'
                        })
                    }
                })
                .catch((err) => {
                    this.loading = false
                    uni.hideLoading()
                    console.error('加载订单数据失败:', err)
                    uni.showToast({
                        title: '网络异常，请重试',
                        icon: 'none'
                    })
                })
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.loadOrderData()
            setTimeout(() => {
                uni.stopPullDownRefresh()
            }, 1000)
        }
    },

    onLoad(options) {
        this.id = options.id || ''
        this.loadOrderData()
    }
}
</script>

<style lang="scss" scoped>
.container {
    background: #f1f1f1;
    min-height: calc(100vh - var(--window-top));
    padding: 20rpx;

    // 没有更多数据样式
    .no-more {
        padding: 30rpx 0;
        text-align: center;

        .no-more-text {
            font-size: 26rpx;
            color: #969799;
        }
    }
}
</style>
