<template>
	<view class="container">
		<!-- 订单状态 -->
		<view class="wrap-state" v-if="isComplete">
			<view class="base">
				<image class="ico" :src="iconStatusProcess" mode="aspectFit"></image>
				<view class="txt">未开票</view>
			</view>
			<view class="tips">可开发票金额：￥{{ objData.payPrice | unitPrice }}</view>
		</view>
		<view class="wrap-invoice">
			<view class="hd">开票信息</view>
			<view class="bd">
				<view class="frm-comm">
					<view class="rs rs-line">
						<view class="lab">抬头类型</view>
						<view class="txt">
							<view class="flex">
								<picker mode="selector" @change="bindPickerType" :value="curInvoiceTypeIndex"
									:range="arrInvoiceType" range-key="label">
									<view class="in-picker" :class="{ 'in-picker_place': curInvoiceTypeLabel.length == 0 }">
										{{ curInvoiceTypeLabel.length == 0 ? '请选择' : curInvoiceTypeLabel }}</view>
								</picker>
							</view>
						</view>
					</view>
					<view class="rs rs-line">
						<view class="lab">发票类型</view>
						<view class="txt">
							<view class="flex">
								<picker mode="selector" @change="bindPickerCategory" :value="curInvoiceCategoryIndex"
									:range="arrInvoiceCategory" range-key="label">
									<view class="in-picker"
										:class="{ 'in-picker_place': curInvoiceCategoryLabel.length == 0 }">{{
											curInvoiceCategoryLabel.length == 0 ? '请选择' : curInvoiceCategoryLabel }}</view>
								</picker>
							</view>
						</view>
					</view>

					<view class="rs rs-line">
						<view class="lab">发票内容</view>
						<view class="txt">
							<view class="flex">
								<!-- <picker mode="selector"  @change="bindPickerType"  :value="curInvoiceContentIndex" :range="arrInvoiceContent" range-key="label"> -->
								<view class="in-picker" :class="{ 'in-picker_place': curInvoiceContentLabel.length == 0 }">{{
									curInvoiceContentLabel.length == 0 ? '请选择' : curInvoiceContentLabel }}</view>
								<!-- </picker> -->
							</view>
						</view>
					</view>

					<view class="rs rs-line" v-if="objInvoice.receiptTitleType == 'PERSONAL'">
						<view class="lab">个人名称</view>
						<view class="txt">
							<view class="flex">
								<input class="s-text" v-model="objInvoice.receiptTitle" type="text" placeholder="请输入个人名称" />
							</view>
						</view>
					</view>
					<view class="rs rs-line" v-if="objInvoice.receiptTitleType == 'COMPANY'">
						<view class="lab">单位名称</view>
						<view class="txt">
							<view class="flex">
								<input class="s-text" v-model="objInvoice.unitName" type="text" placeholder="请输入单位名称"
									@input="loadCompanyInfo" @blur="hideCompanyList" />
								<view class="company-list-box" v-if="isShowCompanyList">
									<view class="company-list" v-for="(item, index) in companyList" :key="index">
										<view class="name" @tap="selCompany(item)">{{ item.name }}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="rs rs-line" v-if="objInvoice.receiptTitleType == 'COMPANY'">
						<view class="lab">纳税人识别号</view>
						<view class="txt">
							<view class="flex">
								<input class="s-text" v-model="objInvoice.taxpayerId" type="text" placeholder="请输入纳税人识别号" />
							</view>
						</view>
					</view>
					<view class="rs rs-line" v-if="objInvoice.receiptTitleType == 'COMPANY'">
						<view class="lab">单位地址</view>
						<view class="txt">
							<view class="flex">
								<input class="s-text" v-model="objInvoice.unitAddress" type="text" placeholder="请输入单位地址" />
							</view>
						</view>
					</view>
					<view class="rs rs-line" v-if="objInvoice.receiptTitleType == 'COMPANY'">
						<view class="lab">单位电话</view>
						<view class="txt">
							<view class="flex">
								<input class="s-text" v-model="objInvoice.phone" type="text" placeholder="请输入联系电话" />
							</view>
						</view>
					</view>
					<view class="rs rs-line" v-if="objInvoice.receiptTitleType == 'COMPANY'">
						<view class="lab">开户银行</view>
						<view class="txt">
							<view class="flex">
								<input class="s-text" v-model="objInvoice.bankAccount" type="text" placeholder="请输入开户银行" />
							</view>
						</view>
					</view>
					<view class="rs rs-line" v-if="objInvoice.receiptTitleType == 'COMPANY'">
						<view class="lab">银行账户</view>
						<view class="txt">
							<view class="flex">
								<input class="s-text" v-model="objInvoice.bankAccountNo" type="text"
									placeholder="请输入银行账户" />
							</view>
						</view>
					</view>
					<view class="rs rs-line">
						<view class="lab">电子信箱</view>
						<view class="txt">
							<view class="flex">
								<input class="s-text" v-model="objInvoice.email" type="text" placeholder="请输入电子信箱" />
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="ft">
				<view class="lnk-common lnk-primary" @tap="handlerSubmit">提交申请</view>
			</view>

		</view>
		<!-- 商品信息 -->
		<view class="wrap-goods">
			<view class="list">
				<view class="item" v-for="(item, index) in objData.goodsNameAndCategoryList" :key="index">
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


	</view>
