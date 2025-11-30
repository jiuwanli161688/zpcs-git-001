<template>
	<view class="container">
		<!-- List -->
		<view class="list-content">
			<view class="item" v-for="(item, index) in filteredData" :key="index" @tap="handlerDetail(item)">
				<view class="row">
					<text class="label">结算单号</text>
					<text class="value">{{ item.settlementNo }}</text>
				</view>
				<view class="row">
					<text class="label">创建时间</text>
					<text class="value">{{ item.createTime }}</text>
				</view>
				<view class="row">
					<text class="label">交易金额</text>
					<text class="value">¥ {{ item.amount }}</text>
				</view>
				<view class="row">
					<text class="label">待结金额</text>
					<text class="value">¥ {{ item.pendingAmount }}</text>
				</view>
				<view class="row">
					<text class="label">结算状态</text>
					<text class="value">{{ item.status }}</text>
				</view>
			</view>
            <view class="box-null" v-if="filteredData.length == 0">
                <u-empty text="暂无数据" mode="list"></u-empty>
            </view>
		</view>

        <!-- Bottom Button -->
        <view class="bottom-bar">
            <view class="btn-add" @tap="handlerAdd">新增商圈结算单</view>
        </view>

		<!-- Filter Popup -->
		<u-popup v-model="showFilter" mode="top" border-radius="24" :mask-close-able="true">
			<view class="popup-content">
                <view class="filter-header">
                    <text class="title">全部</text>
                    <u-icon name="checkmark-circle-fill" color="#FF0101" size="40" v-if="curFilter === '全部'"></u-icon>
                </view>
				<view class="filter-list">
					<view class="filter-item" :class="{ active: curFilter === item }" v-for="(item, index) in filterOptions" :key="index" @tap="selectFilter(item)">
						{{ item }}
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import iconFilter from '@/static/cbd/filter.png';

export default {
	data() {
		return {
			showFilter: false,
            curFilter: '全部',
            filterOptions: [
                '全部',
                '待提交账单',
                '待初审账单',
                '待上传发票',
                '待复审账单',
                '待银行转账',
                '待重发转账',
                '已完成结算'
            ],
			arrData: [
                // Mock Data
				{
					settlementNo: 'JS230002222',
					createTime: '2025-10-28 20:30:48',
					amount: '100.00',
					pendingAmount: '100.00',
					status: '待提交账单'
				},
				{
					settlementNo: 'JS230002223',
					createTime: '2025-10-28 20:30:48',
					amount: '100.00',
					pendingAmount: '100.00',
					status: '待初审账单'
				},
                {
					settlementNo: 'JS230002224',
					createTime: '2025-10-28 20:30:48',
					amount: '100.00',
					pendingAmount: '100.00',
					status: '待上传发票'
				},
                {
					settlementNo: 'JS230002225',
					createTime: '2025-10-28 20:30:48',
					amount: '100.00',
					pendingAmount: '100.00',
					status: '待复审账单'
				},
                {
					settlementNo: 'JS230002226',
					createTime: '2025-10-28 20:30:48',
					amount: '100.00',
					pendingAmount: '100.00',
					status: '待重发转账'
				},
                {
					settlementNo: 'JS230002227',
					createTime: '2025-10-28 20:30:48',
					amount: '100.00',
					pendingAmount: '0.00',
					status: '已完成结算'
				}
			]
		};
	},
    computed: {
        filteredData() {
            if (this.curFilter === '全部') {
                return this.arrData;
            }
            return this.arrData.filter(item => item.status === this.curFilter);
        }
    },
	methods: {
        // Navigation Bar Button Tap
        onNavigationBarButtonTap(e) {
            if (e.text === '筛选' || e.index === 0) {
                this.showFilter = !this.showFilter;
            }
        },
        selectFilter(item) {
            this.curFilter = item;
            this.showFilter = false;
        },
        handlerAdd() {
            this.$u.toast('新增商圈结算单');
        },
        handlerDetail(item) {
            uni.navigateTo({
                url: `/pages/service/settlement/detail?data=${encodeURIComponent(JSON.stringify(item))}`
            });
        },
        getStatusKey(statusText) {
            const map = {
                '待提交账单': 'pending_submit',
                '待初审账单': 'pending_audit',
                '待上传发票': 'pending_invoice',
                '待复审账单': 'pending_reaudit',
                '待重发转账': 'pending_resend',
                '已完成结算': 'completed'
            };
            return map[statusText] || 'pending_submit';
        }
	},
    onLoad() {
        // Listen for status updates from detail page
        uni.$on('updateSettlementStatus', (data) => {
            const index = this.arrData.findIndex(item => item.settlementNo === data.settlementNo);
            if (index !== -1) {
                // Update status text based on key
                const statusMap = {
                    'pending_submit': '待提交账单',
                    'pending_audit': '待初审账单',
                    'pending_invoice': '待上传发票',
                    'pending_reaudit': '待复审账单',
                    'pending_resend': '待重发转账',
                    'completed': '已完成结算'
                };
                this.arrData[index].status = statusMap[data.status] || this.arrData[index].status;
            }
        });
    },
    onUnload() {
        uni.$off('updateSettlementStatus');
    }
}
</script>

<style lang="scss" scoped>
.container {
	background: #F8F8F8;
	min-height: 100vh;
    padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));

	.list-content {
		padding: 20rpx;

		.item {
			background: #fff;
			border-radius: 16rpx;
			padding: 20rpx;
			margin-bottom: 20rpx;

			.row {
				display: flex;
				justify-content: space-between;
				margin-bottom: 16rpx;
				font-size: 26rpx;

				&:last-child {
					margin-bottom: 0;
				}

				.label {
					color: #333;
				}

				.value {
					color: #999999;
                    text-align: right;
                    flex: 1;
                    margin-left: 20rpx;
				}
			}
		}
	}

    .bottom-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #fff;
        padding: 20rpx 30rpx;
        padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
        padding-bottom: calc(20rpx + env(safe-area-inset-bottom));

        .btn-add {
            height: 88rpx;
            line-height: 88rpx;
            background: #FF0101;
            color: #fff;
            text-align: center;
            border-radius: 14rpx;
            font-size: 32rpx;
        }
    }

	.popup-content {
		padding: 30rpx;
        background: #fff;

        .filter-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20rpx 0;
            border-bottom: 1rpx solid #eee;
            margin-bottom: 20rpx;

            .title {
                font-size: 32rpx;
                font-weight: bold;
            }
        }

		.filter-list {
            .filter-item {
                padding: 20rpx 0;
                font-size: 28rpx;
                color: #666;
                border-bottom: 1rpx solid #f5f5f5;

                &.active {
                    color: #FF0101;
                }

                &:last-child {
                    border-bottom: none;
                }
            }
		}
	}
}
</style>
