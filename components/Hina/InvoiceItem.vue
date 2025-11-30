<template>
	<view class="cpn" @tap="handlerDetail">
		<view class="hd">
			<view class="lab-txt">
				<view class="lab">订单编号</view>
				<view class="txt">{{order.sn}}</view>
			</view>
			<view class="flag" :class="{'flag-success': order.receiptStatus == 1,'flag-warning': order.receiptStatus == 3}">{{order.invoiceStatusText}}</view>
		</view>
		<order-item-body :goods="goods" :total="total" />
		<view class="ft">
			<view class="link">
				<!-- 未开 -->
				<view v-if="order.receiptStatus == 0 && order.isInvoiceOutTime == false" class="link-item link-primary" @tap.stop="handlerApply">申请</view>
				<!-- 已开：注意判断重开时效 -->
				<view v-if="order.receiptStatus == 3" class="link-item link-primary" @tap.stop="handlerReopen">重开</view>
				<!-- 无论何时都可以查看 -->
				<view class="link-item item-view" @tap.stop="handlerDetail">查看</view>
			</view>
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
			// 触发申请
			handlerApply: function(e){
				this.$emit('apply', {index: this.$props.index})
			},
			// 触发重开
			handlerReopen: function(e){
				this.$emit('reopen', {index: this.$props.index})
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 26rpx;
		.lab-txt{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.lab{
				color: #999;
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
		.flag{
			font-size: 26rpx;
			color: #E22221;
		}
		.flag-success{
			color: #67c23a;
		}
		.flag-warning{
			color: #ff6c00;
		}
	}
	.ft{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		position: relative;
		padding: 20rpx 0 0;
		.link{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.link-item{
				border: 3rpx solid #DCDEE0;
				border-radius: 12rpx;
				font-size: 28rpx;
				color: #323232;
				text-align: center;
				margin: 0 0 0 16rpx;
				padding: 3rpx 14rpx;
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
}
</style>