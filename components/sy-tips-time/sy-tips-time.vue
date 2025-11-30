<template>
	<view class="message-item">
		<view class="tips-time-message">
			<slot></slot>
		</view>
	</view>
</template>

<script>
export default {
}
</script>
<style lang="scss" scoped>
.message-item {

	margin: 20rpx 0;


	.tips-time-message {
		margin: 16rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 32rpx;
		font-size: 22rpx;
		color: #666666;
	}
}
</style>