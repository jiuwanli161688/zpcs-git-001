<!-- 新增错误提示组件 -->
<template>
	<view class="error-container" v-if="show">
		<view class="error-icon">!</view>
		<text class="error-text">{{ message }}</text>
		<view class="retry-btn" @click="$emit('retry')">
			<text>重新加载</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'city-error',
		props: {
			show: {
				type: Boolean,
				default: false
			},
			message: {
				type: String,
				default: '数据加载失败'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 120rpx 40rpx;
		background-color: #fff;
		margin: 24rpx;
		border-radius: 24rpx;
	}
	
	.error-icon {
		width: 80rpx;
		height: 80rpx;
		background-color: #FF5050;
		color: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 48rpx;
		font-weight: bold;
	}
	
	.error-text {
		margin-top: 32rpx;
		font-size: 28rpx;
		color: #666;
	}
	
	.retry-btn {
		margin-top: 40rpx;
		padding: 16rpx 48rpx;
		background-color: #FFD04C;
		border-radius: 40rpx;
	}
	
	.retry-btn text {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
	}
</style>
