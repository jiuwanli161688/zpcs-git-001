<template>
	<view class="bd">
		<view class="icon" :style="{background: 'url('+ goods.goodsImage +')'}"></view>
		<view class="info">
			<view class="txt">{{goods.goodsName}}</view>
			<view class="inf">
				<view class="price">{{goods.goodsPrice | unitPrice}}</view>
				<view class="count">×{{goods.num}}</view>
			</view>
		</view>
	</view>
</template>

<script>

	export default{
		name: '',
		props: {
			goods: {
				type: Object,
				default: () => {}
			}
		},
		data(){
			return {
				isComplete: false,

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
.bd{
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 20rpx 0;
	position: relative;

	.icon{
		width: 160rpx;
		height: 160rpx;
		background-size: cover !important;
		background-position: 50% 50% !important;
	}
	.info{
		width: calc(100vw - 40rpx - 40rpx - 160rpx - 20rpx);
		height: 160rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		.txt{
			height: 72rpx;
			line-height: 36rpx;
			font-size: 28rpx;
			color: #333;
			word-break: break-all;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.inf{
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 40rpx;
			.price{
				color: #E22221;
				font-size: 26rpx;
				font-weight: 600;
			}
			.count{
				color: #999;
				font-size: 26rpx;
			}
		}
	}
}
</style>