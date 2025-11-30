<template>
	<view class="container">

		<!-- 结算状态 -->
		<view class="wrap-state" v-if="isComplete">
			<image class="icon" :src="iconStatus" mode="aspectFit"></image>
			<view class="text">{{ objSettlement.statusText }}</view>
		</view>
		<view class="wrap-tips">
			<image :src="iconTips" mode="aspectFit" class="icon"></image>
			<view class="text">结算单操作：请前往中品维度电脑端进行操作</view>
		</view>
		<view class="wrap-base">
			<view class="rs">
				<view class="lab">订单总额</view>
				<view class="inf">{{ objSettlement.settlementTotalAmount | unitPrice }}</view>
			</view>
			<view class="rs">
				<view class="lab">实付总额</view>
				<view class="inf">{{ objSettlement.settlementActualPayment | unitPrice }}</view>
			</view>
			<view class="rs">
				<view class="lab">积分总额</view>
				<view class="inf">{{ objSettlement.settlementTotalPoints }}</view>
			</view>
			<view class="rs">
				<view class="lab">运费总额</view>
				<view class="inf">{{ objSettlement.transportationTotalAmount | unitPrice }}</view>
			</view>
			<view class="rs">
				<view class="lab">扣减退货</view>
				<view class="inf">{{ objSettlement.refundMoney | unitPrice }}</view>
			</view>
			<view class="rs">
				<view class="lab">逆向运费</view>
				<view class="inf">{{ objSettlement.reverseFreightMoney | unitPrice }}</view>
			</view>
			<view class="rs">
				<view class="lab">转入保证金</view>
				<view class="inf">{{ objSettlement.depositMoney | unitPrice }}</view>
			</view>
			<view class="rs">
				<view class="lab">违约金（罚单）</view>
				<view class="inf">{{ objSettlement.fineMoney | unitPrice }}</view>
			</view>
			<view class="rs">
				<view class="lab">结算金额</view>
				<view class="inf">{{ objSettlement.finalTotalAmount | unitPrice }}</view>
			</view>
			<view class="rs">
				<view class="lab">提交时间</view>
				<view class="inf">{{ objSettlement.createTime }}</view>
			</view>
		</view>
		<!-- 发票 -->
		<view class="wrap-invoice">
			<view class="name">发票信息</view>
			<view class="file">
				<image class="icon" :src="iconFile" mode="aspectFit"></image>
				<view class="info">
					<view class="text">发票.pdf</view>
					<view class="date">{{ objInvoice.latestInvoiceUploadTime ? objInvoice.latestInvoiceUploadTime : '暂无' }}
					</view>
				</view>
			</view>
		</view>
		<!-- 日志 -->
		<view class="wrap-event">
			<view class="name">审批日志</view>
			<view class="list">
				<view class="item" v-for="item in arrOperateLogs">
					<view class="hd">
						<view class="text">{{ item.resultDetails }}</view>
						<view class="date">{{ item.createTime }}</view>
					</view>
					<view class="ft">{{ item.operatorDetails }}</view>
				</view>

			</view>
		</view>
		<!-- 订单 -->
		<view class="wrap-order">
			<view class="name">结算订单</view>
			<view class="list">
				<view class="item" v-for="(item, index) in objSettlement.order" :key="index">
					<settlement-order-item :order="item" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>

import SettlementOrderItem from "@/components/Hina/SettlementOrderItemForSupplier";
import { getStoreSettlementInfoDetail } from "../../api/store";

