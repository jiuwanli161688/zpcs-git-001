<template>
	<view class="cpn">
		<view class="hd">
			<view class="line">
				<view class="lab">结算单号</view>
				<view class="txt">{{settlement.settlementNumber}}</view>
			</view>
			<view class="line">
				<view class="lab">创建时间</view>
				<view class="txt">{{settlement.createTime}}</view>
			</view>
			<view class="line">
				<view class="lab">结算状态</view>
				<view class="txt">
					<text>平台审核账单 <text class="separator">-</text> </text>
					<text class="status-type red-status"> {{settlement.statusGroupDesc}}</text>
				</view>
			</view>
		</view>
		<view class="bd">
			<view class="line">订单总额</view>
			<view class="txt"><span class="price-prefix">￥</span><span class="price-value">{{ settlement.settlementTotalAmount | unitPrice }}</span></view>
		</view>
		<view class="ft">
			<view class="link-item" @tap="handlerDetail">查看详情</view>
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
		font-size: 26rpx;
		color: #999;

		.line{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height: 48rpx;
			line-height: 48rpx;
			.lab{
				position: relative;
				&::after{
					position: relative;
					content: '：';
				}
			}
			.txt{
				.separator{
					margin: 0 8rpx;
				}
				.status-type{
					&.red-status{
						color: #e22221;
						font-weight: 500;
					}
				}
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
		display: flex;
		align-items: center;
		justify-content: flex-end;
		.line{
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 56rpx;
			font-size: 26rpx;
			color: #999;
			.lab{
				color: #999;
			}
		}
		.txt{
			margin-left: 16rpx;
			color: #EC021D;
			font-weight: 600;
			font-size: 24rpx;
			.price-prefix{

			}
			.price-value{
				font-size: 34rpx;
			}
		}
	}
	.ft{
		height: 86rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.link-item{
			border: 3rpx solid #DCDEE0;
			min-width: 144rpx;
			height: 52rpx;
			border-radius: 12rpx;
			line-height: 52rpx;
			font-size: 26rpx;
			color: #323232;
			text-align: center;
			margin: 0 0 0 16rpx;
			border: 3rpx solid #EE0A24;
			color: #EE0A24;
		}
	}
}
</style>