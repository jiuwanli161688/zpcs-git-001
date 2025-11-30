<!-- 新增加载状态组件 -->
<template>
	<view class="loading-container" v-if="loading">
		<view class="loading-spinner"></view>
		<text class="loading-text">{{ text }}</text>
	</view>
</template>

<script>
	export default {
		name: 'city-loading',
		props: {
			loading: {
				type: Boolean,
				default: false
			},
			text: {
				type: String,
				default: '加载中...'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 80rpx 0;
	}
	
	.loading-spinner {
		width: 64rpx;
		height: 64rpx;
		border: 6rpx solid #f0f0f0;
		border-top-color: #FFD04C;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}
	
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	
	.loading-text {
		margin-top: 24rpx;
		font-size: 28rpx;
		color: #999;
	}
</style>
