<template>
	<view class="cpn" @tap="handlerDetail">
		<view class="hd">
			<view class="store-info">
				<view class="lab">【{{ order.storeName }}】</view>
				<view class="txt">{{ order.statusText }}</view>
			</view>
		</view>
		<order-item-body :goods="goods" :total="order.flowPrice" />
		<view class="ft">
			<!-- 待付款 -->
			<view  class="link-item item-view" @tap.stop="handlerDetail">查看</view>
			<!-- 待发货 -->
			<view v-if="order.orderStatus == 'UNDELIVERED'" class="link-item link-primary" @tap.stop="handlerExpress">发货</view>
		</view>
	</view>
</template>

<script>

	import OrderItemBody from './OrderItemBody'

	export default{
		name: '',
		components: {
			OrderItemBody
		},
		props: {
			order: {
				type: Object,
				default: () => {}
			},
			goods: {
				type: Array,
				default: () => []
			},
			total: {
				type: Number,
				default: 0
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
			// 触发发货
			handlerExpress: function(e){
				this.$emit('express', {index: this.$props.index})
			},
			// 触发详情
			handlerDetail: function(e){
				this.$emit('detail', {index: this.$props.index})
			},
		}
	}
</script>

<style lang="scss" scoped>
.cpn{
	background: #FFF;
	border-radius: 12rpx;
	padding: 24rpx 20rpx;
	.hd{
		position: relative;
		.store-info{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.lab{
				color: #333333;
				min-width: 140rpx;
				font-weight: 500;
			}
			.txt{
				font-size: 28rpx;
				color: #F10100;
			}
		}

	}
	.ft{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		position: relative;
		padding: 20rpx 0 0;
		.link-item{
			display: inline-block;
			background-color: #fff;
			border: 2rpx solid #DCDEE0;
			border-radius: 12rpx;
			font-size: 28rpx;
			color: #323232;
			text-align: center;
			margin: 0 0 0 16rpx;
			padding: 4rpx 16rpx;
		}
		.link-primary{
			border: 3rpx solid #EE0A24;
			color: #EE0A24;
		}
		.item-view{
			border: 2rpx solid #666666;
			color: #333333;
		}
	}
}
</style>
