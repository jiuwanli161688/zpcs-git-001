<template>
	<view class="cpn">
		<view class="hd">
			<view class="line">
				<view class="lab">售后单号</view>
				<view class="txt">{{sales.sn}}</view>
			</view>
			<view class="line">
				<view class="lab">售后状态</view>
				<view class="txt">{{sales.statusText}}</view>
			</view>
      <view class="line">
        <view class="lab">退货类型</view>
        <view class="txt">{{ sales.goodsReturn?'退货退款':'退款不退货' }}</view>
      </view>
		</view>
		<sales-item-body :goods="sales" />
		<view class="ft">
			<view class="text">
				<view class="lab">订单总实付</view>
				<view class="txt">{{sales.flowPrice | unitPrice}}</view>
			</view>
			<view class="link">
				<view class="link-item link-primary" @tap="handlerDetail">详情</view>
			</view>

		</view>
	</view>
</template>

<script>

	import SalesItemBody from './SalesItemBody'

	export default{
		name: '',
		components: {
			SalesItemBody
		},
		props: {
			sales: {
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

	.ft{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 96rpx;
		position: relative;
		&::after{
			position: absolute;
			content: '';
			left: 0;
			right: 0;
			top: 0;
			height: 3rpx;
			background: #E7E7E7;
		}
		.text{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			font-size: 26rpx;
			.lab{
				color: #999;
				position: relative;
				&::after{
					position: relative;
					content: '：';
				}
			}
			.txt{
				color: #E22221;
				font-weight: 600;
			}
		}
		.link{
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
			}
			.link-primary{
				border: 3rpx solid #EE0A24;
				color: #EE0A24;
			}
		}

	}
}
</style>
