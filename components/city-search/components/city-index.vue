<template>
	<view class="index-bar">
		<view class="index-item" @click.stop="$emit('change', 'hot')">热</view>
		<view 
			class="index-item" 
			v-for="letter in alphabet" 
			:key="letter"
			@click.stop="$emit('change', letter)"
		>
			{{ letter }}
		</view>
	</view>
</template>

<script>
	export default {
		name: 'city-index',
		props: {
			alphabet: {
				type: Array,
				default: () => []
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-bar {
		position: fixed;
		right: 8rpx;
		top: 55%; 
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 20;
		border-radius: 20rpx;
		padding: 8rpx 0;
		background: rgba(109, 109, 109, 0.19);
	}

	.index-item {
		font-size: 20rpx;
		color: #333;
		padding: 4rpx;
		margin: 2rpx 0;
	}
</style>
