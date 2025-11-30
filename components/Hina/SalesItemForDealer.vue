<template>
	<view class="cpn">
		<view class="hd">
			<view class="line">
				<view class="lab">售后单号</view>
				<view class="txt">{{ sales.sn }}</view>
			</view>
			<view class="line">
				<view class="lab">售后状态</view>
				<view class="txt">{{ statusText }}</view>
			</view>
      <view class="line">
        <view class="lab">申请时间</view>
        <view class="txt">{{ sales.createTime }}</view>
      </view>
      <view class="line">
        <view class="lab">退款类型</view>
        <view class="txt">{{ sales.serviceType == 'RETURN_GOODS' ? '退货' :'换货' }}</view>
      </view>
		</view>
		<sales-item-body :goods="sales" />
		<view class="ft">
			<view class="text">
				<view class="lab">实付</view>
				<view class="txt">{{ sales.flowPrice | unitPrice }}</view>
			</view>
			<view class="link">
				<view class="link-item link-primary" @tap="handlerDetail">详情</view>
			</view>

		</view>
	</view>
</template>

<script>

import SalesItemBody from './SalesItemBody'

export default {
	name: '',
	components: {
		SalesItemBody
	},
	props: {
		sales: {
			type: Object,
			default: () => { }
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
	computed: {
		// 售后状态
		statusText() {
			const statusText = {
				'APPLY': '申请中',
				'PASS': '已通过',
				'REFUSE': '已拒绝',
				'BUYER_RETURN': '待卖家收货',
				'SELLER_CONFIRM': '卖家确认收货',
				'SELLER_TERMINATION': '卖家终止售后',
				'BUYER_CANCEL': '买家取消售后',
				'WAIT_REFUND': '等待平台退款',
				'COMPLETE': '完成售后服务',
				'WAITING_RETURN': '等待商品回寄',
				'WAITING_REISSUE': '等待商品补发',
			};
			return statusText[this.sales.serviceStatus] || '';
		}
	},
	created() {

	},
	methods: {
		// 触发售后详情
		handlerDetail: function () {
			this.$emit('detail', { index: this.$props.index })
		},
	},
	onLoad: function () {

	},
	onShow: function () {

	}
}
</script>

<style lang="scss" scoped>
.cpn {
	background: #FFF;
	border-radius: 12rpx;
	padding: 0 20rpx;

	.hd {
		position: relative;
		padding: 16rpx 0;

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

		&::after {
			position: absolute;
			content: '';
			left: 0;
			right: 0;
			bottom: 0;
			height: 3rpx;
			background: #E7E7E7;
		}
	}

	.ft {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 96rpx;
		position: relative;

		&::after {
			position: absolute;
			content: '';
			left: 0;
			right: 0;
			top: 0;
			height: 3rpx;
			background: #E7E7E7;
		}

		.text {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			font-size: 26rpx;

			.lab {
				color: #999;
				position: relative;

				&::after {
					position: relative;
					content: '：';
				}
			}

			.txt {
				color: #E22221;
				font-weight: 600;
			}
		}

		.link {
			display: flex;
			justify-content: flex-end;
			align-items: center;

			.link-item {
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

			.link-primary {
				border: 3rpx solid #EE0A24;
				color: #EE0A24;
			}
		}

	}
}</style>