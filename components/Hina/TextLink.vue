<template>
	<!-- <view class="lnk-item" :data-link='link' @tap="handlerLink">{{text}}</view> -->
	<view class="cpn" @tap="tapLink">
		<view class="title">{{ text }}</view>
		<view class="phone" v-if="isCall">{{ link }}</view>
	</view>
</template>

<script>

export default {
	name: '',
	props: {
		text: {
			type: String,
			default: ''
		},
		link: {
			type: String,
			default: ''
		},
		// 是否电话
		isCall: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {

		}
	},
	methods: {
		// 文本组件链接跳转
		tapLink: function (e) {
			if (this.isCall) {
				// 电话链接
				uni.makePhoneCall({
					phoneNumber: this.link
				})
			} else {
				// 页面链接
				uni.navigateTo({
					url: this.link
				})
			}
		},
	}
}
</script>

<style lang="scss" scoped>
.cpn {
	height: 88rpx;
	line-height: 88rpx;
	font-size: 28rpx;
	position: relative;
	padding: 0 60rpx 0 24rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.title {
		color: #333;
	}

	.phone {
		color: #666;
	}

	&::after {
		position: absolute;
		content: '';
		width: 12rpx;
		height: 12rpx;
		border: 4rpx solid #d6d6d6;
		border-left: none;
		border-bottom: none;
		right: 40rpx;
		top: 45%;
		transform: rotate(45deg) translateY(-45%);
	}
}
</style>