</template>

<script>
import { getInvoiceInfo, applyInvoice, getCompanyInfo } from "@/api/invoice.js"

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
			objData: {
				code: '',
				invoiceStatus: 0,
				invoiceStatusText: 0,
				money: '15.00',
				integral: 20,
				goods: []
			},

			objInvoice: {
				receiptTitleType: '',							// 抬头类型
				receiptType: '',					// 发票类型
				unitName: '',// 单位名称
				email: '',							// 发票信箱
				taxpayerId: '',							// 纳税人识别号
				unitAddress: '',					// 单位地址
				phone: '',						// 单位电话
				bankAccount: '',							// 开户银行
				bankAccountNo: '',					// 银行账户
			},

			curInvoiceTypeIndex: null,
			curInvoiceTypeLabel: '',
			arrInvoiceType: [
				{ label: '企业', value: 'COMPANY' },
				{ label: '个人', value: 'PERSONAL' }
			],


			curInvoiceCategoryIndex: null,
			curInvoiceCategoryLabel: '',
			arrInvoiceCategory: [
				{ label: '数电普票', value: 'GENERAL' },
				{ label: '数电专票', value: 'SPECIAL' }
			],


			curInvoiceContentIndex: null,
			curInvoiceContentLabel: '商品明细',
			arrInvoiceContent: [
				{ label: '商品明细', value: 0 },
				{ label: '商品类别', value: 1 }
			],
			isCanSubmit: true,//默认可点击
			companyList: [],// 公司列表
			isShowCompanyList: false,
		}
	},
	computed: {

	},
	methods: {
		// 根据公司名称获取公司信息
		loadCompanyInfo() {
			if (this.objInvoice.receiptTitleType == 'PERSONAL' || !this.objInvoice.unitName) {
				this.isShowCompanyList = false
				return
			}
			getCompanyInfo({ companyName: this.objInvoice.unitName }).then(res => {
				if (res.data.code == 200) {
					this.companyList = res.data.result
					if (this.companyList.length > 0) {
						this.isShowCompanyList = true
					} else {
						this.isShowCompanyList = false
					}
				} else {
					this.$u.toast(res.data.message);
				}
			})
		},
		// 选择公司
		selCompany(item) {
			this.isShowCompanyList = false;
			this.objInvoice.unitName = item.name
			this.objInvoice.taxpayerId = item.taxId
			this.objInvoice.unitAddress = item.location
			this.objInvoice.bankAccount = item.bank
			this.objInvoice.bankAccountNo = item.bankAccount
			this.objInvoice.phone = item.mobilePhone
		},
		// 隐藏公司列表
		hideCompanyList() {
			setTimeout(() => {
				this.isShowCompanyList = false;
			}, 200);
		},
		handlerSubmit() {
			if (!this.objInvoice.receiptTitleType) {
				this.$u.toast('请选择抬头类型')
				return
			}
			if (!this.objInvoice.receiptType) {
				this.$u.toast('请选择发票类型')
				return
			}
			if (!this.objInvoice.email) {
				this.$u.toast('请填写电子信箱')
				return
			}
			if (!this.$u.test.email(this.objInvoice.email)) {
				this.$u.toast('请输入正确的电子信箱地址')
				return
			}
			if (this.objInvoice.receiptTitleType == 'COMPANY' && !this.objInvoice.unitName) {
				this.$u.toast('请填写单位名称')
				return
			}
			if (this.objInvoice.receiptTitleType == 'COMPANY' && !this.objInvoice.phone) {
				this.$u.toast('请输入固定电话或手机号码')
				return
			}
			if (this.objInvoice.receiptTitleType == 'COMPANY' && !this.$u.test.mobile(this.objInvoice.phone) && !this.$u.test.TEL(this.objInvoice.phone)) {
				this.$u.toast('请填写固定电话格式如区号-电话号码，或填写完整的手机号')
				return
			}
			if (this.objInvoice.receiptTitleType == 'COMPANY' && !this.objInvoice.taxpayerId) {
				this.$u.toast('请填写纳税人识别号')
				return
			}
			if (this.objInvoice.receiptTitleType == 'COMPANY' && !this.objInvoice.unitAddress) {
				this.$u.toast('请填写单位地址')
				return
			}
			if (this.objInvoice.receiptTitleType == 'COMPANY' && !this.objInvoice.bankAccount) {
				this.$u.toast('请填写开户行')
				return
			}
			if (this.objInvoice.receiptTitleType == 'COMPANY' && !this.objInvoice.bankAccountNo) {
				this.$u.toast('请填写银行账号')
				return
			}

			if (!this.isCanSubmit) return
			this.isCanSubmit = false
			console.log(this.objInvoice, 'this.objInvoice');
			applyInvoice(this.objInvoice).then((res) => {
				if (res.data.success) {
					this.$u.toast('正在开票中...')
					uni.navigateBack()
				} else {
					// uni.showModal({
					// 	title: '提示',
					// 	content: '开票失败,请您核对开票信息后重新申请...',
					// 	confirmText:'我知道了',
					// 	showCancel:false,
					// 	success: function (res) {
					// 		if (res.confirm) {
					// 			console.log('用户点击确定');
					// 		}
					// 	}
					// });
				}
				this.isCanSubmit = true
			})
		},
		// 选择发票抬头
		bindPickerType: function (e) {
			this.curInvoiceTypeIndex = e.detail.value
			this.curInvoiceTypeLabel = this.arrInvoiceType[e.detail.value].label
			this.objInvoice.receiptTitleType = this.arrInvoiceType[e.detail.value].value
			this.objInvoice.unitName = this.objInvoice.receiptTitleType == 'PERSONAL' ? '个人' : ''
			// 判断如果选择的是个人，强制发票类型为普票
			if (this.objInvoice.receiptTitleType == 'PERSONAL') {
				this.curInvoiceCategoryIndex = 0
				this.curInvoiceCategoryLabel = '数电普票'
				this.objInvoice.receiptType = 'GENERAL'
				this.objInvoice.unitName = ''
			}
		},

		// 选择发票类型
		bindPickerCategory: function (e) {
			this.curInvoiceCategoryIndex = e.detail.value
			this.curInvoiceCategoryLabel = this.arrInvoiceCategory[e.detail.value].label
			this.objInvoice.receiptType = this.arrInvoiceCategory[e.detail.value].value
			// 判断字典为专票时，强制抬头为企业
			if (this.arrInvoiceCategory[e.detail.value].value == 'SPECIAL') {
				this.curInvoiceTypeIndex = 0
				this.curInvoiceTypeLabel = '企业'
				this.objInvoice.receiptTitleType = 'COMPANY'
				this.objInvoice.unitName = ''
			}
		},


		// 选择发票内容
		bindPickerContent: function (e) {
			this.curInvoiceContentIndex = e.detail.value
			this.curInvoiceContentLabel = this.arrInvoiceContent[e.detail.value].label
			this.objInvoice.content = this.curInvoiceTypeLabel
		},

		// 加载发票信息
		loadBaseData: function () {
			uni.showLoading()
			getInvoiceInfo(this.objInvoice.orderSn).then((res) => {
				if (res.data.success) {
					if (this.$store.state.isShowToast) { uni.hideLoading() };
					this.isComplete = true
					this.objData = res.data.result;
					this.objInvoice = res.data.result
					this.curInvoiceTypeLabel = this.objInvoice.receiptTitleType == 'COMPANY' ? '企业' : '个人'
					this.curInvoiceTypeIndex = this.objInvoice.receiptTitleType == 'COMPANY' ? 0 : 1
					this.curInvoiceCategoryLabel = this.objInvoice.receiptType == 'SPECIAL' ? '数电专票' : '数电普票'
					this.curInvoiceCategoryIndex = this.objInvoice.receiptType == 'SPECIAL' ? 1 : 0
					switch (this.objData.receiptStatus) {
						case 0:	// 未开
							this.iconStatusProcess = `${this.iconBasePath}/icon-process_0.png`
							this.objData.invoiceStatusText = '未开票'
							break
						case 1:	// 待开
							this.iconStatusProcess = `${this.iconBasePath}/icon-process_0.png`
							this.objData.invoiceStatusText = '开票中'
							break
						case 2:	// 待重开
							this.iconStatusProcess = `${this.iconBasePath}/icon-process_1.png`
							this.objData.invoiceStatusText = '待重开'
							break
						case 3:	// 重开
							this.iconStatusProcess = `${this.iconBasePath}/icon-process_2.png`
							this.objData.invoiceStatusText = '已开票'
							break
					}
				}
			});


		}
	},
	onLoad: function (options) {
		this.objInvoice.orderSn = options.orderSn
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

			.frm-comm {
				margin: 0 0 0;

				.rs {
					padding: 0;

					.txt {
						width: calc(100vw - 180rpx - 40rpx);

						.s-text {
							width: calc(100vw - 180rpx - 40rpx);
						}
					}
				}

				.rs-line {
					&::after {
						left: 0;
						right: 0;
					}
				}
			}
		}

		.ft {
			padding: 0 20rpx;
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

	.company-list-box {
		background-color: #fff;
		position: absolute;
		z-index: 99;
		top: 88rpx;
		right: 0;
		overflow: scroll;
		width: 76vw;
		min-height: 72rpx;
		max-height: 432rpx;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2), 0 6rpx 20rpx rgba(0, 0, 0, 0.19);

		.company-list {
			padding: 0 24rpx;
			position: relative;
			height: 72rpx;
			line-height: 72rpx;
			font-size: 28rpx;

			&::after {
				position: absolute;
				content: '';
				left: 20rpx;
				right: 20rpx;
				bottom: 0;
				height: 3rpx;
				background: #EBEDF0;
			}

			.name {
				white-space: nowrap;
				/* 确保文本在一行内显示 */
				overflow: hidden;
				/* 隐藏超出容器的文本 */
				text-overflow: ellipsis;
				/* 超出部分显示为省略号 */
				width: 70vw;
			}
		}
	}


}</style>