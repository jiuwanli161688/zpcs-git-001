<template>
	<view class="container">
		<view v-if="source === 'updateOrder'" class="tip-banner">选择订单，进入订单详情修改订单。</view>
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
				<order-item :order="item" :goods="item.orderItems" :total="item.flowPrice" :index="index"
					@cancel="handlerCancel" @pay="handlerPay" @confirm="handlerConfirm" @comment="handlerComment"
					@detail="handlerDetail" @commentDetail="handlerCommentDetail" @invoice="handlerInvoice"
					@invoiceReopen="handlerInvoiceReopen" @invoiceDetail="handlerInvoiceDetail"
					@updateDetail="handlerUpdateDetail" @urge="handlerUrge" />
			</view>
		</view>
	</view>
</template>

<script>
import EmptyBox from "@/components/Hina/EmptyBox";
import OrderItem from "@/components/Hina/OrderItemForUser";
import { getOrderList, cancelOrder, confirmReceipt, urgeOrder } from '@/api/order.js'
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
				{ orderStatus: 'CANCEL', name: '已取消' },
				{ tag: 'WAIT_EVALUATE', name: '待评价' },
			],
			curTab: 0,
			customFlag: false,
			arrData: [],
			intResTotal: 0,						// 记录总数
			params: {
				pageNumber: 1,
				pageSize: 10
			},
			envWinTopPX: 0,// 导航栏高度
			source: '',
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
			let tag = this.arrTab[this.curTab].tag			// 查询类型
			let orderStatus = this.arrTab[this.curTab].orderStatus
			let params = { ...this.params, tag: tag, orderStatus: orderStatus, customFlag: this.customFlag }
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
		// 跳转订单详情
		handlerDetail: function (e) {
			let eId = this.arrData[e.index].sn 		// 获取订单ID
			uni.navigateTo({
				url: '/pages/profile/order/detail?orderSn=' + eId
			})
		},
		//跳转修改评价
		handlerUpdateDetail: function (e) {
			let eId = this.arrData[e.index].sn
			uni.navigateTo({
				url: '/pages/profile/comment/insert?orderSn=' + eId + '&type=update'
			})
		},
		// 跳转商品评价
		handlerComment: function (e) {
			let eId = this.arrData[e.index].sn 		// 获取订单ID
			uni.navigateTo({
				url: '/pages/profile/comment/insert?orderSn=' + eId + '&type=add'
			})
		},
		// 跳转商品评价详情
		handlerCommentDetail: function (e) {
			let eId = this.arrData[e.index].sn 		// 获取订单ID
			uni.navigateTo({
				url: '/pages/profile/comment/detail?orderSn=' + eId
			})
		},
		// 跳转申请开票
		handlerInvoice: function (e) {
			let eId = this.arrData[e.index].sn 		// 获取订单ID
			uni.navigateTo({
				url: '/pages/profile/invoice/apply?orderSn=' + eId
			})
		},
		// 跳转重开发票
		handlerInvoiceReopen(e) {
			let eId = this.arrData[e.index].sn 		// 获取订单ID
			uni.navigateTo({
				url: '/pages/profile/invoice/reopen?orderSn=' + eId
			})
		},
		// 跳转发票详情
		handlerInvoiceDetail(e) {
			let eId = this.arrData[e.index].sn 		// 获取订单ID
			uni.navigateTo({
				url: '/pages/profile/invoice/detail?orderSn=' + eId
			})
		},

		// 执行取消操作
		handlerCancel: function (e) {
			let eId = this.arrData[e.index].sn 		// 获取订单ID
			uni.showModal({
				title: "谨慎操作",
				content: "您确定要取消订单吗？",
				confirmText: "确定",
				confirmColor: "#FF0000",
				cancelText: "取消",
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: "取消中",
							mask: true
						})
						cancelOrder({ orderSn: eId }).then((res) => {
							uni.hideLoading()
							if (res.data.success) {
								this.arrData.splice(e.index, 1)
								uni.showToast({
									title: "已取消",
									duration: 2000,
									icon: "none",
								});
							} else {
								uni.showToast({
									title: res.data.message,
									duration: 2000,
									icon: "none",
								});
							}
						}).catch(() => {
							uni.hideLoading()
						});
					}
				},
			});
		},
		// 执行付款操作
		handlerPay: function (e) {
			let tradeSn = this.arrData[e.index].tradeSn 		// 获取订单ID
			uni.navigateTo({ url: '/pages/cart/payment/payOrder?trade_sn=' + tradeSn })
		},
		// 执行确认收货
		handlerConfirm: function (e) {
			let eId = this.arrData[e.index].sn 		// 获取订单ID
			uni.showModal({
				title: "谨慎操作",
				content: "您确定已经收到货物了吗？",
				confirmText: "确定",
				confirmColor: "#FF0000",
				cancelText: "取消",
				success: (res) => {
					if (res.confirm) {
						confirmReceipt(eId).then((res) => {
							if (res.data.code == 200) {
								uni.showToast({
									title: "已确认收货",
									duration: 2000,
									icon: "none",
								});
								this.arrData = []
								this.params.pageNumber = 1
								this.loadBaseData()
								// this.arrData.splice(e.index, 1)
							} else {
								uni.showToast({
									title: res.data.message,
									duration: 2000,
									icon: "none",
								});
							}
						});
					}
				},
			});

		},
		// 新增：处理催单操作
		handlerUrge: function (e) {
			let eId = this.arrData[e.index].sn // 获取订单ID
			uni.showModal({
				title: "订单催促",
				content: "确定要发送催单信息吗？",
				confirmText: "确定",
				cancelText: "取消",
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: "处理中",
							mask: true
						})
						urgeOrder(eId).then((res) => {
							uni.hideLoading()
							if (res.data.code == 200) {
								uni.showToast({
									title: res.data.data || "催单成功",
									duration: 2000,
									icon: "none",
								});
								// 只更新当前订单的催单状态，不刷新列表
								this.arrData[e.index].canUrge = false;
							} else {
								uni.showToast({
									title: res.data.message || "催单失败",
									duration: 2000,
									icon: "none",
								});
							}
						}).catch((err) => {
							uni.hideLoading()
							uni.showToast({
								title: "催单失败，请稍后再试",
								duration: 2000,
								icon: "none",
							});
						});
					}
				},
			});
		},
	},
	onLoad: function (options) {
		this.envWinTopPX = uni.getWindowInfo().windowTop
		this.curTab = options.state
		if (!this.curTab) {
			this.curTab = 0
		}
		this.customFlag = options.customFlag
		this.source = options.source
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

	.tip-banner {
		background: #FFF9EC;
		padding: 20rpx 30rpx;
		font-size: 28rpx;
		color: #FF9800;
		border-left: 8rpx solid #FF9800;
		margin-bottom: 10rpx;
	}

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
			padding: 8rpx 28rpx;
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
		padding: 0rpx 20rpx 0;

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
