<template>
	<view class="container">

		<!-- 结算状态 -->
		<view class="wrap-state" v-if="isComplete">
			<image class="icon" :src="iconStatus" mode="aspectFit"></image>
			<view class="text">{{ objSettlement.statusText }}</view>
		</view>
		<view class="wrap-base">
			<view class="rs">
				<view class="lab">订单总额</view>
				<view class="inf">￥{{ objSettlement.settlementTotalAmount | unitPrice }}</view>
			</view>
			<view class="rs">
				<view class="lab">实付总额</view>
				<view class="inf">￥{{ objSettlement.settlementActualPayment | unitPrice }}</view>
			</view>
			<view class="rs">
				<view class="lab">积分总额</view>
				<view class="inf">{{ objSettlement.settlementTotalPoints }}</view>
			</view>
			<view class="rs">
				<view class="lab">运费总额</view>
				<view class="inf">￥{{ objSettlement.transportationTotalAmount | unitPrice }}</view>
			</view>
			<view class="rs">
				<view class="lab">扣减退货</view>
				<view class="inf">￥{{ objSettlement.refundMoney | unitPrice }}</view>
			</view>
			<view class="rs">
				<view class="lab">结算金额</view>
				<view class="inf">￥{{ objSettlement.finalTotalAmount | unitPrice }}</view>
			</view>
			<view class="rs">
				<view class="lab">提交时间</view>
				<view class="inf">{{ objSettlement.createTime }}</view>
			</view>
			<view class="rs" v-if="objSettlement.otherProductRecommendationIncome">
				<view class="lab">产品推荐奖励回算</view>
				<view class="inf">￥{{ objSettlement.otherProductRecommendationIncome | unitPrice }}</view>
			</view>
			<view class="rs" v-if="objSettlement.otherExclusiveRegionalIncome">
				<view class="lab">区域独家代理回算</view>
				<view class="inf">￥{{ objSettlement.otherExclusiveRegionalIncome | unitPrice }}</view>
			</view>
			<view class="rs" v-if="objSettlement.otherProvinceOpCenterIncome">
				<view class="lab">省级运营中心回算</view>
				<view class="inf">￥{{ objSettlement.otherProvinceOpCenterIncome | unitPrice }}</view>
			</view>
		</view>
		<!-- 发票 -->
		<view class="wrap-invoice">
			<!-- 如果是待上传或者被驳回发票状态，显示上传按钮 v-if="objSettlement.settlementStatus == 3" -->
			<view  class="name-box" v-if="objSettlement.settlementStatus == 3 || objSettlement.settlementStatus == 5">
				<view class="name">发票信息</view>
				<view class="btn-box">
					<view class="btn-upload btn-view" @tap="handlerView">查看开票信息</view>
					<!-- #ifdef H5 -->
					<view class="btn-upload" @tap="handlerUpload">文件上传</view>
					<!-- #endif -->
					<!-- #ifdef APP-PLUS -->
					<view  class="btn-upload" @click="selectLocalFile">文件上传</view>
					<!-- #endif -->
				</view>
			</view>
			<!-- 其他状态显示发票信息或暂无 -->
			<view v-else>
				<view class="name">发票信息</view>
				<view class="file" v-if="objInvoice.latestInvoiceUploadTime" @tap="handlerPreview">
					<view class="file-content">
						<image class="icon" :src="iconFile" mode="aspectFit"></image>
						<view class="info">
							<view class="text">发票.pdf</view>
							<view class="date">{{ objInvoice.latestInvoiceUploadTime }}</view>
						</view>
					</view>
					<view class="upload-status">已上传</view>
				</view>
				<view class="no-data" v-else>
					暂无
				</view>
			</view>
		</view>
		<!-- 日志 -->
		<view class="wrap-event">
			<view class="name">审批日志</view>
			<view class="list">
				<view class="item" v-for="(item, index) in arrOperateLogs" :key="index">
					<view class="hd">
						<view class="text">{{ item.resultDetails }}</view>
						<view class="date">{{ item.createTime }}</view>
					</view>
					<view class="ft">{{ item.operatorDetails }}</view>
					<view class="bd" v-if="item.customContent">原因：{{ item.customContent }}</view>
				</view>
			</view>
		</view>
		<view class="wrap-tips">
			<view class="tips-item" v-if="objSettlement.order && objSettlement.order.length > 0">
				<view class="tips-label">订单明细</view>
				<view class="tips-btn" @tap="handlerSettlementDetail">查看明细</view>
			</view>
			<view class="tips-item" v-if="recommendList && recommendList.length > 0">
				<view class="tips-label">产品推荐奖励回算</view>
				<view class="tips-btn" @tap="handlerDetailNavigation('recommend')">查看明细</view>
			</view>
			<view class="tips-item" v-if="cityList && cityList.length > 0">
				<view class="tips-label">区域独家代理服务费</view>
				<view class="tips-btn" @tap="handlerDetailNavigation('typeB')">查看明细</view>
			</view>
			<view class="tips-item" v-if="provinceList && provinceList.length > 0">
				<view class="tips-label">省级运营中心回算</view>
				<view class="tips-btn" @tap="handlerDetailNavigation('typeA')">查看明细</view>
			</view>
		</view>

		<!-- 开票信息弹框 -->
		<u-modal
			v-model="viewInvoice"
			:show-cancel-button="false"
			:show-confirm-button="true"
			confirm-text="我知道了"
			title="开票信息"
			:mask-close-able="true"
			width="640"
		>
			<view class="invoice-info">
				<view class="info-item">
					<text class="label">公司名称：</text>
					<text class="value">北京中品一号维度商贸有限公司</text>
				</view>
				<view class="info-item">
					<text class="label">税号：</text>
					<text class="value">91110115MA019JP16Y</text>
				</view>
				<view class="info-item">
					<text class="label">开户行：</text>
					<text class="value">兴业银行股份有限公司北京经济技术开发区支行</text>
				</view>
				<view class="info-item">
					<text class="label">账号：</text>
					<text class="value">321130100100346885</text>
				</view>
				<view class="info-item">
					<text class="label">地址：</text>
					<text class="value">北京市大兴区天华街9号院19号楼8层802室</text>
				</view>
				<view class="info-item">
					<text class="label">电话：</text>
					<text class="value">010-87520638</text>
				</view>
			</view>
		</u-modal>

	</view>
