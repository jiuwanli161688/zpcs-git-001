<template>
	<view class="container">
		<scroll-view class="tab-comm" :style="{ top: `${envWinTopPX}px` }" scroll-x="true" show-scrollbar="false">
			<view class="tab-container">
				<view class="item" :class="{ 'item-hov': curTab == index }" v-for="(item, index) in arrTab" :key="index"
					:data-index="index" @tap="handlerChange">
					<view class="text">{{ item.name }}</view>
				</view>
			</view>
		</scroll-view>
		<view class="box-null" v-if="isComplete && arrData.length == 0">
			<empty-box text="暂无订单记录" />
		</view>
		<view class="box-list">
			<view class="item" v-for="(item, index) in arrData" :key="index">
				<order-item :order="item" :goods="item.orderItem" :total="item.flowPrice" :index="index"
					@detail="handlerDetail" />
			</view>
		</view>
	</view>
</template>

<script>
import EmptyBox from "@/components/Hina/EmptyBox";
import OrderItem from "@/components/Hina/OrderItemForDealer";
import { cancelOrder, confirmReceipt } from '@/api/order.js'
import { getOrder } from "@/api/dealerCenter";
export default {
	name: '',
	components: {
		EmptyBox,
		OrderItem
	},
	data() {
		return {
			isComplete: false,
			arrTab: [
				{ tag: 'ALL', name: '全部' },
				{ tag: 'WAIT_PAY', name: '待付款' },
				{ tag: 'WAIT_SEND', name: '待发货' },
				{ tag: 'WAIT_TAKE', name: '待收货' },
				{ tag: 'WAIT_EVALUATE', name: '待评价' },
				{ tag: 'CANCEL', name: '已取消' },
				{ tag: 'COMPLETED', name: '已完成' },
			],
			curTab: 0,
			customFlag: false,
			arrData: [],
			intResTotal: 0,						// 记录总数
			params: {
				pageNumber: 1,
				pageSize: 10
			},
			type: 'SOLD',
			envWinTopPX: 0,// 导航栏高度

		}
	},
	methods: {

		// 切换查询类型
		handlerChange: function (e) {
			let eIndex = e.currentTarget.dataset.index
			this.curTab = eIndex
			this.arrData.splice(0, this.arrData.length)
			this.params.pageNumber = 1
			this.loadBaseData()
		},

		// 加载订单信息
		loadBaseData: function () {
			uni.showLoading()
			let orderStatus = this.arrTab[this.curTab].tag			// 查询类型
			let params = { ...this.params, tag: orderStatus, customFlag: this.customFlag, type: this.type }
			getOrder(params).then((res) => {
				if (this.$store.state.isShowToast) {
					uni.hideLoading()
				}
				if (res.data.code == 200) {
					this.isComplete = true
					let data = res.data.result.records;
					data.forEach(item => {
						item.orderStatusText = this.handleOrderStatus(item.orderStatus)
					});
					if (data.length > 0) {
						this.arrData.push(...data);
					}
					this.intResTotal = res.data.result.total
				}
			})

		},
		// 处理订单状态
		handleOrderStatus(orderStatus) {
			switch (orderStatus) {
				case 'UNPAID':
					return '未付款'
					break;
				case 'PAID':
					return '已付款'
					break;
				case 'UNDELIVERED':
					return '待发货'
					break;
				case 'DELIVERED':
					return '已发货'
					break;
				case 'COMPLETED':
					return '已完成'
					break;
				case 'CANCEL':
					return '已取消'
					break;
				case 'CANCELLED':
					return '已关闭'
					break;
				case 'FINISH':
					return '已结束'
					break;

				default:
					break;
			}
		},
		// 跳转订单详情
		handlerDetail: function (e) {
			let eId = this.arrData[e.index].sn 		// 获取订单ID
			uni.navigateTo({
				url: '/pages/dealerCenter/orderDetail?orderSn=' + eId
			})
		},
	},
	onLoad: function (options) {
		this.envWinTopPX = uni.getWindowInfo().windowTop
		this.type = options.type
		this.curTab = options.state
		if (this.type == "RECOMMEND") {
			uni.setNavigationBarTitle({
				title: '推荐订单'
			})
		}
		if (!this.curTab) {
			this.curTab = 0
		}

		this.customFlag = options.customFlag
	},
	onShow: function () {
		this.arrData = []
		this.params.pageNumber = 1
		this.params.pageSize = uni.getStorageSync("pageConfig")?.orderListSize || 10;
		// 加载订单信息
		this.loadBaseData()

	},
	onReachBottom: function () {
		if (this.intResTotal > this.arrData.length) {
			this.params.pageNumber++
			this.loadBaseData()
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;
	padding: 0 0 20rpx;

	.tab-comm {
		position: sticky;
		left: 0;
		right: 0;
		z-index: 999;
		background: #F1F1F1;
		padding: 20rpx 0;

		/* 隐藏滚动条 */
		::-webkit-scrollbar {
			display: none;
			width: 0;
			height: 0;
		}

		.tab-container {
			display: inline-flex;
			align-items: center;
			padding: 0 20rpx;
		}

		.item {
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #fff;
			padding: 8rpx 20rpx;
			border-radius: 10rpx;
			white-space: nowrap;
			flex-shrink: 0;
			transition: all 0.3s ease;
			font-size: 28rpx;
			margin-right: 20rpx;

			&:last-child {
				margin-right: 0;
			}

			.text {
				font-size: 28rpx;
				color: #333333;
				transition: color 0.3s ease;
			}
		}

		.item-hov {
			background-color: #FFE6E6;

			.text {
				color: #F10100;
				font-weight: 400;
			}
		}
	}

	.box-list {
		padding: 0 20rpx 0;

		.item {
			position: relative;
			margin: 20rpx 0 0;

			&:first-of-type {
				margin: 0;
			}
		}
	}
}
</style>
