<template>
	<view class="container">
		<view class="lnk-common lnk-primary" @tap="next">确认注销账号</view>
	</view>
</template>

<script>
export default {
	data() {
		return {

		};
	},
	methods: {
		next() {
			uni.navigateTo({
				url: '/pages/apply/supplier/sureself'
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
}
</style>