</template>

<script>
  const FileSelect = uni.requireNativePlugin("JQ-FileSelect");
import { getSettlementInfoDetail,identifyInvoice,uploadInvoice } from "@/api/dealerCenter";
import { uploadPrivateFile,uploadFile } from "@/api/common.js";
import storage from "@/utils/storage.js";
export default {
	name: '',
	components: {

	},
	data() {
		return {
			isComplete: false,
			iconBasePath: `${this.iconCommon}/static/v1/sales`,
			iconStatus: '',
			iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,
			iconFile: `${this.iconCommon}/static/v1/order/icon-pdf.png`,
			objSettlement: {},
			objInvoice: {},
			arrOperateLogs: [],
			id: '',
			recommendList:[],// 产品推荐奖励回算
			provinceList:[],// 省级运营中心回算
			cityList:[],// 区域独家代理服务费
			viewInvoice: false, // 查看开票信息弹框
		}
	},
	methods: {
		handlerView: function () {
			this.viewInvoice = true
		},
		// h5点击选择文件
		handlerUpload(){
			uni.chooseFile({
				count: 1,
				extension: ['.pdf'],
				success: (res) => {
					console.log('H5选择的文件:', res);
					const file = res.tempFiles[0];
					this.handleFileSelected({
						path: res.tempFilePaths[0],
						name: file.name,
						size: file.size,
						type: file.type
					});
				},
				fail: (err) => {
					console.log('H5选择文件失败:', err);
				}
			});
		},

		// h5处理文件选择结果
		handleFileSelected(fileInfo) {
			// 验证文件类型
			if (fileInfo.type != 'application/pdf') {
				uni.showToast({
					title: '请选择PDF文件',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			// 验证文件大小
			if (fileInfo.size && fileInfo.size > 10 * 1024 * 1024) {
				uni.showToast({
					title: '文件大小不能超过10MB',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			// 上传文件
			this.uploadFileByPath(fileInfo.path, fileInfo.name);
		},

		// 请求接口上传文件
		async uploadFileByPath(filePath, fileName) {
			try {
				uni.showLoading({
					title: '上传中...'
				});

				// 1. 上传文件
				const uploadResult = await this.uploadFileToServer(filePath);

				// 2. 识别发票
				const identifyResult = await this.identifyInvoiceFile(uploadResult.result);

				// 3. 保存发票信息
				const saveResult = await this.saveInvoiceFile(uploadResult.result, identifyResult);

				// 4. 上传成功
				this.handleUploadSuccess();

			} catch (error) {
				this.handleUploadError(error);
			} finally {
				uni.hideLoading();
			}
		},

		// 上传文件到服务器
		uploadFileToServer(filePath) {
			return new Promise((resolve, reject) => {
				uni.uploadFile({
					url: uploadPrivateFile,
					filePath: filePath,
					name: 'file',
					header: {
						accessToken: storage.getAccessToken()
					},
					success: (uploadRes) => {
						try {
							const result = JSON.parse(uploadRes.data);
							if (result.code === 200) {
								resolve(result);
							} else {
								reject(new Error(result.message));
							}
						} catch (parseError) {
							reject(new Error('服务器响应格式错误'));
						}
					},
					fail: (err) => {
						reject(new Error('网络上传失败'));
					}
				});
			});
		},

		// 识别发票
		async identifyInvoiceFile(invoiceFile) {
			const res = await identifyInvoice({ invoiceFile });
			if (res.data.code === 200) {
				return res.data.result;
			} else {
				throw new Error(res.data.message);
			}
		},

		// 保存发票信息
		async saveInvoiceFile(invoiceFile, identifyResult) {
			let params ={
				id: this.id,
				invoiceFile: invoiceFile,
				invoiceCode: identifyResult.invoiceCode?identifyResult.invoiceCode:undefined,
				invoiceNumber:identifyResult.invoiceNumber,
				billingDate:identifyResult.billingDate,
				checkCode:identifyResult.checkCode,
				totalAmount:identifyResult.totalAmount,
			}
			const res = await uploadInvoice(params);
			if (res.data.code === 200) {
				return res.data;
			} else {
				throw new Error(res.data.message);
			}
		},

		// 处理上传成功
		handleUploadSuccess() {
			uni.showToast({
				title: '上传成功',
				icon: 'success'
			});
			setTimeout(() => {
				this.loadBaseData();
			}, 1000);
		},

		// 处理上传错误
		handleUploadError(error) {
			console.error('文件上传失败:', error);
			this.$u.toast(error.message);
		},
		// app端选择文件
		selectLocalFile() {
            //指定类型-选取本地文件
            FileSelect.selectType("pdf", (fileResult) => {
			  this.uploadFileByPath(fileResult);
            });
      },
		// 查看发票
		handlerPreview(){
            // #ifdef H5
                window.open(this.objInvoice.invoiceFile)
            // #endif
            // #ifdef APP-PLUS || MP-WEIXIN
				uni.showLoading({
					title: '正在下载'
				})
				uni.downloadFile({
					url: this.objInvoice.invoiceFile,
					success: (res)=> {
						uni.hideLoading()
						var filePath = res.tempFilePath
							uni.openDocument({
								filePath: filePath,
								fileType:'pdf',
								showMenu: true,
								success: (re)=> {
								console.log('打开文档成功',re)
								},
								fail:(err)=>{
								console.log('打开文档失败',err)
								}
							})
						},
					fail:(er)=>{
						uni.hideLoading()
						console.log('下载失败',er)
					}
				})
            // #endif
		},
		// 加载结算信息
		loadBaseData: function () {
			uni.showLoading({})
			getSettlementInfoDetail({ id: this.id }).then(res => {
				uni.hideLoading();
				if (res.data.code == 200) {
					this.isComplete = true
					this.objSettlement = res.data.result.settlementInfoVO;
					this.objInvoice = res.data.result.settlementInvoiceVO ? res.data.result.settlementInvoiceVO : {};
					this.arrOperateLogs = res.data.result.settlementOperationLogVOS;
					this.objSettlement.order = res.data.result.settlementOrderVOS;
					this.recommendList = res.data.result.recommendList;
					this.provinceList = res.data.result.provinceList;
					this.cityList = res.data.result.cityList;
					if (this.objSettlement.settlementStatus == 1||this.objSettlement.settlementStatus == 4 || this.objSettlement.settlementStatus == 7) {
						// 平台审核账单 - 待审核
						this.objSettlement.statusText = '平台审核账单 - 待审核'
						this.iconStatus = `${this.iconBasePath}/icon-process.png`
					} else if (this.objSettlement.settlementStatus == 2 || this.objSettlement.settlementStatus == 5 || this.objSettlement.settlementStatus == 11) {
						// 平台审核账单 - 未通过
						this.objSettlement.statusText = '平台审核账单 - 未通过'
						this.iconStatus = `${this.iconBasePath}/icon-fail.png`
					} else if (this.objSettlement.settlementStatus == 3) {
						// 等待提交发票
						this.objSettlement.statusText = '平台审核账单 - 等待提交发票'
						this.iconStatus = `${this.iconBasePath}/icon-process.png`
					} else {
						// 平台完成分账
						this.objSettlement.statusText = '平台审核账单 - 平台完成分账'
						this.iconStatus = `${this.iconBasePath}/icon-complete.png`
					}
				} else {
					that.$u.toast(res.data.message);
				}
			})
		},
		// 结算单明细页面跳转
		handlerSettlementDetail() {
			uni.navigateTo({
				url: `/pages/dealerCenter/settlementOrderDetail?id=${this.id}&type=settlement`
			});
		},
		// 通用明细页面跳转方法
		handlerDetailNavigation(type) {
			let title = '';
			let dataList = [];
			switch(type) {
				case 'recommend':
					title = '产品推荐奖励回算';
					dataList = this.recommendList;
					break;
				case 'typeB':
					title = '区域独家代理服务费';
					dataList = this.cityList; // 区域独家代理服务费
					break;
				case 'typeA':
					title = '省级运营中心回算';
					dataList = this.provinceList; // 省级运营中心服务费
					break;
				default:
					return;
			}
			// 跳转到收益明细页面，传递参数
			uni.navigateTo({
				url: `/pages/dealerCenter/settlementEarningsDetail?id=${this.id}&type=${type}&title=${encodeURIComponent(title)}`
			});
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
	padding-bottom: env(safe-area-inset-bottom);
	.wrap-state {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		z-index: 1;
		background: #E22221;
		min-height:240rpx;

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
		padding-bottom: 40rpx;
		.tips-item {
			background: #FFF;
			margin: 0 20rpx 20rpx;
			border-radius: 20rpx;
			padding: 0 20rpx;
				display: flex;
			justify-content: space-between;
			align-items: center;
			height: 88rpx;
			font-size: 28rpx;
			position: relative;

			&:not(:last-child)::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 1rpx;
				background-color: #f0f0f0;
			}

			.tips-label {
				color: #333;
				font-size: 28rpx;
				font-weight: 700;
			}

			.tips-btn {
				background: #E22221;
				color: #FFF;
				font-size: 26rpx;
				border-radius: 12rpx;
				border: none;
				outline: none;
				margin: 0;
				height: 48rpx;
				line-height: 48rpx;
				padding: 0 20rpx;
			}
		}
	}

	.wrap-base {
		background: #FFF;
		border-radius: 20rpx;
		padding: 20rpx;
		margin: -40rpx 20rpx 20rpx;
		position: relative;
		z-index: 1;

		.rs {
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 78rpx;
			height: 78rpx;
			font-size: 28rpx;
			position: relative;

			&:not(:last-child)::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 1rpx;
				background-color: #f0f0f0;
			}

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
		border-radius: 20rpx;
		padding: 0 20rpx;
		margin: 0 20rpx 20rpx;

		.name-box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.btn-box{
				display: flex;
				align-items: center;
				.btn-view{
					margin-right: 20rpx;
				}
			}
		}

		.btn-upload {
			background: #E22221;
			color: #FFF;
			font-size: 26rpx;
			border-radius: 12rpx;
			border: none;
			outline: none;
			margin: 0;
			height: 48rpx;
			line-height: 48rpx;
			padding: 0 20rpx;
		}

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
			align-items: flex-end;
			padding: 16rpx 0;

			.file-content{
				display: flex;
				align-items: center;
				.icon {
					width: 100rpx;
					height: 100rpx;
				}
				.info {
					flex: 1;
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
			.upload-status{
				color: #999;
				font-size: 28rpx;
			}
		}

		.no-data {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 40rpx 0;
			color: #999;
			font-size: 28rpx;
		}
	}

	.wrap-event {
		background: #FFF;
		border-radius: 20rpx;
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

	// 开票信息弹框样式
	.invoice-info {
		padding: 30rpx;

		.info-item {
			display: flex;
			align-items: flex-start;
			margin-bottom: 24rpx;
			line-height: 40rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.label {
				color: #666;
				font-size: 28rpx;
				min-width: 140rpx;
				flex-shrink: 0;
			}

			.value {
				color: #333;
				font-size: 28rpx;
				flex: 1;
				word-break: break-all;
			}
		}
	}
}</style>