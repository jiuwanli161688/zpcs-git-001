<template>
	<view class="container">
		<view class="wrap-receive sendAddress" v-if="isComplete">
			<view class="tit-box">
				<view class="title">反馈信息</view>
			</view>
			<view class="receive">
				<view class="bd">姓名：{{ objWorkOrder.name }}</view>
				<view class="bd">电话：{{ objWorkOrder.mobile }}</view>
				<view class="bd">反馈内容：{{ objWorkOrder.complaintContent }}</view>
			</view>
			<view class="tit-box" v-if="objWorkOrder.picList">
				<view class="title">反馈图片</view>
			</view>
			<view class="feedback-img" v-if="objWorkOrder.picList">
				<view class="img-box" v-for="(item, index) in objWorkOrder.picList" :key="index">
					<image class="img" :src="item" mode="aspectFit"></image>
				</view>

			</view>
		</view>
		<view class="wrap-process" v-if="isComplete">
			<view class="list">
				<view class="item" v-for="(item, index) in arrWorkOrder" :key="index">
					<view class="hd">
						<image class="icon" :src="iconStep" mode="aspectFit"></image>
						<view class="text">{{ item.createTime }}</view>
						<view class="express" v-if="item.status == 0">待处理</view>
						<view class="express" v-if="item.status == 1">处理中</view>
						<view class="express" v-if="item.status == 2">已处理</view>
					</view>
					<view class="bd" v-if="item.ticketTypeName">原因：{{ item.ticketTypeName }}</view>
					<view class="bd" v-if="item.dealResult">处理结果：{{ item.dealResult }}</view>
					<view class="attachment" v-for="(address, index) in item.files" :key="index">
						<view class="attach-box">
							<view class="attachAddress" v-if="address.length > 0">附件地址：<button
									@tap="copyAddress(address)" class="copy-btn">复制</button>{{ address }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getWorkOrder } from '@/api/after-sale.js'
export default {
	data() {
		return {
			isComplete: false,
			iconStep: `${this.iconCommon}/static/v1/sales/icon-step.png`,
			complaintNumber: "",
			arrWorkOrder: {},
			objWorkOrder: {},
		};
	},
	methods: {
		loadWorkOrder: function () {
			getWorkOrder(this.complaintNumber).then(res => {
				if (res.data.success) {
					this.isComplete = true;
					this.objWorkOrder = res.data.result;
					this.arrWorkOrder = this.objWorkOrder.data.rows;
				}
			})
		},
		copyAddress(address) {
			uni.setClipboardData({
				data: address,
				success: function () {
					uni.showToast({
						title: '复制成功',
						icon: 'none'
					})
				},
				fail: function () {
					uni.showToast({
						title: '复制失败',
						icon: 'none'
					})
				}
			})
		}
	},
	onLoad: function (options) {
		// 获取公单号
		this.complaintNumber = options.complaintNumber;
		// 加载上门取件订单详情信息
		this.loadWorkOrder()

	},
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;

	.sendAddress {
		border-radius: 40rpx 40rpx 0 0;
		margin: 0;


		.tit {
			font-size: 35rpx;
		}

		.bd {
			color: #989898;
			font-size: 30rpx;
			margin: 8rpx 0;
		}

		.feedback-img {
			width: 100%;
			height: 100%;
			overflow: hidden;

			.img {
				width: 30%;
				height: 160rpx;
				float: left;
				margin: 10rpx 10rpx;
			}
		}

	}

	.wrap-process {

		.list {

			.item {

				.hd {

					.express {
						text-align: right;
						flex: 1;
						font-weight: bold;
						color: #f00;
					}

					.text {
						color: #989898;
					}
				}

				.bd {
					font-weight: bold;
					color: #333;
				}

				.attachment {
					width: 100%;
					height: 100%;

					.attach-box {
						display: flex;

						.attachAddress {
							width: 100%;
							word-wrap: break-word;
						}
					}

					.copy-btn {
						// width: 120rpx;
						height: 40rpx;
						font-size: 28rpx;
						line-height: 40rpx;
						border: 1px solid #f00;
						background-color: transparent;
						color: #f00;
						display: inline-block;
						position: relative;
						top: 7%
					}
				}
			}
		}

	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
	}

}
</style>