export default {
	name: '',
	components: {
		SettlementOrderItem
	},
	data() {
		return {
			id: "",
			isComplete: false,
			iconBasePath: `${this.iconCommon}/static/v1/sales`,
			iconStatus: '',
			iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,
			iconFile: `${this.iconCommon}/static/v1/order/icon-pdf.png`,
			objSettlement: {
				code: ''
			},
			objInvoice: {
				invoiceFile: ''
			},
			arrOperateLogs: []
		}
	},
	methods: {
		// 加载结算信息
		loadBaseData: function () {
			this.isComplete = true
			let that = this;
			uni.showLoading({})
			getStoreSettlementInfoDetail({ id: this.id }).then(res => {
				uni.hideLoading();
				if (res.data.code == 200) {
					that.objSettlement = res.data.result.settlementInfoVO;
					that.objInvoice = res.data.result.settlementInvoiceVO ? res.data.result.settlementInvoiceVO : {};
					that.arrOperateLogs = res.data.result.settlementOperationLogVOS;
					that.objSettlement.order = res.data.result.settlementOrderVOS;
					if (this.objSettlement.settlementStatus == 1) {
						// 平台审核账单 - 待审核
						this.objSettlement.statusText = '平台审核账单 - 待审核'
						this.iconStatus = `${this.iconBasePath}/icon-process.png`
					} else if (this.objSettlement.settlementStatus == 2) {
						// 平台审核账单 - 未通过
						this.objSettlement.statusText = '平台审核账单 - 未通过'
						this.iconStatus = `${this.iconBasePath}/icon-fail.png`
					} else if (this.objSettlement.settlementStatus == 3) {
						// 等待提交发票
						this.objSettlement.statusText = '等待提交发票'
						this.iconStatus = `${this.iconBasePath}/icon-process.png`
					} else if (this.objSettlement.settlementStatus == 4) {
						// 平台核验发票 - 待审核
						this.objSettlement.statusText = '平台核验发票 - 待审核'
						this.iconStatus = `${this.iconBasePath}/icon-process.png`
					} else if (this.objSettlement.settlementStatus == 5) {
						// 平台核验发票 - 未通过
						this.objSettlement.statusText = '平台核验发票 - 未通过'
						this.iconStatus = `${this.iconBasePath}/icon-fail.png`
					} else {
						// 平台完成分账
						this.objSettlement.statusText = '平台完成分账'
						this.iconStatus = `${this.iconBasePath}/icon-complete.png`
					}
				} else {
					that.$u.toast(res.data.message);
				}
			})
			this.objSettlement.code = '20202020'
			this.objSettlement.date = '2020-12-12 15:15:15'
		},
	},
	onLoad: function (options) {
		this.id = options.id;
		// 加载结算信息
		this.loadBaseData()
	},
	onShow: function () {

	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;

	.wrap-state {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		z-index: 1;
		background: #E22221;
		min-height: 160rpx;

		.icon {
			width: 48rpx;
			height: 48rpx;
		}

		.text {
			padding: 0 0 0 16rpx;
			font-size: 32rpx;
			font-weight: 600;
			color: #FFF;
		}
	}

	.wrap-tips {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		height: 80rpx;
		font-size: 26rpx;
		padding: 0 20rpx;

		.icon {
			width: 36rpx;
			height: 36rpx;
		}

		.text {
			color: #999;
			padding: 0 0 0 12rpx;
		}
	}

	.wrap-base {
		background: #FFF;
		border-radius: 12rpx;
		padding: 20rpx;
		margin: 0 20rpx 20rpx;

		.rs {
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 48rpx;

			.lab {
				color: #999;
				min-width: 140rpx;
				font-size: 28rpx;
				position: relative;
			}

			.inf {
				font-size: 28rpx;
				color: #333;
				font-weight: 400;
			}
		}
	}

	.wrap-invoice {
		background: #FFF;
		border-radius: 12rpx;
		padding: 0 20rpx;
		margin: 0 20rpx 20rpx;

		.name {
			line-height: 88rpx;
			color: #333;
			font-size: 28rpx;
			font-weight: 600;
			position: relative;

			&::after {
				position: absolute;
				content: '';
				left: 0;
				right: 0;
				bottom: 0;
				height: 3rpx;
				background: #F1F1F1;
			}
		}

		.file {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 16rpx 0;

			.icon {
				width: 100rpx;
				height: 100rpx;
			}

			.info {
				width: calc(100vw - 40rpx - 40rpx);
				box-sizing: border-box;
				padding: 0 0 0 20rpx;
				line-height: 48rpx;

				.text {
					color: #333;
					font-size: 26rpx;
					font-weight: 600;
				}

				.date {
					font-size: 24rpx;
					color: #999;
					line-height: 48rpx;
				}
			}
		}
	}

	.wrap-event {
		background: #FFF;
		border-radius: 12rpx;
		padding: 0 20rpx;
		margin: 0 20rpx 20rpx;

		.name {
			line-height: 88rpx;
			color: #333;
			font-size: 28rpx;
			font-weight: 600;

			position: relative;

			&::after {
				position: absolute;
				content: '';
				left: 0;
				right: 0;
				bottom: 0;
				height: 3rpx;
				background: #F1F1F1;
			}
		}

		.list {
			.item {
				padding: 16rpx 0;
				position: relative;

				&::after {
					position: absolute;
					content: '';
					left: 0;
					right: 0;
					bottom: 0;
					height: 3rpx;
					background: #F1F1F1;
				}

				&:last-of-type {
					&::after {
						display: none;
					}
				}

				.hd {
					color: #333;
					font-size: 26rpx;
					line-height: 48rpx;
					padding: 0 0 0 16rpx;
					position: relative;
					display: flex;
					justify-content: space-between;
					align-items: center;

					&::after {
						position: absolute;
						content: '';
						background: #E22221;
						width: 6rpx;
						height: 6rpx;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
					}

					.text {
						color: #333;
					}

					.date {
						color: #999;
					}
				}

				.bd {
					margin: 6rpx 0 0;
					color: #E22221;
					font-size: 24rpx;
					line-height: 40rpx;
				}

				.ft {
					text-align: left;
					color: #999;
					font-size: 24rpx;
					line-height: 48rpx;
				}
			}
		}
	}

	.wrap-order {
		padding: 0 20rpx;

		.name {
			font-size: 28rpx;
			color: #333;
			font-weight: 600;
			height: 96rpx;
			line-height: 96rpx;
			padding: 0 0 0 20rpx;
			margin: 0 0 12rpx;
			position: relative;

			&::after {
				position: absolute;
				content: '';
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 6rpx;
				height: 40rpx;
				border-radius: 6rpx;
				background: #E22221;
			}
		}

		.list {
			padding: 0 0 20rpx;

			.item {
				margin: 0 0 20rpx;

				&:last-of-type {
					margin: 0;
				}
			}
		}
	}
}
</style>
