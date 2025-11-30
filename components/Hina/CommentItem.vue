<template>
	<view class="cpn">
		<view class="hd">
			<view class="store-info">
				<view class="lab">【{{ order.storeName }}】</view>
				<view class="txt">{{ order.orderStatusText }}</view>
			</view>
		</view>

		<view @tap="shopDetail">
			<order-item-body :goods="goods" :total="total" />
		</view>
		<view class="ft">
			<!-- 已评价-审核通过 -->
			<view v-if="order.commentStatus == 'FINISHED'" class="link-item item-view" @tap.stop="handlerDetail">查看</view>
			<!-- 已评价-审核失败 -->
			<view v-if="order.commentStatus == 'REJECTED'" class="link-item item-orange" @tap.stop="handlerUpdate">修改</view>
			<!-- 待审核 -->
			<view v-if="order.commentStatus == 'WAIT_AUDIT' || order.commentStatus == 'WAIT_RECHECK'" class="link-item link-primary" @tap.stop="handlerDetail">审核中
			</view>
			<!-- 待评价 -->
			<view v-if="order.commentStatus == 'UNFINISHED'" class="link-item item-orange" @tap.stop="handlerInsert">发表
			</view>
		</view>
	</view>
</template>

<script>

import OrderItemBody from './OrderItemBody'

export default {
	name: '',
	components: {
		OrderItemBody
	},
	props: {
		order: {
			type: Object,
			default: () => { }
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
	data() {
		return {
			isComplete: false,

		}
	},
	methods: {
		// 触发评价
		handlerInsert: function (e) {
			this.$emit('insert', { index: this.$props.index })
		},
		// 触发修改
		handlerUpdate: function (e) {
			this.$emit('update', { index: this.$props.index })
		},
		// 触发详情
		handlerDetail: function (e) {
			this.$emit('detail', { index: this.$props.index })
		},
		//触发跳转商品详情
		shopDetail: function (e) {
			this.$emit('shop', { index: this.$props.index })
		}
	}
}
</script>

<style lang="scss" scoped>
.cpn {
	background: #FFF;
	border-radius: 12rpx;
	padding: 24rpx 20rpx;
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
	.hd {
		position: relative;

		.line {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height: 48rpx;
			line-height: 48rpx;

			.lab {
				color: #999;
				min-width: 140rpx;
				position: relative;

				&::after {
					position: relative;
					content: '：';
				}
			}

			.txt {
				color: #666;
			}
		}

	}

	.ft {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		position: relative;
		padding: 20rpx 0 0;
		.link-item {
			border: 3rpx solid #DCDEE0;
			border-radius: 12rpx;
			font-size: 28rpx;
			color: #323232;
			text-align: center;
			margin: 0 0 0 16rpx;
			padding: 3rpx 14rpx;
		}

		.link-primary {
			border: 3rpx solid #EE0A24;
			color: #EE0A24;
		}
		.item-view{
			border: 2rpx solid #666666;
			color: #333333;
		}
		.item-orange {
			border: 2rpx solid #A17600;
			color: #A17600;
		}
	}
}
</style>