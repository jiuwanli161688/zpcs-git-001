<template>
	<view class="success-container">
		<!-- Navigation Bar removed, using native -->

		<!-- Success Status -->
		<view class="status-section">
			<view class="status-icon">
				<!-- TODO: Place success icon at /static/images/cbd/payment/success.png -->
				<image src="/static/cbd/payment/success.png" style="width: 60rpx; height: 60rpx;" mode="aspectFit"></image>
				<text class="status-text">支付成功</text>
			</view>
		</view>

		<!-- Main Card (Amount + Details) -->
		<view class="main-card">
			<view class="amount-section">
				<text class="currency">¥</text>
				<text class="amount">{{ amount }}</text>
			</view>
			
			<!-- Stamp Divider -->
			<view class="stamp-divider">
				<view class="dashed-line"></view>
				<view class="circle-left"></view>
				<view class="circle-right"></view>
			</view>

			<view class="details-section">
				<view class="detail-row">
					<text class="label">交易单号</text>
					<text class="value">2343423432822030</text>
				</view>
				<view class="detail-row">
					<text class="label">流水单号</text>
					<text class="value">2343423432822030</text>
				</view>
				<view class="detail-row">
					<text class="label">支付方式</text>
					<text class="value">{{ paymentMethodName }}</text>
				</view>
			</view>
		</view>

		<!-- Bottom Banner -->
		<view class="banner-section">
			<!-- Placeholder for Banner Background -->
			<!-- TODO: Place banner image at /static/cbd/payment/payment_success_banner.png -->
			<image class="banner-bg" src="/static/cbd/payment/payment_success_banner.jpg" mode="widthFix"></image>
			
			<!-- Dynamic Content Overlay -->
			<view class="banner-content">
				<view class="voucher-display">
					<view class="voucher-amount">{{ voucherAmount }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				amount: '0.00',
				method: 'wechat',
				voucherAmount: 2500 // Dynamic value
			};
		},
		onLoad(options) {
			if (options.amount) {
				this.amount = options.amount;
			}
			if (options.method) {
				this.method = options.method;
			}
		},
		computed: {
			paymentMethodName() {
				const map = {
					'wechat': '微信支付',
					'alipay': '支付宝支付',
					'unionpay': '云闪付'
				};
				return map[this.method] || '未知支付';
			}
		}
	}
</script>

<style lang="scss" scoped>
	.success-container {
		min-height: 100vh;
		background-color: #F8F8F8;
		padding-bottom: 40rpx;
	}

	.status-section {
		display: flex;
		justify-content: center;
		padding: 40rpx 0;
		
		.status-icon {
			display: flex;
			align-items: center;
			
			.status-text {
				font-size: 40rpx;
				font-weight: bold;
				color: #333333;
				margin-left: 20rpx;
			}
		}
	}

	.main-card {
		background-color: #fff;
		margin: 0 30rpx 40rpx;
		border-radius: 20rpx;
		overflow: hidden;
		
		.amount-section {
			padding: 60rpx 0;
			text-align: center;
			
			.currency {
				font-family: 'Source Han Sans', sans-serif;
				font-weight: 500;
				font-size: 40rpx; // 20px * 2
				color: #3D3D3D;
				font-variation-settings: "opsz" auto;
				margin-right: 4rpx;
			}
			
			.amount {
				font-family: 'Source Han Sans', sans-serif;
				font-weight: 500;
				font-size: 60rpx; // 30px * 2
				line-height: normal;
				text-align: center;
				letter-spacing: 0em;
				color: #3D3D3D;
				font-variation-settings: "opsz" auto;
				font-feature-settings: "kern" on;
			}
		}
		
		.stamp-divider {
			position: relative;
			height: 30rpx;
			display: flex;
			align-items: center;
			
			.dashed-line {
				width: 100%;
				height: 1px;
				border-top: 1px dashed #D8D8D8;
				margin: 0 30rpx;
			}
			
			.circle-left, .circle-right {
				position: absolute;
				width: 30rpx;
				height: 30rpx;
				background-color: #F8F8F8;
				border-radius: 50%;
				top: 50%;
				transform: translateY(-50%);
			}
			
			.circle-left {
				left: -15rpx;
			}
			
			.circle-right {
				right: -15rpx;
			}
		}
		
		.details-section {
			padding: 40rpx 30rpx;
			
			.detail-row {
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;
				
				&:last-child {
					margin-bottom: 0;
				}
				
				.label {
					font-size: 28rpx;
					color: #999;
				}
				
				.value {
					font-size: 28rpx;
					color: #333;
				}
			}
		}
	}

	.banner-section {
		margin: 0 30rpx;
		position: relative;
		border-radius: 20rpx;
		overflow: hidden;
		
		.banner-bg {
			width: 100%;
			display: block;
		}
		
		.banner-content {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			
			.voucher-display {
				position: absolute;
				left: 95rpx; // Adjusted based on user feedback
				bottom: 125rpx; // Adjusted based on user feedback
				
				.voucher-amount {
					font-size: 56rpx;
					font-weight: bold;
					color: #7A140B;
				}
			}
		}
	}
</style>
