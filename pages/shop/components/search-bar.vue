<template>
	<view class="search-bar-wrapper" :class="{ 'mini-wrapper': mini }">
		<view class="search-box" :class="{ small: mini }">
			<uni-icons type="search" :size="mini ? 18 : 20" color="#999"></uni-icons>
			<input 
				class="search-input" 
				type="text" 
				:placeholder="placeholder" 
				confirm-type="search" 
				:disabled="disabled"
				@confirm="handleSearch"
				@click="inputClick"
			/>
			<button class="search-btn" @click="handleSearch">搜索</button>
		</view>
		<view class="order-icon" v-if="!mini && showOrder">
			<image class="icon-img" src="/static/icon/order.png" mode="aspectFill"></image>
			<text class="icon-text">订单</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'SearchBar',
	props: {
		placeholder: {
			type: String,
			default: '奈雪的茶'
		},
		mini: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		showOrder: {
			type: Boolean,
			default: true
		}
	},
	methods: {
		handleSearch() {
			this.$emit('search');
		},
		inputClick() {
			console.log('asdfclick')
			this.$emit('click');
		},
	}
}
</script>

<style lang="scss" scoped>
$primary-color: #FFC300;

.search-bar-wrapper {
	position: relative;
	display: flex;
	align-items: center;
	padding: 6rpx 24rpx 20rpx;
	z-index: 20;
	
	.search-box {
		flex: 1;
		height: 72rpx;
		background: #fff;
		border: 2rpx solid $primary-color;
		border-radius: 36rpx;
		display: flex;
		align-items: center;
		padding: 0 10rpx 0 24rpx;
		
		.search-input {
			flex: 1;
			font-size: 28rpx;
			margin-left: 10rpx;
		}
		
		.search-btn {
			width: 120rpx;
			height: 56rpx;
			line-height: 56rpx;
			background: $primary-color;
			border-radius: 28rpx;
			font-size: 26rpx;
			color: #333;
			margin: 0;
			padding: 0;
			
			&::after { border: none; }
		}
		
		&.small .search-btn {
			height: 48rpx;
			line-height: 48rpx;
			width: auto;
			padding: 0 20rpx;
			font-size: 24rpx;
		}
	}
	
	.order-icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-left: 20rpx;
		
		.icon-text {
			font-size: 22rpx;
			color: #333;
		}

		.icon-img {
			width: 34rpx;
			height: 34rpx;
		}
	}
}

.mini-wrapper {
	flex: 1;
	padding: 0;
	.search-box {
		// height: 72rpx;
	}
}
</style>
