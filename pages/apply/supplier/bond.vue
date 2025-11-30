<template>
	<view class="container" v-if="isComplete">
		<view class="wrapper" v-if="isComplete">
			<view class="total-amount">
				<span v-if="objData.depositType == 1">0门槛入驻,无需缴纳保证金</span>
				<span v-else>保证金账户总金额为<span class="amount">{{ objData.depositMoney }}</span>元</span>
			</view>
			<view class="frm-sign">
				<view class="frm-title">
					<view class="name">入驻保证金</view>
				</view>
				<view class="total-amount amount-item" v-if="objData.depositType == 2 || objData.depositType == 3">
					<span v-if="objData.depositType == 2 || objData.depositType == 3">供应商入驻须保证金账户总金额为<span class="amount">{{
						objData.depositMoney }}</span>元</span>
					<span v-if="objData.depositType == 2">当前入驻阶段须部分缴纳<span class="amount">{{ objData.depositPartMoney
					}}</span>元</span>
					<span v-if="objData.depositType == 2 || objData.depositType == 3">，您还有<span class="amount">{{
						objData.depositUnpaidMoney }}</span>元未缴纳，缴纳完成后即可开通供应商资格。</span>
					<span v-if="objData.depositType == 2">，剩余部分的<span class="amount">{{ objData.depositRemainMoney
					}}</span>元将在后续的结算单中进行抵扣</span>
				</view>
				<view v-if="objData.depositType == 2 || objData.depositType == 3">
					<view class="frm-sign">
						<view class="frm-title">
							<view class="name">请使用如下账户付款</view>
						</view>
					</view>
					<view class="content">
						<view class="item">
							<view class="label">账号：</view>
							<view class="value">
								<view class="code">{{ objBankData.settlementBankAccountNum }}
									<button @click="copyCode(objBankData.settlementBankAccountNum)" class="copy-btn">复制</button>
								</view>
								<view class="txt">请使用此账号进行打款，否则将无法入账</view>
							</view>
						</view>
						<view class="item">
							<view class="label">户名：</view>
							<view class="value">
								<view class="text">{{ objBankData.companyName }}</view>
							</view>
						</view>
						<view class="item">
							<view class="label">开户银行：</view>
							<view class="value">
								<view class="text">{{ objBankData.settlementBankBranchName }}</view>
							</view>
						</view>

					</view>
				</view>
				<view>
					<view class="frm-sign">
						<view class="frm-title">
							<view class="name">请向以下账号汇入指定金额</view>
						</view>
					</view>
					<view class="content">
						<view class="item" v-if="objData.depositType == 2">
							<view class="label">需部分缴纳：</view>
							<view class="value">
								<view class="price">￥{{ objData.depositPartMoney }}</view>
								<view class="txt">剩余部分的<span class="amount">{{ objData.depositRemainMoney
								}}</span>元将在后续的结算单中进行抵扣。</view>
							</view>
						</view>
						<view class="item" v-if="objData.depositType == 2 || objData.depositType == 3">
							<view class="label">未交金额：</view>
							<view class="value">
								<view class="price">￥{{ objData.depositUnpaidMoney }}</view>
								<view class="txt">请汇入指定金额，非指定金额将验证失败</view>
							</view>
						</view>
						<view class="item">
							<view class="label">收款账号：</view>
							<view class="value">
								<view class="code">{{ bankAccount }}
									<button @click="copyCode(bankAccount)" class="copy-btn">复制</button>
								</view>
								<view class="txt">每个开通账号对应的收款信息不同，请勿重复打款</view>
							</view>
						</view>
						<view class="item">
							<view class="label">开户银行：</view>
							<view class="value">
								<view class="text">{{ bankName }}</view>
							</view>
						</view>
						<view class="item">
							<view class="label">收款公司名：</view>
							<view class="value">
								<view class="text">{{ companyName }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="wrapper" v-if="objData.depositUnpaidMoney != 0">
			<view class="frm-sign">
				<view class="lnk-common lnk-primary" @tap="handlePayOver">立即缴纳</view>
			</view>
		</view>
		<view class="wrapper" style="padding: 0;">
			<view class="frm-sign">
				<view class="frm-title" style="margin:10rpx 20rpx;">
					<view class="name">保证金账单</view>
				</view>
				<view>
					<view class="box-null" v-if="isComplete && arrData.length == 0">
						<empty-box text="暂无账单记录" />
					</view>
					<view class="box-list" v-if="isComplete && arrData.length > 0">
						<view class="item" v-for="(item, index) in arrData" :key="index">
							<deposit-item :objData="item" :index="index" @detail="handlerDetail(item.id)" />
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import EmptyBox from '@/components/Hina/EmptyBox'
import DepositItem from '@/components/Hina/DepositItem'
import { getPaymentRecord, getDepositPaymentMoney, getVerify } from '@/api/distributor'

export default {
	components: {
		EmptyBox,
		DepositItem
	},
	data() {
		return {
			isComplete: false,
			arrData: [],
			intPageCode: 1, // 当前页面
			intResTotal: 0, // 记录总数
			params: {
				pageNumber: 1,
				pageSize: 10
			},
			objData: {
				depositType: null, // 缴纳保证金类型（1：0门槛入驻，2：部分缴纳，3：全额缴纳）
				depositMoney: 0, // 保证金总金额
				depositPartMoney: 0, // 部分保证金金额
				depositUnpaidMoney: 0, // 未缴纳的保证金金额
				depositRemainMoney: 0 // 剩余缴纳保证金金额
			},
			objBankData: {},
			bankAccount: '',
			bankName: '',
			companyName: ''
		}
	},
	onLoad: function () {

	},
	onShow() {
		// 加载保证金信息
		this.loadBaseData()
		this.arrData = []
		this.params.pageNumber = 1
		this.loadArrData()
		this.loadBankInfo()
	},
	methods: {
		// 跳转到缴纳费用
		handlePayOver() {
			uni.navigateTo({
				url: `/pages/apply/supplier/payOver?maxMoney=${this.objData.depositUnpaidMoney}`
			})
		},
		// 跳转结算详情
		handlerDetail: function (id) {
			uni.navigateTo({
				url: `/pages/supplierCenter/settlementDetail?id=${id}`
			})
		},
		// 加载保证金基本问题
		loadBaseData() {
			getDepositPaymentMoney().then((res) => {
				if (res.data.code == 200) {
					this.objData = res.data.result
				} else {
					this.$u.toast(res.data.message)
				}
			})
		},

		// 加载账单信息
		loadArrData: function () {
			getPaymentRecord(this.params).then((res) => {
				if (res.data.code == 200) {
					this.isComplete = true
					let data = res.data.result.records
					data.forEach(item => {
						item.depositTransferTypeText = this.handleDepositTransferType(item.depositTransferType)
						item.statusText = this.handleStatusText(item.status)
					});

					if (data.length > 0) {
						this.arrData.push(...data)
					}
					this.intResTotal = res.data.result.total
				} else {
					this.$u.toast(res.data.message)
				}
			})
		},
		// 处理状态
		handleStatusText(status) {
			switch (status) {
				case 0:
					return '待审核'
					break;
				case 1:
					return '已入账'
					break;
				case 2:
					return '入账失败'
					break;
				default:
					break;
			}
		},
		// 处理类型
		handleDepositTransferType(depositTransferType) {
			switch (depositTransferType) {
				case 'SETTLED':
					return '入驻转账'
					break;
				case 'DEDUCTION_DEPOSIT':
					return '抵扣保证金'
					break;
				case 'DEDUCTION_PENALTY':
					return '抵扣罚款'
					break;
				case 'DEDUCTION_PAYMENT':
					return '抵扣货款'
					break;
				case 'DEDUCTION_SHIPPING':
					return '抵扣运费'
					break;
				case 'EVACUATE':
					return '退出平台'
					break;
				default:
					break;
			}
		},
		//获取银行卡信息
		loadBankInfo() {
			uni.showLoading({ title: "加载中" })
			let params = {
				dataType: 'PLATFORM'
			}
			getVerify(2, params).then(res => {
				uni.hideLoading();
				if (res.data.code == 200) {
					this.objBankData = res.data.result;
					this.bankAccount = this.objBankData.settlementBankInfoSetting.bankAccount;
					this.bankName = this.objBankData.settlementBankInfoSetting.bankName;
					this.companyName = this.objBankData.settlementBankInfoSetting.companyName;
				} else {
					this.$u.toast(res.data.message);
				}
			})
		},
		copyCode: function (code) {
			uni.setClipboardData({
				data: code,
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
		},
	},
	onReachBottom: function () {
		if (this.intResTotal > this.arrData.length) {
			this.params.pageNumber++
			this.loadArrData()
		}
	}
}
</script>

<style lang="scss" scoped>
page {
	height: 100%;
}

.container {
	background: #fff;
	box-sizing: border-box;

	.wrapper {
		padding: 10rpx 20rpx;
	}

	.box-list {
		// padding: 20rpx 20rpx 0;
		background-color: #fafafa;

		.item {
			position: relative;
			margin: 20rpx 0 0;

			&:first-of-type {
				margin: 0;
			}
		}
	}

	.status {
		min-height: 320rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;


		.text {
			font-size: 26rpx;
			line-height: 72rpx;
		}
	}

	.content {
		display: flex;
		flex-direction: column;

		.item {
			display: flex;
			margin-bottom: 20rpx;

			.label {
				font-size: 28rpx;
				white-space: nowrap;
				color: #514d4d
			}

			.value {
				display: flex;
				flex-direction: column;

				.price {
					color: #FF5F5F;
					font-size: 34rpx;
				}

				.txt {
					font-size: 24rpx;
					color: #877c7c
				}

				.code {
					font-size: 30rpx;

					.copy-btn {
						height: 40rpx;
						font-size: 26rpx;
						line-height: 40rpx;
						border: 1px solid #f00;
						background-color: transparent;
						color: #f00;
						display: inline-flex;
						margin-left: 20rpx;
					}
				}

				.text {
					font-size: 29rpx;
				}

			}
		}

		.hr {
			height: 1px;
			background-color: #cfcdcd;
			margin: 40rpx 0;
			margin-top: 20rpx;
		}
	}
}

.total-amount {
	font-size: 46rpx;
	padding: 20rpx 0;

	.amount {
		color: #d22020;
	}
}

.amount-item {
	font-size: 28rpx;
}
</style>
