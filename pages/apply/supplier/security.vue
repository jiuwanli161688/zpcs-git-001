<template>
	<view class="container">
		<view class="form" v-if="isCodeLogin">
			<view class="rs">
				<input class="text" type="text" v-model="form.mobile" placeholder="请输入手机号" />
			</view>
			<view class="rs">
				<input class="code" type="text" v-model="form.code" placeholder="请输入验证码" />
				<view class="link" @tap="sendSMS">{{ codeText }}</view>
			</view>
		</view>
		<view class="lnk-common lnk-primary" @tap="next">登录</view>
	</view>
</template>

<script>
import { unitPrice } from '../../../utils/filters';

export default {
	data() {
		return {
			codeText: '获取验证码',
			isCodeLogin: true,
			form: {
				mobile: '',
				code: ''
			},
		}
	},
	methods: {
		sendSMS() {

		},
		next() {
			if (!this.form.mobile) {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				})
				return
			}
			if (!this.form.code) {
				uni.showToast({
					title: '请输入验证码',
					icon: 'none'
				})
				return
			}
			uni.navigateTo({
				url: '/pages/apply/supplier/selfcheck'
			})
		}
	}
}
</script>

<style lang="scss">
.container {
	background: #FFF;
	min-height: 100vh;
	box-sizing: border-box;
	padding: 10rpx 20rpx;

	.form {
		.rs {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 96rpx;
			position: relative;
			margin: 0 0 16rpx;
			border: 1px solid #ebedf0;
			padding: 0 10rpx;

			&::after {
				position: absolute;
				content: '';
				left: 0;
				right: 0;
				bottom: 0;
				height: 3rpx;
				background: #c7ccd3;
			}

			.text {
				width: calc(100vw - 60rpx);
				font-size: 28rpx;
				height: 72rpx;
				line-height: 72rpx;
				color: #323232;
				box-sizing: border-box;
				padding: 0 20rpx;
			}

			.code {
				width: calc(100vw - 60rpx - 160rpx);
				font-size: 28rpx;
				height: 72rpx;
				line-height: 72rpx;
				color: #323232;
				box-sizing: border-box;
				padding: 0 20rpx;
			}

			.link {
				width: 160rpx;
				height: 64rpx;
				line-height: 64rpx;
				background: #e22221;
				text-align: center;
				font-size: 26rpx;
				color: #fff;
				border-radius: 4rpx;
			}
		}
	}
}
</style>
