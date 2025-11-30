<template>
	<view class="cpn">
		<view class="hd">
			<view class="line">
				<view class="lab">结算单号</view>
				<view class="txt">{{settlement.code}}</view>
			</view>
			<view class="line">
				<view class="lab">结算状态</view>
				<view class="txt">{{settlement.statusText}}</view>
			</view>
		</view>
		<view class="bd">
			<view class="rs">
				<view class="lab">订单总额</view>
				<view class="inf">{{settlement.origin | unitPrice}}</view>
			</view>
			<view class="rs">
				<view class="lab">实付总额</view>
				<view class="inf">{{settlement.fact | unitPrice}}</view>
			</view>
			<view class="rs">
				<view class="lab">积分总额</view>
				<view class="inf">{{settlement.integral}}</view>
			</view>
			<view class="rs">
				<view class="lab">运费总额</view>
				<view class="inf">{{settlement.postage | unitPrice}}</view>
			</view>
			<view class="rs">
				<view class="lab">结算金额</view>
				<view class="inf">{{settlement.money | unitPrice}}</view>
			</view>
		</view>
		<view class="ft">
			<view class="link-item" @tap="handlerDetail">查看明细</view>
		</view>
	</view>
</template>

<script>

	export default{
		name: '',
		components: {

		},
		props: {
			settlement: {
				type: Object,
				default: () => {}
			},
			index: {
				type: Number,
				default: 0
			}
		},
		data(){
			return {
				isComplete: false,

			}
		},
		methods: {
			// 触发售后详情
			handlerDetail: function(){
				this.$emit('detail', {index: this.$props.index})
			},
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
		position: relative;
		&::after{
			position: absolute;
			content: '';
			left: 0;
			right: 0;
			bottom: 0;
			height: 3rpx;
			background: #E7E7E7;
		}
		.rs{
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 48rpx;
			.lab{
				color: #999;
				min-width: 140rpx;
				font-size: 28rpx;
				position: relative;
			}
			.inf{
				font-size: 28rpx;
				color: #333;
				font-weight: 400;
			}
		}
	}
	.ft{
		height: 96rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.link-item{
			border: 3rpx solid #DCDEE0;
			min-width: 144rpx;
			height: 64rpx;
			border-radius: 12rpx;
			line-height: 64rpx;
			font-size: 28rpx;
			color: #323232;
			text-align: center;
			margin: 0 0 0 16rpx;
			border: 3rpx solid #EE0A24;
			color: #EE0A24;
		}
	}
}
</style>
