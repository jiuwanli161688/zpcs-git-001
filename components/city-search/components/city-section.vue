<template>
	<view class="section" :id="sectionId">
		<view class="section-header">
			<text class="section-title">{{ title }}</text>
			<view v-if="showTrash" class="trash-icon" @click="$emit('clear')">
				<uni-icons type="trash" size="20" color="#c0c0c0"></uni-icons>
			</view>
		</view>
		<view class="grid-container">
			<view 
				class="grid-item" 
				v-for="(city, index) in list" 
				:key="index"
				:class="{ 'active': currentCity === city.name }"
				@click="$emit('select', city)"
			>
				{{ city.name }}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'city-section',
		props: {
			title: String,
			list: {
				type: Array,
				default: () => []
			},
			currentCity: String,
			showTrash: {
				type: Boolean,
				default: false
			},
			sectionId: String
		}
	}
</script>

<style lang="scss" scoped>
	.section {
		background-color: #fff;
		margin: 20rpx;
		padding: 20rpx;
		border-radius: 20rpx;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.section-title {
		font-size: 30rpx;
		font-weight: 600;
		color: #333;
	}
	
	.icon-trash {
		font-size: 32rpx;
	}

	.grid-container {
		display: flex;
		flex-wrap: wrap;
	}

	.grid-item {
		width: 22%;
		height: 72rpx;
		background-color: #f8f8f8;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #333;
		margin-bottom: 20rpx;
		margin-right: 4%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.grid-item:nth-child(4n) {
		margin-right: 0;
	}

	.grid-item.active {
		background-color: #FFF0F0;
		color: #FF5050;
	}
</style>
