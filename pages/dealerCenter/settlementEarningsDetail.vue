<template>
    <view class="container">
        <!-- 服务费列表 -->
        <view class="wrap-order" v-if="dataList.length > 0">
            <view class="list">
                <view class="item" v-for="(item, index) in dataList" :key="index">
                    <settlement-earnings-item-for-dealer :order="item" />
                </view>
            </view>
        </view>

        <!-- 空状态 -->
        <u-empty text="暂无数据" mode="order" v-else-if="!loading"></u-empty>

        <!-- 没有更多数据提示 -->
        <view class="no-more" v-if="dataList.length > 0">
            <text class="no-more-text">没有更多数据了</text>
        </view>
    </view>
</template>

<script>
import SettlementEarningsItemForDealer from '@/components/Hina/SettlementEarningsItemForDealer'
import { getSettlementInfoDetail } from '@/api/dealerCenter'

export default {
    name: 'settlementEarningsDetail',
    components: {
        SettlementEarningsItemForDealer
    },
    data() {
        return {
            id: '',
            type: '',
            pageTitle: '',
            dataList: [],
            allData: {
                recommendList: [], // 产品推荐服务费
                cityList: [], // 区域独家代理服务费
                provinceList: [] // 省级运营中心服务费
            },
            loading: false
        }
    },
    methods: {
        // 加载数据
        loadData() {
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
                        this.allData.recommendList = res.data.result.recommendList || []
                        this.allData.cityList = res.data.result.cityList || []
                        this.allData.provinceList = res.data.result.provinceList || []

                        // 根据type设置对应的数据
                        this.setDataByType()
                    } else {
                        uni.showToast({
                            title: res.data.message,
                            icon: 'none'
                        })
                    }
                })
                .catch((err) => {
                    this.loading = false
                    uni.hideLoading()
                    console.error('加载数据失败:', err)
                    uni.showToast({
                        title: '加载失败',
                        icon: 'none'
                    })
                })
        },

        // 根据类型设置数据
        setDataByType() {
            switch (this.type) {
                case 'recommend':
                    this.dataList = this.allData.recommendList
                    break
                case 'typeB':
                    this.dataList = this.allData.cityList
                    break
                case 'typeA':
                    this.dataList = this.allData.provinceList
                    break
                default:
                    this.dataList = []
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.loadData()
            setTimeout(() => {
                uni.stopPullDownRefresh()
            }, 1000)
        }
    },
    onLoad(options) {
        this.id = options.id
        this.type = options.type
        this.pageTitle = decodeURIComponent(options.title || '服务费明细')

        // 设置导航栏标题
        uni.setNavigationBarTitle({
            title: this.pageTitle
        })

        // 加载数据
        this.loadData()
    }
}
</script>

<style lang="scss" scoped>
.container {
    background: #f1f1f1;
    min-height: calc(100vh - var(--window-top));
    padding: 20rpx;
    .page-title {
        font-size: 32rpx;
        color: #333;
        font-weight: 600;
        text-align: center;
        margin-bottom: 20rpx;
    }

    .wrap-order {

        .list {
            padding: 0 0 20rpx;

            .item {
                margin: 0 0 20rpx;

                &:last-of-type {
                    margin: 0;
                }
            }
        }
    }

    .empty-state {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 400rpx;
        color: #999;
        font-size: 28rpx;
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
</style>
