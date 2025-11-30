<template>
	<view class="cpn" @tap="handlerSelect">
		<view class="ctrl">
			<image class="icon" :src="checked ? iconCheckHov : iconCheck" mode="aspectFill"></image>
		</view>
		<view class="logo"
			:style="{ background: 'url(' + (dealer.distributorFace == null ? iconLogo : dealer.distributorFace) + ')' }"></view>
		<view class="info">
			<view class="line">
				<image class="icon" :src="iconCode" mode="aspectFit"></image>
				<view class="text">{{ dealer.distributorNumber }}</view>
			</view>
			<view class="line">
				<image class="icon" :src="iconShop" mode="aspectFit"></image>
				<view class="text">{{ dealer.companyName }}</view>
			</view>
			<view class="line">
				<image class="icon" :src="iconPhone" mode="aspectFit"></image>
				<view class="text">{{ dealer.contactsPhone }}</view>
			</view>
			<view class="line">
				<image class="icon" :src="iconAddress" mode="aspectFit"></image>
				<view class="text">{{ dealer.companyAddress }}</view>
			</view>
		</view>
	</view>
</template>

<script>


export default {
	name: "",
	components: {

	},
	props: {
		dealer: {
			type: Object,
			default: () => { }
		},
		index: {
			type: Number,
			default: 0
		},
		checked: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isComplete: false,
			iconLogo: `${this.iconCommon}/static/v1/s-logo.jpg`,
			iconCode: `${this.iconCommon}/static/v1/login/icon-code.png`,
			iconShop: `${this.iconCommon}/static/v1/login/icon-shop.png`,
			iconPhone: `${this.iconCommon}/static/v1/login/icon-phone.png`,
			iconAddress: `${this.iconCommon}/static/v1/login/icon-address.png`,
			iconCheck: `${this.iconCommon}/static/v1/login/icon-check.png`,
			iconCheckHov: `${this.iconCommon}/static/v1/login/icon-check_hov.png`,
		}
	},
	methods: {
		handlerSelect: function () {
			this.$emit('selected', { distributorNumber: this.dealer.distributorNumber })
		},
	},
	onLoad: function () {

	},
	onShow: function () {

	}
}
</script>

<style lang="scss" scoped>
.cpn {
	background: #FFF;
	padding: 20rpx;
	// border-radius: 12rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;

	.ctrl {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		display: flex;
		justify-content: flex-end;
		align-items: flex-start;

		.icon {
			width: 36rpx;
			height: 36rpx;
		}
	}

	.logo {
		width: 160rpx;
		height: 160rpx;
		background-size: cover !important;
		background-position: 50% 50% !important;
	}

	.info {
		width: calc(100vw - 160rpx - 40rpx - 40rpx);
		padding: 0 0 0 20rpx;
		box-sizing: border-box;

		.line {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height: 40rpx;

			.icon {
				width: 32rpx;
				height: 32rpx;
				margin: 0 12rpx 0 0;
			}

			.text {
				// width: calc(100vw- 40rpx - 40rpx - 140rpx - 20rpx);
				flex: 1;
				font-size: 24rpx;
				color: #666;
				line-height: 40rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
}
</style>
