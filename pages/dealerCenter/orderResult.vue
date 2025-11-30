<template>
	<view class="container">
		<view class="box-tips" v-if="isComplete && objData.arrData.length > 0">
			<image class="ico" :src="iconTips" mode="aspectFit"></image>
			<view class="txt">累计</view>
			<view class="num">{{ objData.orderTotal }}</view>
			<view class="txt">笔交易，</view>
			<view class="txt">累计交易额</view>
			<view class="num">{{ objData.orderTotalMoney | unitPrice }}</view>
		</view>
		<view class="box-null" v-if="isComplete && objData.arrData.length == 0">
			<empty-box text="暂无订单记录" />
		</view>
		<view class="box-list" v-if="isComplete && objData.arrData.length > 0">
			<view class="item" v-for="(item, index) in objData.arrData" :key="index">
				<order-item :order="item" :goods="item.orderItemList" :total="item.total" :index="index"
					@detail="handlerDetail" />
			</view>
		</view>
	</view>
</template>

<script>
import EmptyBox from "@/components/Hina/EmptyBox";
import OrderItem from "@/components/Hina/OrderItemForDealer";
import { statisticsByDate } from "@/api/dealerCenter";
export default {
	name: '',
	components: {
		EmptyBox,
		OrderItem
	},
	data() {
		return {
			isComplete: false,
			iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,

			objData: {
				orderTotal: 0,					// 订单数量
				orderTotalMoney: 0,			// 订单总额
				arrData: []
			},
			intPageCode: 1,						// 当前页面
			intResTotal: 0,						// 记录总数
			params: {}
		}
	},
	methods: {

		// 加载订单信息
		loadBaseData: function () {
			this.isComplete = true
			uni.showLoading({
				title: '加载中...'
			})
			statisticsByDate(this.params).then(res => {
				let data = res.data
				if (data.code = 200 && data.success) {
					let orderItemListdata = []
					orderItemListdata = data.result.orderItemList.map(item => {
						let total = 0
						item.orderStatusText = this.handleOrderStatus(item.orderStatus)
						item.orderItemList = item.orderItemList.map(res => {
							res.name = res.goodsName
							total = total + res.flowPrice
							return res
						})
						item.total = total
						return item
					})
					this.objData = {
						orderTotal: data.result.orderNumber,
						orderTotalMoney: data.result.orderAmount,
						arrData: orderItemListdata
					}
				}
			})
		},

		// 跳转订单详情
		handlerDetail: function (e) {
			let eId = this.objData.arrData[e.index].sn 		// 获取订单ID
			uni.navigateTo({
				url: `/pages/dealerCenter/orderDetail?orderSn=${eId}`
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

				default:
					break;
			}
		}
	},
	onLoad: function (option) {
		if (option.createTime != '') {
			this.params.createTime = option.createTime
		}
		if (option.endTime != '') {
			this.params.endTime = option.endTime
		}
		// 加载订单信息t
		this.loadBaseData()
	},
	onShow: function () {

	},
	onReachBottom: function () {
		if (this.intResTotal > this.objData.arrData.length) {
			this.intPageCode++
			this.loadBaseData()
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	box-sizing: border-box;
	min-height: 100vh;
	padding: 0 0 20rpx;

	.box-tips {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 24rpx;
		height: 88rpx;
		line-height: 88rpx;
		margin: 0 20rpx;

		.ico {
			width: 32rpx;
			height: 32rpx;
			margin: 0 16rpx 0 0;
		}

		.txt {
			color: #888;
		}

		.num {
			color: #E22221;
		}
	}

	.box-list {
		padding: 0 20rpx;

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