<template>
	<view class="container">
		<view class="tab-comm" :style="{ top: `${envWinTopPX}px` }">
			<view class="item" :class="{ 'item-hov': curTab == index }" v-for="(item, index) in arrTab" :key="index"
				:data-index="index" @tap="handlerChange">
				<view class="text">{{ item.name }}</view>
			</view>
		</view>
		<view class="box-null" v-if="isComplete && arrData.length == 0">
			<empty-box text="暂无评价记录" />
		</view>
		<view class="box-list">
			<view class="item" v-for="(item, index) in arrData" :key="index">
				<comment-item :order="item" :goods="item.orderItems" :total="item.flowPrice" :index="index"
					@insert="handlerInsert" @update="handlerUpdate" @detail="handlerDetail" @shop="shopDetail" />
			</view>
		</view>
	</view>
</template>

<script>

import EmptyBox from "@/components/Hina/EmptyBox";
import CommentItem from "@/components/Hina/CommentItem";
import { getOrderList } from '@/api/order.js'
export default {
	name: "",
	components: {
		EmptyBox,
		CommentItem
	},
	data() {
		return {
			isComplete: false,
			arrTab: [
				{ commentStatus: '', name: '全部' },
				{ commentStatus: 'UNFINISHED_AND_REJECTED', name: '待评价' },
				{ commentStatus: 'WAIT_AUDIT', name: '待审核' },
				{ commentStatus: 'FINISHED', name: '已评价' }
			],
			curTab: 0,

			arrData: [],
			intPageCode: 1,						// 当前页面
			intResTotal: 0,						// 记录总数
			params: {
				pageNumber: 1,
				pageSize: 10
			},
			envWinTopPX: 0,// 导航栏高度
		}
	},
	methods: {
		// 切换查询类型
		handlerChange: function (e) {
			let eIndex = e.currentTarget.dataset.index
			this.curTab = eIndex
			this.params.pageNumber = 1
			this.arrData.splice(0, this.arrData.length)
			this.loadBaseData()
		},

		//跳转商品详情
		shopDetail: function (e) {
			let eId = this.arrData[e.index].sn 		// 获取订单ID
			uni.navigateTo({
				url: '/pages/profile/order/detail?orderSn=' + eId
			})
		},

		// 跳转发表评价
		handlerInsert: function (e) {
			let eId = this.arrData[e.index].sn 		// 获取订单ID
			uni.navigateTo({
				url: '/pages/profile/comment/insert?orderSn=' + eId + '&type=add'
			})
		},
		// 跳转评价详情
		handlerDetail: function (e) {
			let eId = this.arrData[e.index].sn 		// 获取订单ID
			uni.navigateTo({
				url: '/pages/profile/comment/detail?orderSn=' + eId
			})
		},
		// 跳转修改评价
		handlerUpdate: function (e) {
			let eId = this.arrData[e.index].sn 		// 获取订单ID
			uni.navigateTo({
				url: '/pages/profile/comment/insert?orderSn=' + eId + '&type=update'
			})
		},

		// 加载订单信息
		loadBaseData: function () {
			let commentStatus = this.arrTab[this.curTab].commentStatus				// 查询类型
			let params = { ...this.params, commentStatus: commentStatus, orderStatus: 'COMPLETED_AND_FINISH' }
			uni.showLoading({
				title: "加载中",
			});
			getOrderList(params).then((res) => {
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
				case 'FINISH':
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
		},
	},
	onLoad: function (options) {
		this.envWinTopPX = uni.getWindowInfo().windowTop
	},
	onShow: function () {
		this.arrData = []
		this.params.pageNumber = 1
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
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		/* 隐藏滚动条 */
		::-webkit-scrollbar {
			display: none;
			width: 0;
			height: 0;
		}

		.item {
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #fff;
			padding: 10rpx 40rpx;
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