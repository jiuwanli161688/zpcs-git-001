<template>
	<view class="container">
		<!-- 订单状态 -->
		<view class="wrap-state" v-if="isComplete">
			<view class="base">
				<image class="ico" :src="iconStatusProcess" mode="aspectFit"></image>
				<view class="txt">{{ objData.receiptStatusText }}</view>
			</view>
			<view class="tips">{{ objData.receiptStatus == 0 ? '可开' : '已开' }}发票金额：￥{{ objData.payPrice | unitPrice }}</view>
		</view>
		<view class="wrap-invoice" v-if="isComplete">
			<view class="hd">开票信息</view>
			<view class="bd">
				<view class="view-line">
					<view class="lab">发票类型</view>
					<view class="inf">
						<view class="txt">{{ objData.receiptType == 'GENERAL' ? '数电普票' : '数电专票' }}</view>
					</view>
				</view>
				<view class="view-line">
					<view class="lab">发票抬头</view>
					<view class="inf">
						<view class="txt">{{ objData.receiptTitleType == 'PERSONAL' ? '个人' : '企业' }}</view>
					</view>
				</view>
				<view class="view-line">
					<view class="lab">发票内容</view>
					<view class="inf">
						<view class="txt">商品明细</view>
					</view>
				</view>
				<view class="view-line">
					<view class="lab">开票金额</view>
					<view class="inf">
						<view class="txt">￥{{ objData.payPrice | unitPrice }}</view>
					</view>
				</view>
				<view class="view-line" v-if="objData.email">
					<view class="lab">电子信箱</view>
					<view class="inf">
						<view class="txt">{{ objData.email }}</view>
					</view>
				</view>
				<view class="view-line" v-if="objData.receiptTitleType == 'COMPANY'">
					<view class="lab">单位名称</view>
					<view class="inf">
						<view class="txt">{{ objData.unitName }}</view>
					</view>
				</view>
				<view class="view-line" v-if="objData.receiptTitleType == 'COMPANY'">
					<view class="lab">单位地址</view>
					<view class="inf">
						<view class="txt">{{ objData.unitAddress }}</view>
					</view>
				</view>
				<view class="view-line" v-if="objData.receiptTitleType == 'COMPANY'">
					<view class="lab">纳税人识别号</view>
					<view class="inf">
						<view class="txt">{{ objData.taxpayerId }}</view>
					</view>
				</view>
				<view class="view-line" v-if="objData.receiptTitleType == 'COMPANY'">
					<view class="lab">单位电话</view>
					<view class="inf">
						<view class="txt">{{ objData.phone }}</view>
					</view>
				</view>
				<view class="view-line" v-if="objData.receiptTitleType == 'COMPANY'">
					<view class="lab">开户银行</view>
					<view class="inf">
						<view class="txt">{{ objData.bankAccount }}</view>
					</view>
				</view>
				<view class="view-line" v-if="objData.receiptTitleType == 'COMPANY'">
					<view class="lab">银行账户</view>
					<view class="inf">
						<view class="txt">{{ objData.bankAccountNo }}</view>
					</view>
				</view>
			</view>

			<!-- 未开票 -->
			<view class="ft" v-if="objData.receiptStatus == 0 && objData.isInvoiceOutTime == false">
				<view class="lnk-common lnk-primary" @tap="apply">编辑开票信息</view>
				<view v-if="objData.email" class="lnk-common lnk-secondary" @tap="applyInvoice">立即申请开票</view>
			</view>
			<!-- 已开票，且未过重开时效 -->
			<view class="ft" v-if="objData.receiptStatus == 3">
				<view class="lnk-common lnk-primary" @tap="reopen">申请换开发票</view>
			</view>
		</view>
		<!-- 商品信息 -->
		<view class="wrap-goods" v-if="isComplete">
			<view class="list">
				<view class="item" v-for="(item, index) in objData.goods" :key="index">
					<view class="bd">
						<view class="icon" :style="{ background: 'url(' + item.goodsImage + ')' }"></view>
						<view class="base">
							<view class="txt">{{ item.goodsName }}</view>
							<view class="sku">
								<text class="sku-item">{{ item.simpleSpecs }}</text>
							</view>
							<view class="inf">
								<view class="price">￥{{ item.price | unitPrice }}</view>
								<view class="count">×{{ item.num }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="info">
				<view class="line">
					<view class="lab">实付金额</view>
					<view class="txt">
						<view class="rmb">￥{{ objData.payPrice | unitPrice }}</view>
					</view>
				</view>
				<view class="line">
					<view class="lab">使用积分</view>
					<view class="txt">
						<view class="rmb">{{ objData.useIntegral }}</view>
					</view>
				</view>
				<view class="line">
					<view class="lab">订单编号</view>
					<view class="txt">
						<view class="inf">{{ objData.orderSn }}</view>
					</view>
				</view>
				<view class="line">
					<view class="lab">下单时间</view>
					<view class="txt">
						<view class="inf">{{ objData.createTime }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 发票预览 -->
		<view class="ft" v-if="objData.receiptStatus == 3">
			<view class="lnk-common lnk-primary" @tap="previewInvoice">查看发票</view>
			<view v-if="objData.email" class="lnk-common lnk-secondary" @tap="sendEmail">发送邮件</view>
		</view>
		<!-- <view class="wrap-preview" v-if="objData.receiptStatus == 3">
			<view class="bd">
				<image class="icon" :src="iconDemoInvoice" mode="aspectFit"></image>
			</view>
			<view class="ft">
				<view class="lnk-mail" @tap="sendEmail">发送邮件</view>
				<view class="lnk-down" @tap="download">下载发票</view>
			</view>
		</view> -->

	</view>
</template>

<script>

import { invoiceDetail, invoiceDownload, invoiceSendEmail, applyInvoice } from "@/api/invoice.js"
export default {
	name: "",
	components: {

	},
	data() {
		return {
			isComplete: false,
			iconBasePath: `${this.iconCommon}/static/v1/invoice`,
			iconStatusProcess: '',
			iconDemoInvoice: `${this.iconCommon}/static/v1/demo/demo-invoice.png`,
			objData: {},
			orderSn: ''
		}
	},
	methods: {
		download() {
			//下载发票
			uni.showLoading()
			uni.downloadFile({
				url: this.iconDemoInvoice,
				success: (r) => {
					if (r.statusCode === 200) {
						let tempFilePath = r.tempFilePath;
						uni.saveFile({
							tempFilePath: tempFilePath,
							success: function (res) {
								uni.hideLoading();
								uni.showToast({
									title: "发票已下载到" + res.savedFilePath,
									duration: 2000,
									icon: "none",
								});
							},
						});
					}
				},
			});

		},
		// 预览发票
		previewInvoice() {
			if (!this.iconDemoInvoice) {
				this.$u.toast('发票生成中，请稍后查看...')
				return
			}
			// #ifdef H5
			window.open(this.iconDemoInvoice)
			// #endif
			// #ifdef APP-PLUS || MP-WEIXIN
			uni.showLoading({
				title: '正在下载'
			})
			uni.downloadFile({
				url: this.iconDemoInvoice,
				success: (res) => {
					uni.hideLoading()
					var filePath = res.tempFilePath
					console.log(filePath, '下载成功');
					uni.openDocument({
						filePath: filePath,
						fileType: 'pdf',
						showMenu: true,
						success: (re) => {
							console.log('打开文档成功', re)
						},
						fail: (err) => {
							console.log('打开文档失败', err)
						}
					})
				},
				fail: (er) => {
					uni.hideLoading()
					console.log('下载失败', er)
				}
			})
			// #endif
		},
		// 获取发票地址
		getInvoiceImage() {
			invoiceDownload(this.objData.id).then((res) => {
				if (res.data.success) {
					this.iconDemoInvoice = res.data.result
				} else {

				}
			})
		},

		// 发送邮件到邮箱
		sendEmail() {
			//下载发票
			uni.showLoading()
			invoiceSendEmail(this.objData.id).then((res) => {
				if (res.data.success) {
					if (this.$store.state.isShowToast) { uni.hideLoading() };
					this.$u.toast('发送成功')
				} else {
					this.$u.toast('发送失败')
				}
			})
		},
		// 申请重开
		reopen() {
			uni.navigateTo({
				url: '/pages/profile/invoice/reopen?orderSn=' + this.orderSn
			})
		},
		// 立即开票
		applyInvoice() {
			let params = {
				receiptType: this.objData.receiptType,
				receiptTitleType: this.objData.receiptTitleType,
				email: this.objData.email,
				unitName: this.objData.unitName,
				unitAddress: this.objData.unitAddress,
				taxpayerId: this.objData.taxpayerId,
				phone: this.objData.phone,
				bankAccount: this.objData.bankAccount,
				bankAccountNo: this.objData.bankAccountNo,
				orderSn: this.orderSn,
			}
			applyInvoice(params).then((res) => {
				if (res.data.success) {
					this.$u.toast('正在开票中...')
					uni.navigateBack()
				} else {
					// uni.showModal({
					// 	title: '提示',
					// 	content: '开票失败，请您核对开票信息后重新申请...',
					// 	confirmText: '我知道了',
					// 	showCancel: false,
					// 	success: function (res) {
					// 		if (res.confirm) {

					// 		}
					// 	}
					// });
				}
			})
		},
		// 编辑开票信息
		apply() {
			uni.navigateTo({
				url: '/pages/profile/invoice/apply?orderSn=' + this.orderSn
			})
		},
		// 加载发票信息
		loadBaseData: function () {
			uni.showLoading()
			invoiceDetail(this.orderSn).then((res) => {
				if (res.data.success) {
					if (this.$store.state.isShowToast) { uni.hideLoading() };
					this.isComplete = true
					this.objData = res.data.result
					this.objData.goods = res.data.result.receiptBeforeVO.goodsNameAndCategoryList;
					this.objData.payPrice = res.data.result.receiptBeforeVO.payPrice
					this.objData.useIntegral = res.data.result.receiptBeforeVO.useIntegral
					switch (this.objData.receiptStatus) {
						case 0:	// 未开
							this.iconStatusProcess = `${this.iconBasePath}/icon-process_0.png`
							this.objData.receiptStatusText = '未开票'
							break
						case 1:	// 开票中
							this.iconStatusProcess = `${this.iconBasePath}/icon-process_0.png`
							this.objData.receiptStatusText = '开票中'
							break
						case 2:	// 重开
							this.iconStatusProcess = `${this.iconBasePath}/icon-process_2.png`
							this.objData.receiptStatusText = '待重开'
							break
						case 3:	// 已开
							this.iconStatusProcess = `${this.iconBasePath}/icon-process_1.png`
							this.objData.receiptStatusText = '已开票'
							this.getInvoiceImage()
							break

					}
				}
			});

		}
	},
	onLoad: function (options) {
		this.orderSn = options.orderSn
		// 加载发票信息
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
	position: relative;
	padding: 0 0 20rpx;

	&::before {
		position: absolute;
		content: '';
		left: 0;
		right: 0;
		top: 0;
		background: #E22221;
		height: 240rpx;
	}

	.wrap-state {
		height: 200rpx;
		flex-direction: column;
		color: #FFF;

		.base {
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.ico {
				width: 36rpx;
				height: 36rpx;
			}

			.txt {
				margin: 0 0 0 16rpx;
				font-size: 32rpx;
			}
		}

		.tips {
			height: 40rpx;
			font-size: 26rpx;
		}
	}

	.wrap-invoice {
		background: #FFF;
		position: relative;
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
		z-index: 1;
		margin: 0 0 20rpx;
		padding: 0 0 24rpx;

		.hd {
			line-height: 96rpx;
			color: #333;
			font-weight: 600;
			font-size: 30rpx;
			text-align: center;
		}

		.bd {
			padding: 0 20rpx;

			.view-line {
				display: flex;
				justify-content: flex-start;
				align-items: center;

				.lab {
					min-width: 140rpx;
					font-size: 28rpx;
					line-height: 48rpx;
					color: #999;
					position: relative;

					&::after {
						position: relative;
						content: '：';
					}
				}

				.inf {
					font-size: 26rpx;
					color: #666;
				}
			}

		}

		.ft {
			padding: 0 20rpx;
		}
	}

	.wrap-preview {
		border-radius: 12rpx;
		margin: 20rpx 20rpx 0;
		background: #FFF;

		.bd {
			padding: 20rpx;
			height: 400rpx;
			box-sizing: border-box;

			.icon {
				width: calc(100vw - 40rpx - 40rpx);
				height: 360rpx;
			}
		}

		.ft {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 88rpx;

			.lnk-mail {
				color: #E22221;
				padding: 0 16rpx;
				border: 3rpx solid #E22221;
				height: 54rpx;
				line-height: 48rpx;
				font-size: 24rpx;
				border-radius: 6rpx;
				margin: 0 16rpx;
			}

			.lnk-down {
				color: #666;
				padding: 0 16rpx;
				border: 3rpx solid #DCDEE0;
				height: 54rpx;
				line-height: 48rpx;
				font-size: 24rpx;
				border-radius: 6rpx;
				margin: 0 16rpx;
			}
		}
	}

	.wrap-goods {
		border-radius: 12rpx;
		margin: 0 20rpx;
		background: #FFF;
		position: relative;

		.info {
			margin: 0 20rpx;
			padding: 16rpx 0;
			position: relative;

			&::after {
				position: absolute;
				content: '';
				left: 0;
				right: 0;
				top: 0;
				height: 3rpx;
				background: #F1F1F1;
			}

			.line {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;
				line-height: 56rpx;

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
					display: flex;
					justify-content: flex-end;
					align-items: center;

					.num {
						font-size: 26rpx;
					}

					.inf {
						font-size: 26rpx;
						color: #666;
					}

					.rmb {
						font-size: 26rpx;
						font-weight: 600;
					}
				}
			}
		}
	}



}
</style>