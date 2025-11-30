<template>
	<view class="cpn" @tap="handlerDetail">
		<view class="hd">
			<!-- <view class="line">
				<view class="lab">订单编号</view>
				<view class="txt">{{ order.sn }}</view>
			</view>
			<view class="line">
				<view class="lab">订单状态</view>
				<view class="txt">{{ order.orderStatusText }}</view>
			</view> -->
			<view class="store-info">
				<view class="lab">【{{ order.storeName }}】</view>
				<view class="txt">{{ order.orderStatusText }}</view>
			</view>
		</view>
		<order-item-body :goods="goods" :total="total" />
		<scroll-view class="scroll-view" scroll-x>
			<view class="scroll-content">
				<view class="item item-red" v-if="order.canUrge" @tap.stop="handlerUrge">
					<!-- 催单按钮 -->
					<view class="link-item link-primary">催单</view>
				</view>
				<view class="item" v-if="order.orderStatus == 'UNPAID'" @tap.stop="handlerCancel">
					<!-- 待付款 -->
					<view class="link-item">取消</view>
				</view>
				<view class="item item-red" v-if="order.orderStatus == 'UNPAID'" @tap.stop="handlerPay">
					<view class="link-item link-primary">去支付
					</view>
				</view>
				<view class="item item-view" v-if="order.orderStatus == 'PAID' || order.orderStatus == 'UNDELIVERED'"
					@tap.stop="handlerCancel">
					<!-- 待发货 -->
					<view class="link-item">取消订单</view>
				</view>
				<view class="item item-red" v-if="order.orderStatus == 'DELIVERED'" @tap.stop="handlerConfirm">
					<!-- 待收货 -->
					<view class="link-item link-primary">收货
					</view>
				</view>
				<view class="item item-orange" v-if="order.orderStatus == 'COMPLETED' && order.commentStatus == 'UNFINISHED'"
					@tap.stop="handlerComment">
					<!-- 待评价 -->
					<view class="link-item orange">发表评价</view>
				</view>
				<view class="item item-orange" v-if="order.commentStatus == 'FINISHED'" @tap.stop="handlerCommentDetail">
					<view class="link-item link-primary orange">查看评价</view>
				</view>
				<view class="item item-orange" v-if="order.commentStatus == 'REJECTED'" @tap.stop="handlerUpdateDetail">
					<view class="link-item link-primary orange">修改评价</view>
				</view>
				<view class="item item-view" v-if="order.orderStatus == 'COMPLETED'" @tap.stop="handlerDetail">
					<!-- 已完成 -->
					<view class="link-item">查看</view>
				</view>
				<view class="item item-view" v-if="order.orderStatus == 'CANCEL'" @tap.stop="handlerDetail">
					<!-- 已取消 -->
					<view class="link-item">查看</view>
				</view>
				<view class="item item-view" v-if="order.orderStatus == 'CANCELLED'" @tap.stop="handlerDetail">
					<!-- 已关闭 -->
					<view class="link-item">查看</view>
				</view>
				<view class="item item-red" @tap.stop="repurchaseOrderEve(order)" v-if="!order.customFlag && isFull">
					<view class="link-item link-primary">再次购买</view>
				</view>
				<view class="item item-view"
					v-if="(order.orderStatus == 'COMPLETED' || order.orderStatus == 'FINISH') && (order.receiptStatus == 0 || order.receiptStatus == 1) &&  order.isInvoiceOutTime == false"
					@tap.stop="handlerInvoice">
					<!-- 申请开票 -->
					<view class="link-item">申请开票</view>
				</view>
				<view class="item item-view" v-if="order.receiptStatus == 3" @tap.stop="handlerInvoiceDetail">
					<!-- 查看开票 -->
					<view class="link-item">查看开票
					</view>
				</view>
				<view class="item item-red item-view" v-if="order.receiptStatus == 3" @tap.stop="handlerInvoiceReopen">
					<!-- 发票重开 -->
					<view class="link-item">重开发票
					</view>
				</view>
				<view></view>
			</view>
		</scroll-view>
	</view>
</template>

<script>

import OrderItemBody from './OrderItemBody'
import { repurchaseOrder } from '@/api/order.js'

