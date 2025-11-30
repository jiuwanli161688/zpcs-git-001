<template>
	<view class="settlement-order-item">
		<!-- 订单编号 -->
		<view class="order-header">
			<text class="order-label">订单编号：</text>
			<text class="order-number">{{ order.orderSn }}</text>
		</view>

		<!-- 分割线 -->
		<view class="divider"></view>
		<view class="order-info">
			<view class="row">
				<view class="label">完成时间</view>
				<view class="value">{{ order.orderTime || '-' }}</view>
			</view>
			<view class="row">
				<view class="label">订单金额</view>
				<view class="value">¥{{ order.orderMoney | unitPrice }}</view>
			</view>
			<view class="row">
				<view class="label">结算金额</view>
				<view class="value highlight">¥{{ order.money | unitPrice }}</view>
			</view>
		</view>
	</view>
</template>

<script>

	export default{
		name: '',
		props: {
			order: {
				type: Object,
				default: () => {}
			}
		},
		data(){
			return {
				isComplete: false,

			}
		},
		methods: {

		},
		onLoad: function(){

		},
		onShow: function(){

		}
	}
</script>

<style lang="scss" scoped>
.settlement-order-item {
	background: #FFF;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	overflow: hidden;

	.order-header {
		padding: 20rpx;

		.order-label {
			font-size: 28rpx;
			color: #E22221;
			font-weight: 600;
		}

		.order-number {
			font-size: 28rpx;
			color: #333;
			font-weight: 400;
		}
	}

	.divider {
		height: 1rpx;
		background-color: #f0f0f0;
		margin: 0 20rpx;
	}

	.order-info {
		padding: 20rpx;

		.row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 46rpx;
			font-size: 26rpx;

			.label {
				color: #999;
				min-width: 200rpx;
			}

			.value {
				color: #333;
				font-weight: 400;
				text-align: right;
				flex: 1;

				&.highlight {
					color: #E22221;
					font-weight: 600;
				}
			}
		}
	}
}
</style>