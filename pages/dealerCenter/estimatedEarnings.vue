<template>
    <view class="container">
        <view class="wrap-info">
            <view>截止日期：{{ endDate }}</view>
            <view
                >待结算总额：<span class="num">￥{{ totalEstimatedRevenue }}</span></view
            >
        </view>
        <view class="box-null" v-if="isComplete && arrData.length == 0">
            <empty-box text="暂无待结算记录" />
        </view>
        <view class="box-list" v-if="isComplete && arrData.length > 0">
            <view class="item" v-for="(item, index) in arrData" :key="index">
                <settlement-earnings-item :settlement="item" :index="index" />
            </view>

            <!-- 加载更多提示 -->
            <view class="load-more" v-if="loading && arrData.length > 0">
                <text class="loading-text">正在加载...</text>
            </view>

            <!-- 没有更多数据提示 -->
            <view class="no-more" v-if="!hasMore && arrData.length > 0 && !loading">
                <text class="no-more-text">没有更多数据了</text>
            </view>
        </view>
    </view>
</template>

<script>
import EmptyBox from '@/components/Hina/EmptyBox'
import SettlementEarningsItem from '@/components/Hina/SettlementEarningsItem'
import { getEstimatedRevenue } from '@/api/dealerCenter'
export default {
    name: '',
    components: {
        EmptyBox,
        SettlementEarningsItem
    },
    data() {
        return {
            isComplete: false,
            arrData: [],
            intPageCode: 1, // 当前页面
            intResTotal: 0, // 记录总数
            loading: false, // 加载状态
            hasMore: true, // 是否还有更多数据
            params: {
                pageNumber: 1,
                pageSize: 10
            },
            totalEstimatedRevenue: 0, //待结算总额
            endDate: '' //截止日期
        }
    },
    methods: {
        // 加载待结算信息
        loadBaseData: function () {
            this.isComplete = true
            this.loading = true
            uni.showLoading({})
            getEstimatedRevenue(this.params)
                .then((res) => {
                    uni.hideLoading()
                    this.loading = false
                    if (res.data.code == 200) {
                        this.totalEstimatedRevenue = res.data.result.totalEstimatedRevenue
                        this.endDate = res.data.result.endDate
                        const records = res.data.result.detailList || []

                        // 如果是第一页，清空数组；否则追加数据
                        if (this.params.pageNumber === 1) {
                            this.arrData = records
                        } else {
                            records.forEach((item) => {
                                this.arrData.push(item)
                            })
                        }

                        this.intResTotal = res.data.result.total || records.length

                        // 判断是否还有更多数据
                        this.hasMore = this.arrData.length < this.intResTotal
                    }
                })
                .catch((error) => {
                    uni.hideLoading()
                    this.loading = false
                    console.error('加载数据失败:', error)
                })
        }
    },
    onLoad: function () {
        // 加载结算信息
        this.loadBaseData()
    },
    onShow: function () {},
    onReachBottom: function () {
        if (this.hasMore && !this.loading && this.intResTotal > this.arrData.length) {
            this.params.pageNumber++
            this.loadBaseData()
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    background: #f1f1f1;
    min-height: calc(100vh - var(--window-top));
    box-sizing: border-box;
    padding: 0 0 20rpx;
    .wrap-info {
        padding: 20rpx 20rpx 0;
        font-size: 24rpx;
        color: #666;
        .num {
            color: #e22222;
            font-size: 28rpx;
        }
    }
    .box-list {
        padding: 20rpx 20rpx 0;
        .item {
            position: relative;
            margin: 20rpx 0 0;
            &:first-of-type {
                margin: 0;
            }
        }

        // 加载更多样式
        .load-more {
            padding: 30rpx 0;
            text-align: center;

            .loading-text {
                font-size: 26rpx;
                color: #969799;
            }
        }

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
}
</style>
