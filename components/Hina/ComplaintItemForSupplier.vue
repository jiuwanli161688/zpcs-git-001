<template>
	<view class="cpn">
		<view class="hd">
			<view class="line">
				<view class="lab">投诉单号</view>
				<view class="txt">{{ complaint.complaintSn }}</view>
			</view>
			<view class="line">
				<view class="lab">投诉状态</view>
				<view class="txt">{{ complaint.statusText }}</view>
			</view>
		</view>
		<view class="bd">
			<view class="icon" :style="{ background: 'url(' + complaint.goodsImage + ')' }"></view>
			<view class="info">
				<view class="txt">{{ complaint.goodsName }}</view>
				<view class="inf">
					<view class="price">{{ complaint.goodsPrice | unitPrice }}</view>
					<view class="count">×{{ complaint.num }}</view>
				</view>
			</view>
		</view>
		<view class="ft">
			<view class="text">
				<view class="lab">实付</view>
				<view class="txt">{{ complaint.flowPrice | unitPrice }}</view>
			</view>
			<view class="link">
				<view class="link-item" v-if="complaint.status == 1 || complaint.status == 2" @tap="handlerContinue">
					{{ complaint.status == 2 ? '提交举证' : '继续举证' }}</view>
				<view class="link-item link-primary" @tap="handlerDetail">详情</view>
			</view>

		</view>
	</view>
</template>

<script>


import { storeComplainDetail } from "../../api/store";

export default {
	name: '',
	components: {

	},
	props: {
		complaint: {
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
			id: '',
			objData: {}
		}
	},
	methods: {
		// 触发继续举证
		handlerContinue: function () {
			this.$emit('continue', { index: this.$props.index })
		},
		// 触发投诉详情
		handlerDetail: function () {
			this.$emit('detail', { index: this.$props.index })
		}
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

	.bd {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 20rpx 0;
		position: relative;

		&::after {
			position: absolute;
			content: '';
			left: 0;
			right: 0;
			bottom: 0;
			height: 3rpx;
			background: #E7E7E7;
		}

		.icon {
			width: 160rpx;
			height: 160rpx;
			background-size: cover !important;
			background-position: 50% 50% !important;
		}

		.info {
			width: calc(100vw - 40rpx - 40rpx - 160rpx - 20rpx);
			height: 160rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			box-sizing: border-box;

			.txt {
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

			.inf {
				display: flex;
				justify-content: space-between;
				align-items: center;
				line-height: 40rpx;

				.price {
					color: #E22221;
					font-size: 26rpx;
					font-weight: 600;
				}

				.count {
					color: #999;
					font-size: 26rpx;
				}
			}
		}
	}

	.ft {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 96rpx;

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
}
</style>
