<template>
	<view class="cpn" :style="{background: 'url('+ bg +')'}">
		<view class="head">
			<view class="bank">
				<image class="logo" :src="logo" mode="aspectFit"></image>
				<view class="text">{{card.bankName}}</view>
			</view>
			<image class="link" :src="iconDelete" mode="aspectFit" @tap="handlerDelete"></image>
		</view>
		<view class="code">{{card.cardNumber}}</view>
		<view class="name" @tap="handlerDefault">持卡人：{{card.cardholder}}</view>
	</view>
</template>

<script>

	export default{
		name: '',
		props: {
			index: {
				type: Number,
				default: 0
			},
			card: {
				type: Object,
				default: () => {}
			}
		},
		computed: {
			logo: function() {
				return `${this.iconCommon}/static/v1/common/bank-logo_${this.$props.card.identifying}.png`
			},
			bg: function() {
				return `${this.iconCommon}/static/v1/common/bank-bg_${this.$props.card.identifying}.png`
			}
		},
		data(){
			return {
				isComplete: false,
				iconDelete: `${this.iconCommon}/static/v1/wallet/icon-delete.png`,
			}
		},
		methods: {
			// 删除账户
			handlerDelete: function() {
				// 参数1：索引
				// 参数2：订单ID
				this.$emit('delete', { index: this.index, id: this.card.id })
			},
			// 设为默认
			handlerDefault: function() {
				// 参数1：索引
				// 参数2：订单ID
				this.$emit('default', { index: this.index, id: this.card.id })
			},
		},

	}
</script>

<style lang="scss" scoped>
.cpn{
	color: #FFF;
	box-sizing: border-box;
	height: 248rpx;
	padding: 16rpx 20rpx 20rpx;
	background-size: cover !important;
	background-position: 50% 50% !important;
	.head{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.bank{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			line-height: 80rpx;
			.logo{
				width: 60rpx;
				height: 60rpx;
			}
			.text{
				padding: 0 0 0 16rpx;
				font-size: 32rpx;
				font-weight: 600;
			}
		}
		.link{
			width: 32rpx;
			height: 32rpx;
		}
	}
	.code{
		line-height: 72rpx;
		font-size: 40rpx;
	}
	.name{
		font-size: 28rpx;
		line-height: 60rpx;
	}
}
</style>