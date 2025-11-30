<template>
	<view class="container">
		<!-- 成功 -->
		<view class="status">
			<image class="icon" :src="iconSuccess" mode="aspectFit"></image>
			<view class="text">支付成功</view>
		</view>
		<view class="lnk-common lnk-primary" @tap="handlerDetail">查看订单</view>
		<!-- 失败 -->
		<view class="status">
			<image class="icon" :src="iconFailed" mode="aspectFit"></image>
			<view class="text">支付失败：订单参数错误</view>
		</view>
		<view class="lnk-common lnk-primary" @tap="handlerDetail">查看订单</view>
	</view>
</template>

<script>
	
	
	export default{
		name: '',
		components: {
			
		},
		data(){
			return {
				isComplete: false,
				iconSuccess: `${this.iconCommon}/static/v1/common/icon-success.png`,
				iconFailed: `${this.iconCommon}/static/v1/common/icon-fail.png`,
			}
		},
		methods: {
			// 跳转订单详情
			handlerDetail: function(){
				uni.redirectTo({
					url: '/pages/profile/order/detail'
				})
			},
		},
		onLoad: function(){
			
		},
		onShow: function(){
			
		}
	}
</script>

<style lang="scss" scoped>
.container{
	background: #FFF;
	min-height: 100vh;
	box-sizing: border-box;
	padding: 20rpx;
	.status{
		min-height: 320rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.icon{
			width: 140rpx;
			height: 140rpx;
		}
		.text{
			font-size: 26rpx;
			line-height: 72rpx;
		}
	}
}
</style>