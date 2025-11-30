<template>
	<view>
		<view 
			class="city-group" 
			v-for="group in data" 
			:key="group.letter"
			:id="'section-' + group.letter"
		>
			<view class="group-title">{{ group.letter }}</view>
			<view class="city-list-content">
				<view 
					class="city-item" 
					v-for="city in group.list" 
					:key="city.id"
					@click="$emit('select', city)"
				>
					{{ city.name }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'city-list',
		props: {
			data: {
				type: Array,
				default: () => []
			}
		}
	}
</script>

<style lang="scss" scoped>
	.city-group {
		margin: 20rpx 20rpx 0;
		background-color: #fff;
		border-radius: 20rpx;
		box-sizing: border-box;
	}

	.group-title {
		padding: 20rpx;
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
		border-radius: 20rpx;
	}

	.city-list-content {
		padding-left: 20rpx;
	}

	.city-item {
		position: relative;
		display: flex;
		align-items: center;
		height: 80rpx;
		margin-right: 20rpx;
		color: #666666;
		font-size: 26rpx;
		opacity: 0.6;
		border-bottom: 1px solid #d2d2d2;
	}

	.city-item:last-child {
		border-bottom: none;
	}
</style>
