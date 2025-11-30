<template>
	<view class="cpn">
		<view class="hd">
			<view class="line">
				<view class="lab">订单编号</view>
				<view class="txt">{{order.orderNumber}}</view>
			</view>
			<view class="line">
				<view class="lab">完成时间</view>
				<view class="txt">{{order.orderFinishedTime}}</view>
			</view>
		</view>
		<view class="bd">
			<view class="line">
				<view class="lab">订单价格</view>
				<view class="num">{{order.orderTotalAmount}}</view>
			</view>
			<view class="line">
				<view class="lab">结算价</view>
				<view class="num">{{order.orderFinalPrice}}</view>
			</view>
			<view class="line">
				<view class="lab">供应商收益</view>
				<view class="num">{{order.orderIncome}}</view>
			</view>
		</view>
	</view>
</template>

<script>

	export default{
		name: '',
		props: {
			order: {
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
.cpn{
	background: #FFF;
	border-radius: 12rpx;
	padding: 0 20rpx;
	.hd{
		position: relative;
		padding: 16rpx 0;
		.line{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height: 48rpx;
			line-height: 48rpx;
			.lab{
				color: #999;
				min-width: 140rpx;
				position: relative;
				&::after{
					position: relative;
					content: '：';
				}
			}
			.txt{
				color: #666;
			}
		}
		&::after{
			position: absolute;
			content: '';
			left: 0;
			right: 0;
			bottom: 0;
			height: 3rpx;
			background: #E7E7E7;
		}
	}
	.bd{
		padding: 16rpx 0;
		.line{
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 56rpx;
			.lab{
				color: #999;
				font-size: 28rpx;
			}
			.txt{
				color: #E22221;
				font-size: 26rpx;
			}
		}
	}
}
</style>
