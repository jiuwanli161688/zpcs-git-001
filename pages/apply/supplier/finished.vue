<template>
	<view class="container">
		<view class="finished">
			<image :src="iconFinished" class="icon" mode="aspectFit"></image>
			<view class="text">成功为您开通中品维度供应商权限</view>
			<view class="tips">管理账号：s1234322</view>
		</view>
		
		<view class="lnk-common lnk-primary">进入供应商中心</view>
		<view class="lnk-common lnk-secondary">查看合作协议</view>
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
				iconFinished: `${this.iconCommon}/static/v1/apply/icon-finished.png`,
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
.container{
	background: #FFF;
	min-height: 100vh;
	box-sizing: border-box;
	padding: 20rpx;
	.finished{
		padding: 30rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.icon{
			width: 320rpx;
			height: 320rpx;
			margin: 0 0 30rpx;
		}
		.text{
			font-size: 28rpx;
			height: 48rpx;
			line-height: 48rpx;
			color: #323232;
		}
		.tips{
			font-size: 26rpx;
			color: #666;
		}
	}
}
</style>