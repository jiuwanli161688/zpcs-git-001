<template>
	<view class="settlement-order-item">
		<!-- 订单编号 -->
		<view class="order-header">
			<text class="order-label">订单编号：</text>
			<text class="order-number">{{ orderData.orderNumber }}</text>
		</view>

		<!-- 分割线 -->
		<view class="divider"></view>

		<view class="order-info">
			<view class="row">
				<view class="label">订单金额</view>
				<view class="value">¥{{ orderData.orderTotalAmount | unitPrice }}</view>
			</view>
			<view class="row">
				<view class="label">实付金额</view>
				<view class="value">¥{{ orderData.actualTotalAmount | unitPrice }}</view>
			</view>
			<view class="row">
				<view class="label">积分兑换</view>
				<view class="value">{{ orderData.usePoints || '0' }}</view>
			</view>
			<view class="row">
				<view class="label">订单运费</view>
				<view class="value">¥{{ orderData.orderTransportationAmount | unitPrice }}</view>
			</view>
			<view class="row">
				<view class="label">分平台服务商服务费</view>
				<view class="value">¥{{ orderData.orderIncome | unitPrice }}</view>
			</view>
			<view class="row">
				<view class="label">产品推荐服务费</view>
				<view class="value">¥{{ orderData.productRecommendationIncome | unitPrice }}</view>
			</view>
			<view class="row">
				<view class="label">区域独家代理服务费</view>
				<view class="value">¥{{ orderData.exclusiveRegionalIncome | unitPrice }}</view>
			</view>
			<view class="row">
				<view class="label">省级运营中心服务费</view>
				<view class="value">¥{{ orderData.provinceOpCenterIncome | unitPrice }}</view>
			</view>
			<view class="row">
				<view class="label">完成时间</view>
				<view class="value">{{ orderData.orderFinishedTime || '-' }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'SettlementOrderItem',
	props: {
		// 订单数据
		orderData: {
			type: Object,
			default: () => ({})
		},
		// 订单编号
		orderNumber: {
			type: String,
			default: ''
		}
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
