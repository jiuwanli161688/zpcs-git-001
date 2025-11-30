<template>
	<view class="section" id="section-alpha">
		<view class="section-title">字母索引</view>
		<view class="alpha-grid">
			<view class="alpha-item" v-for="letter in alphabet" :key="letter" @click="$emit('change', letter)">
				{{ letter }}
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'city-alphabet',
	props: {
		alphabet: {
			type: Array,
			default: () => []
		}
	}
}
</script>

<style lang="scss" scoped>
.section {
	background-color: #fff;
	margin: 20rpx;
	padding: 20rpx;
	border-radius: 24rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 24rpx;
}

.alpha-grid {
	display: grid;
	grid-template-columns: repeat(9, 1fr);
	gap: 10rpx;

	.alpha-item {
		width: auto;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		font-size: 26rpx;
		color: #222;
		border-radius: 6rpx;
		background: #F9F9F9;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		box-sizing: border-box;
		border-radius: 8rpx;
	}
}

</style>
