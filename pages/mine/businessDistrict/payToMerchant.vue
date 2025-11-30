<template>
	<view class="pay-container">
		<!-- Navigation Bar -->
		<u-navbar title="向商家付款" :background="{ background: '#F8F8F8' }" title-color="#333" back-icon-color="#333" :border-bottom="false"></u-navbar>

		<!-- Merchant Info -->
		<view class="merchant-card">
			<view class="avatar-wrapper">
				<image class="merchant-avatar" src="/static/cbd/payment/merchant_avatar_placeholder.png" mode="aspectFill"></image>
			</view>
			<view class="merchant-name">京门 · 老爆三火锅店</view>
			<view class="merchant-address">浙江省杭州市临安区锦城街道城中街708号</view>

			<!-- Amount Input -->
			<view class="amount-section">
				<view class="amount-label">消费金额</view>
				<view class="amount-input-wrapper" @click="showKeyboard = true">
					<text class="currency-symbol">¥</text>
					<text class="amount-value" :class="{ 'placeholder': !amount }">{{ amount || '' }}</text>
					<view class="cursor" v-if="showKeyboard"></view>
				</view>
				<u-line color="#E6E6E6" />
			</view>
		</view>

		<!-- Custom Keyboard -->
		<view class="keyboard-area" v-if="showKeyboard">
			<view class="keyboard-grid">
				<view class="number-keys">
					<view class="key-row">
						<view class="key-btn" hover-class="key-hover" @click="onKeyPress('1')">1</view>
						<view class="key-btn" hover-class="key-hover" @click="onKeyPress('2')">2</view>
						<view class="key-btn" hover-class="key-hover" @click="onKeyPress('3')">3</view>
					</view>
					<view class="key-row">
						<view class="key-btn" hover-class="key-hover" @click="onKeyPress('4')">4</view>
						<view class="key-btn" hover-class="key-hover" @click="onKeyPress('5')">5</view>
						<view class="key-btn" hover-class="key-hover" @click="onKeyPress('6')">6</view>
					</view>
					<view class="key-row">
						<view class="key-btn" hover-class="key-hover" @click="onKeyPress('7')">7</view>
						<view class="key-btn" hover-class="key-hover" @click="onKeyPress('8')">8</view>
						<view class="key-btn" hover-class="key-hover" @click="onKeyPress('9')">9</view>
					</view>
					<view class="key-row">
						<view class="key-btn zero-key" hover-class="key-hover" @click="onKeyPress('0')">0</view>
						<view class="key-btn" hover-class="key-hover" @click="onKeyPress('.')">.</view>
					</view>
				</view>
				<view class="action-keys">
					<view class="key-btn backspace-btn" hover-class="key-hover" @click="onBackspace">
						<u-icon name="backspace" size="40" color="#333"></u-icon>
					</view>
					<view class="key-btn confirm-btn" hover-class="confirm-hover" @click="onConfirm">
						<text>确定</text>
					</view>
				</view>
			</view>
		</view>

		<!-- Payment Popup -->
		<u-popup v-model="showPaymentPopup" mode="bottom" border-radius="20" :mask-close-able="false">
			<view class="payment-popup">
				<view class="popup-header">
					<u-icon name="close" size="30" color="#999" @click="showPaymentPopup = false"></u-icon>
					<text class="popup-title">确认付款</text>
					<view class="placeholder"></view>
				</view>
				
				<view class="popup-amount">
					<text class="currency">¥</text>
					<text class="value">{{ amount }}</text>
				</view>
				
				<view class="popup-timer">
					请在{{ formattedTime }}内付款
				</view>
				
				<view class="popup-promo">
					<u-icon name="info-circle" color="#FF0101" size="28"></u-icon>
					<text class="promo-text">本次支付预计可得200张水机兑换券</text>
				</view>

				<view class="payment-methods">
					<view class="method-item" @click="selectedMethod = 'wechat'">
						<view class="method-left">
							<image src="/static/cbd/payment/wxpay.png" style="width: 50rpx; height: 50rpx; margin-right: 10rpx;" mode="aspectFit"></image>
							<text class="method-name">微信支付</text>
						</view>
						<view class="method-right">
							<u-icon v-if="selectedMethod === 'wechat'" name="checkmark-circle-fill" color="#FF0101" size="40"></u-icon>
							<view v-else class="radio-circle"></view>
						</view>
					</view>
					
					<view class="method-item" @click="selectedMethod = 'alipay'">
						<view class="method-left">
							<image src="/static/cbd/payment/alipay.png" style="width: 50rpx; height: 50rpx; margin-right: 10rpx;" mode="aspectFit"></image>
							<text class="method-name">支付宝支付</text>
						</view>
						<view class="method-right">
							<u-icon v-if="selectedMethod === 'alipay'" name="checkmark-circle-fill" color="#FF0101" size="40"></u-icon>
							<view v-else class="radio-circle"></view>
						</view>
					</view>
					
					<view class="method-item" @click="selectedMethod = 'unionpay'">
						<view class="method-left">
							<image src="/static/cbd/payment/unionpay.png" style="width: 50rpx; height: 50rpx; margin-right: 10rpx;" mode="aspectFit"></image>
							<text class="method-name">云闪付</text>
						</view>
						<view class="method-right">
							<u-icon v-if="selectedMethod === 'unionpay'" name="checkmark-circle-fill" color="#FF0101" size="40"></u-icon>
							<view v-else class="radio-circle"></view>
						</view>
					</view>
				</view>

				<view class="popup-footer">
					<button class="confirm-pay-btn" @click="handlePayment">确认付款</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				amount: '',
				showKeyboard: true,
				showPaymentPopup: false,
				selectedMethod: 'wechat',
				remainingTime: 1800, // 30 minutes in seconds
				timer: null
			};
		},
		computed: {
			formattedTime() {
				const hours = Math.floor(this.remainingTime / 3600);
				const minutes = Math.floor((this.remainingTime % 3600) / 60);
				const seconds = this.remainingTime % 60;
				
				const format = (num) => num.toString().padStart(2, '0');
				
				return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
			}
		},
		beforeDestroy() {
			this.clearTimer();
		},
		methods: {
			onKeyPress(key) {
				if (key === '.' && this.amount.includes('.')) return;
				if (key === '.' && !this.amount) {
					this.amount = '0.';
					return;
				}
				// Limit decimal places to 2
				if (this.amount.includes('.') && this.amount.split('.')[1].length >= 2) return;
				// Limit max length
				if (this.amount.length > 8) return;
				
				this.amount += key;
			},
			onBackspace() {
				if (this.amount.length > 0) {
					this.amount = this.amount.slice(0, -1);
				}
			},
			onConfirm() {
				if (!this.amount || parseFloat(this.amount) <= 0) {
					uni.showToast({
						title: '请输入有效金额',
						icon: 'none'
					});
					return;
				}
				this.showKeyboard = false;
				this.showPaymentPopup = true;
				this.startTimer();
			},
			handlePayment() {
				// Navigate to success page
				uni.navigateTo({
					url: `/pages/mine/businessDistrict/paySuccess?amount=${this.amount}&method=${this.selectedMethod}`
				});
			},
			startTimer() {
				this.clearTimer();
				this.remainingTime = 1800;
				this.timer = setInterval(() => {
					if (this.remainingTime > 0) {
						this.remainingTime--;
					} else {
						this.clearTimer();
						// Optional: Handle timeout (e.g., close popup)
					}
				}, 1000);
			},
			clearTimer() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pay-container {
		min-height: 100vh;
		background-color: #F8F8F8;
		padding-top: 20rpx;
		display: flex;
		flex-direction: column;
	}

	.merchant-card {
		position: relative;
		background-color: #fff;
		margin: 80rpx 0 0;
		border-radius: 60rpx 60rpx 0 0;
		padding: 80rpx 30rpx 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		width: 100%;
		
		.avatar-wrapper {
			position: absolute;
			top: -60rpx;
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			overflow: hidden;
			border: 2rpx solid #eee;
			background-color: #fff;
			
			.merchant-avatar {
				width: 100%;
				height: 100%;
			}
		}
		
		.merchant-name {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 10rpx;
		}
		
		.merchant-address {
			font-size: 24rpx;
			color: #999;
			margin-bottom: 60rpx;
			text-align: center;
		}
		
		.amount-section {
			width: 100%;
			padding: 0 114rpx 20rpx;
			box-sizing: border-box;
			font-family: Source Han Sans;

			.amount-label {
				font-size: 28rpx;
				color: #666;
				margin-bottom: 20rpx;
			}
			
			.amount-input-wrapper {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				height: 80rpx;
				
				.currency-symbol {
					font-size: 60rpx;
					font-weight: bold;
					color: #333;
					margin-right: 30rpx;
					line-height: 1;
				}
				
				.amount-value {
					font-size: 80rpx;
					font-weight: bold;
					color: #333;
					line-height: 1;

					&.placeholder {
						min-width: 10rpx;
					}
				}
				
				.cursor {
					width: 4rpx; 
					height: 80rpx;
					background-color: #FF0101;
					margin-left: 4rpx;
					margin-top: -4rpx;
					animation: blink 1s infinite;
				}
			}
		}
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
	}

	.keyboard-area {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #E9E9E9;
		padding: 12rpx;
		padding-bottom: calc(12rpx + env(safe-area-inset-bottom));
		z-index: 100;
		
		.keyboard-grid {
			display: flex;
			
			.number-keys {
				flex: 3;
				display: flex;
				flex-wrap: wrap;
				margin-right: 8rpx;
				
				.key-row {
					display: flex;
					width: 100%;
					margin-bottom: 8rpx;
					
					&:last-child {
						margin-bottom: 0;
					}
					
					.key-btn {
						flex: 1;
						height: 110rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 40rpx;
						font-weight: 500;
						color: #333;
						background-color: #fff;
						border-radius: 8rpx;
						margin-right: 8rpx;
						
						&:last-child {
							margin-right: 0;
						}
						
						&.zero-key {
							flex: 2.06; // Adjusted to align with 1+2 columns roughly
						}
					}
				}
			}
			
			.action-keys {
				flex: 1;
				display: flex;
				flex-direction: column;
				
				.key-btn {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #fff;
					border-radius: 8rpx;
					margin-bottom: 8rpx;
					
					&:last-child {
						margin-bottom: 0;
					}
					
					&.backspace-btn {
						background-color: #fff;
					}
					
					&.confirm-btn {
						background-color: #FF0101;
						color: #fff;
						font-size: 32rpx;
					}
				}
			}
		}
	}
	
	.key-hover {
		background-color: #f5f5f5 !important;
	}
	
	.confirm-hover {
		opacity: 0.9;
	}

	.payment-popup {
		padding: 30rpx;
		background-color: #fff;
		
		.popup-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 40rpx;
			
			.popup-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
			
			.placeholder {
				width: 30rpx;
			}
		}
		
		.popup-amount {
			text-align: center;
			margin-bottom: 20rpx;
			
			.currency {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
			}
			
			.value {
				font-size: 72rpx;
				font-weight: bold;
				color: #333;
			}
		}
		
		.popup-timer {
			text-align: center;
			font-size: 24rpx;
			color: #999;
			margin-bottom: 20rpx;
		}
		
		.popup-promo {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 40rpx;
			
			.promo-text {
				font-size: 24rpx;
				color: #FF0101;
				margin-left: 10rpx;
			}
		}
		
		.payment-methods {
			margin-bottom: 40rpx;
			
			.method-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 30rpx 0;
				border-bottom: 1rpx solid #f5f5f5;
				
				.method-left {
					display: flex;
					align-items: center;
					
					.method-name {
						font-size: 30rpx;
						color: #333;
						margin-left: 20rpx;
					}
				}
				
				.radio-circle {
					width: 40rpx;
					height: 40rpx;
					border: 2rpx solid #ccc;
					border-radius: 50%;
				}
			}
		}
		
		.popup-footer {
			.confirm-pay-btn {
				width: 100%;
				height: 90rpx;
				line-height: 90rpx;
				background-color: #FF0101;
				color: #fff;
				font-size: 32rpx;
				border-radius: 45rpx;
				margin-bottom: 20rpx;
				
				&::after {
					border: none;
				}
			}
		}
	}
</style>