export default {
	name: '',
	components: {
		OrderItemBody
	},
	props: {
		order: {
			type: Object,
			default: () => { }
		},
		goods: {
			type: Array,
			default: () => []
		},
		total: {
			type: Number,
			default: 0
		},
		index: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			isComplete: false,
			items: [
				'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5',
				'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10'
			],
		}
	},
	computed:{
		isFull(){
		return this.$store.state.isFull
		}
	},
	methods: {
		// 触发支付
		handlerPay: function (e) {
			this.$emit('pay', { index: this.$props.index })
		},
		// 触发取消
		handlerCancel: function (e) {
			this.$emit('cancel', { index: this.$props.index })
		},
		// 触发收货
		handlerConfirm: function (e) {
			this.$emit('confirm', { index: this.$props.index })
		},
		// 触发评价
		handlerComment: function (e) {
			this.$emit('comment', { index: this.$props.index })
		},
		// 触发详情
		handlerDetail: function (e) {
			this.$emit('detail', { index: this.$props.index })
		},
		// 再次购买
		repurchaseOrderEve(e) {
			repurchaseOrder(e.sn).then(res => {
				if (res.data.success) {
					uni.reLaunch({
						url: `/pages/tabbar/cart/cartList?OrderId=${e.sn}`,
					})
				}
			})
		},
		// 触发查看评价详情
		handlerCommentDetail: function (e) {
			this.$emit('commentDetail', { index: this.$props.index })
		},
		//触发修改评价
		handlerUpdateDetail: function (e) {
			this.$emit('updateDetail', { index: this.$props.index })
		},
		// 申请开票
		handlerInvoice: function (e) {
			this.$emit('invoice', { index: this.$props.index })
		},
		// 重开发票
		handlerInvoiceReopen() {
			this.$emit('invoiceReopen', { index: this.$props.index })
		},
		// 查看发票
		handlerInvoiceDetail() {
			this.$emit('invoiceDetail', { index: this.$props.index })
		},
		// 催单
		handlerUrge: function (e) {
			this.$emit('urge', { index: this.$props.index })
		}
	}
}
</script>

<style lang="scss" scoped>
.cpn {
	background: #FFF;
	border-radius: 20rpx;
	padding: 24rpx 20rpx;
	max-width: 100%;
	.store-info{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.lab{
			color: #333333;
			min-width: 140rpx;
			font-weight: 500;
		}
		.txt{
			font-size: 28rpx;
			color: #F10100;
		}
	}
	.hd {
		position: relative;

		.line {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height: 48rpx;
			line-height: 48rpx;

			.lab {
				color: #999;
				min-width: 140rpx;
				position: relative;

				&::after {
					position: relative;
					content: '：';
				}
			}

			.txt {
				color: #666;
			}
		}

		// &::after {
		// 	position: absolute;
		// 	content: '';
		// 	left: 0;
		// 	right: 0;
		// 	bottom: 0;
		// 	height: 3rpx;
		// 	background: #E7E7E7;
		// }
	}

	.ft {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 96rpx;
		position: relative;

		&::after {
			position: absolute;
			content: '';
			left: 0;
			right: 0;
			top: 0;
			height: 3rpx;
			background: #E7E7E7;
		}

		.link-item {
			border: 3rpx solid #DCDEE0;
			min-width: 144rpx;
			height: 64rpx;
			border-radius: 12rpx;
			line-height: 64rpx;
			font-size: 28rpx;
			color: #323232;
			text-align: center;
			margin: 0 0 0 16rpx;
		}

		.link-primary {
			border: 3rpx solid #EE0A24;
			color: #EE0A24;
		}

		.orange {
			border-color: orange;
			color: orange;
		}
	}
}

.scroll-view {
	white-space: nowrap;
	width: 100%;
	text-align: right;
	// border-top: 1px solid #DCDEE0;
	padding: 20rpx 0 0;
}

.scroll-content {
	display: inline-block;
}

.item {
	display: inline-block;
	background-color: #fff;
	border: 2rpx solid #DCDEE0;
	border-radius: 12rpx;
	font-size: 28rpx;
	color: #323232;
	text-align: center;
	margin: 0 0 0 16rpx;
	padding: 4rpx 16rpx;
}

.item-red {
	border: 2rpx solid #FF9E9E;
	color: #F10100;
}

.item-orange {
	border: 2rpx solid #A17600;
	color: #A17600;
}
.item-view{
	border: 2rpx solid #666666;
	color: #333333;
}
</style>
