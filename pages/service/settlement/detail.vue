<template>
	<view class="container">
		<!-- Tabs -->
		<view class="tab-header">
			<view class="tab-item" :class="{ active: curTab === 0 }" @tap="curTab = 0">
				<text>账单信息</text>
				<view class="line" v-if="curTab === 0"></view>
			</view>
			<view class="tab-item" :class="{ active: curTab === 1 }" @tap="curTab = 1">
				<text>账单日志</text>
				<view class="line" v-if="curTab === 1"></view>
			</view>
			<view class="tab-item" :class="{ active: curTab === 2 }" @tap="curTab = 2">
				<text>结算明细</text>
				<view class="line" v-if="curTab === 2"></view>
			</view>
		</view>

		<!-- Content -->
		<view class="content">
			<!-- Tab 1: Bill Info -->
			<view v-if="curTab === 0">
				<!-- Status Header -->
				<view class="status-header">
                    <image :src="statusIcon" mode="aspectFit" style="width: 120rpx; height: 120rpx;"></image>
					<text class="status-text">{{ statusText }}</text>
				</view>

				<!-- Basic Info -->
				<view class="card">
					<view class="card-title">
						<view class="indicator"></view>
						<text>基本信息</text>
					</view>
					<view class="info-row">
						<text class="label">结算单号</text>
						<text class="value">{{ detail.settlementNo }}</text>
					</view>
					<view class="info-row">
						<text class="label">服务商类型</text>
						<text class="value">{{ detail.serviceType }}</text>
					</view>
					<view class="info-row">
						<text class="label">主体类型</text>
						<text class="value">{{ detail.entityType }}</text>
					</view>
					<view class="info-row">
						<text class="label">主体名称</text>
						<text class="value">{{ detail.entityName }}</text>
					</view>
					<view class="info-row">
						<text class="label">交易总额</text>
						<text class="value">¥{{ detail.totalAmount }}</text>
					</view>
					<view class="info-row">
						<text class="label">结算金额</text>
						<text class="value">¥{{ detail.settlementAmount }}</text>
					</view>
					<view class="info-row">
						<text class="label">提交时间</text>
						<text class="value">{{ detail.submitTime }}</text>
					</view>
				</view>

				<!-- Invoice Info (For Completed or Pending Invoice) -->
				<view class="card" v-if="status === 'completed' || status === 'pending_invoice' || status === 'pending_reaudit'">
					<view class="card-title">
						<view class="indicator"></view>
						<text>{{ status === 'pending_invoice' ? '发票信息' : '发票信息' }}</text>
					</view>

					<view class="info-row">
						<text class="label">发票抬头</text>
						<text class="value">{{ detail.invoiceTitle || '北京中品一号维服务商贸有限公司' }}</text>
					</view>
					<view class="info-row">
						<text class="label">统一社会信用代码</text>
						<text class="value">{{ detail.taxId || '91110115MA019JP16Y' }}</text>
					</view>
                    <view class="info-row">
						<text class="label">电话</text>
						<text class="value">{{ detail.phone || '010-87520638' }}</text>
					</view>
                    <view class="info-row">
						<text class="label">开票金额</text>
						<text class="value">¥{{ detail.invoiceAmount || '0.38' }}</text>
					</view>
                    
                    <!-- Completed Fields -->
                    <template v-if="status === 'completed'">
                        <view class="info-row">
                            <text class="label">发票代码</text>
                            <text class="value">{{ detail.invoiceCode }}</text>
                        </view>
                        <view class="info-row">
                            <text class="label">发票编号</text>
                            <text class="value">{{ detail.invoiceNo }}</text>
                        </view>
                        <view class="info-row">
                            <text class="label">开票日期</text>
                            <text class="value">{{ detail.invoiceDate }}</text>
                        </view>
                    </template>

                    <!-- View Invoice Button -->
                    <view class="btn-view-invoice" v-if="status === 'completed' || status === 'pending_reaudit'" @tap="handlerViewInvoice">
                        查看发票
                    </view>
				</view>
			</view>



			<!-- Tab 2: Bill Log -->
			<view v-if="curTab === 1" class="log-list">
				<view class="log-item" v-for="(log, index) in logs" :key="index">
					<view class="dot" :style="{ background: log.color }"></view>
					<view class="log-content">
						<view class="log-header">
							<text class="log-title">{{ log.title }}</text>
							<text class="log-time">{{ log.time }}</text>
						</view>
						<view class="log-desc">{{ log.desc }}</view>
						<view class="log-btn" v-if="log.btnText" @tap="handlerLogAction(log)">
							{{ log.btnText }}
						</view>
					</view>
				</view>
			</view>

			<!-- Tab 3: Settlement Detail -->
			<view v-if="curTab === 2" class="detail-list">
				<view class="detail-item" v-for="(item, index) in detailList" :key="index">
					<view class="info-row">
						<text class="label">流水号</text>
						<text class="value">{{ item.flowNo }}</text>
					</view>
					<view class="info-row">
						<text class="label">订单号</text>
						<text class="value">{{ item.orderNo }}</text>
					</view>
					<view class="info-row">
						<text class="label">商家编号</text>
						<text class="value">{{ item.merchantNo }}</text>
					</view>
					<view class="info-row">
						<text class="label">商家名称</text>
						<text class="value">{{ item.merchantName }}</text>
					</view>
					<view class="info-row">
						<text class="label">消费者用户</text>
						<text class="value">{{ item.user }}</text>
					</view>
					<view class="info-row">
						<text class="label">交易金额</text>
						<text class="value">¥{{ item.amount }}</text>
					</view>
					<view class="info-row">
						<text class="label">结算金额</text>
						<text class="value">¥{{ item.settlementAmount }}</text>
					</view>
					<view class="info-row">
						<text class="label">交易时间</text>
						<text class="value">{{ item.time }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- Bottom Button -->
		<view class="bottom-bar" v-if="bottomBtnText">
            <!-- Invoice Hint -->
            <view v-if="status === 'pending_invoice'" class="invoice-upload-hint">
                <u-icon name="info-circle" size="28" color="#FF0101" style="margin-right: 10rpx;"></u-icon>
                <text>请上传开票金额为 <text class="amount">¥{{ detail.invoiceAmount || '0.38' }}</text> 的发票文件</text>
            </view>
            
            <!-- Resend Warning -->
            <view class="warning-text" v-if="status === 'pending_resend'">
                <u-icon name="info-circle" size="28" color="#FF0101"></u-icon>
                <text>结算账号出现异常，请修改结算账户后，重新发起转账。</text>
            </view>

			<view class="btn-main" @tap="handlerBottomAction">{{ bottomBtnText }}</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			curTab: 0,
			status: 'pending_submit', // pending_submit, pending_audit, completed, rejected, transfer_failed
			detail: {
				settlementNo: 'E200355',
				serviceType: 'A+类服务商',
				entityType: '公司',
				entityName: '北京某某某某某科技有限公司',
				totalAmount: '100.00',
				settlementAmount: '100.00',
				submitTime: '2025-12-12 12:35:37',
				invoiceCode: 'DF553233232',
				invoiceNo: 'DF553233232',
				invoiceCheckCode: '243465',
				invoiceAmount: '1900.00',
				invoiceDate: '2025-12-12 12:35:37'
			},
			logs: [
				{ title: '创建结算账单', time: '2025-07-05 16:32:45', desc: '北京某某某某某科技有限公司', color: '#FEAB18' },
				{ title: '提交结算账单', time: '2025-07-05 16:32:45', desc: '北京某某某某某科技有限公司', color: '#00C853' },
				{ title: '初审结算账单', time: '2025-07-05 16:32:45', desc: '平台-某某\n结算账单未能通过审核，账单退回', color: '#FF0101', btnText: '重新提交' },
                { title: '灵活用工支付/金蝶银企直联系统', time: '2025-07-05 16:32:45', desc: '转账失败：收款方账号异常', color: '#FFB6C1', btnText: '重发转账' },
                { title: '平台完成结算', time: '2025-07-05 16:32:45', desc: '系统- 灵活用工/银企直联', color: '#AA00FF' }
			],
			detailList: [
				{
					flowNo: 'E200355',
					orderNo: 'D2045024',
					merchantNo: '行政地区编码6位+2025+00000',
					merchantName: '北京某某某某某拉面店',
					user: '136****2993',
					amount: '100.00',
					settlementAmount: '100.00',
					time: '2025-12-12 12:35:37'
				},
                {
					flowNo: 'E200355',
					orderNo: 'D2045024',
					merchantNo: '行政地区编码6位+2025+00000',
					merchantName: '北京某某某某某拉面店',
					user: '136****2993',
					amount: '100.00',
					settlementAmount: '100.00',
					time: '2025-12-12 12:35:37'
				}
			]
		};
	},
	computed: {
		statusText() {
			const map = {
				'pending_submit': '待提交账单',
				'pending_audit': '待初审账单',
                'pending_invoice': '待上传发票',
                'pending_reaudit': '待复审账单',
                'pending_resend': '待重发转账',
				'completed': '已完成结算'
			};
			return map[this.status] || '';
		},
		statusIcon() {
			const map = {
				'pending_submit': '/static/cbd/service/submit.png',
				'pending_audit': '/static/cbd/service/audit.png', 
                'pending_invoice': '/static/cbd/service/invoice.png',
                'pending_reaudit': '/static/cbd/service/reaudit.png',
                'pending_resend': '/static/cbd/service/resend.png',
				'completed': '/static/cbd/payment/success.png'
			};
			return map[this.status] || '/static/cbd/service/submit.png';
		},

		bottomBtnText() {
			if (this.curTab !== 0) return '';
			const map = {
				'pending_submit': '提交结算账单',
                'pending_invoice': '提交结算账单', // Assuming upload invoice also submits
                'pending_resend': '提交结算账单', // Assuming resend also submits
                'pending_resend': '提交结算账单', // Assuming resend also submits
                'pending_reaudit': '',
				'completed': ''
			};
			return map[this.status] || '';
		}
	},
	methods: {
		handlerBottomAction() {
			if (this.status === 'pending_submit') {
				this.$u.toast('提交成功');
				this.status = 'pending_audit';
                this.syncStatus();
			} else if (this.status === 'pending_invoice') {
                this.$u.toast('上传成功');
                this.status = 'pending_reaudit';
                this.syncStatus();
            } else if (this.status === 'pending_resend') {
                this.$u.toast('重发成功');
                this.status = 'completed'; // Demo transition
                this.syncStatus();
            } else if (this.status === 'completed' || this.status === 'pending_reaudit') {
				this.$u.toast('查看发票');
			}
		},
        handlerViewInvoice() {
            this.$u.toast('查看发票');
        },
        syncStatus() {
            uni.$emit('updateSettlementStatus', {
                settlementNo: this.detail.settlementNo,
                status: this.status
            });
        },
		handlerLogAction(log) {
			this.$u.toast(log.btnText);
		},
        getStatusKey(statusText) {
            const map = {
                '待提交账单': 'pending_submit',
                '待初审账单': 'pending_audit',
                '待上传发票': 'pending_invoice',
                '待复审账单': 'pending_reaudit',
                '待重发转账': 'pending_resend',
                '已完成结算': 'completed'
            };
            return map[statusText] || 'pending_submit';
        }
	},
	onLoad(options) {
		if (options.data) {
            try {
                const item = JSON.parse(decodeURIComponent(options.data));
                this.detail.settlementNo = item.settlementNo;
                this.detail.totalAmount = item.amount;
                this.detail.settlementAmount = item.pendingAmount || item.amount;
                this.detail.submitTime = item.createTime;
                
                // Set status based on passed text
                this.status = this.getStatusKey(item.status);
            } catch (e) {
                console.error('Failed to parse settlement data', e);
            }
		} else if (options.status) {
			this.status = options.status;
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	background: #F8F8F8;
	min-height: 100vh;
	padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(120rpx + env(safe-area-inset-bottom));

	.tab-header {
		display: flex;
		justify-content: space-around;
		background: #fff;
		padding: 20rpx 0;
		position: sticky;
		top: 0;
		z-index: 10;

		.tab-item {
			font-size: 30rpx;
			color: #999;
			position: relative;
			padding-bottom: 10rpx;

			&.active {
				color: #333;
				font-weight: bold;
			}

			.line {
				position: absolute;
				bottom: -6rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 100rpx;
				height: 6rpx;
				background: #FF0101;
				border-radius: 3rpx;
			}
		}
	}

	.content {
		padding: 20rpx;

		.status-header {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 40rpx 0;

			.status-text {
				font-size: 36rpx;
				font-weight: bold;
				color: #333;
				margin-top: 20rpx;
			}
		}

		.card {
			background: #fff;
			border-radius: 16rpx;
			padding: 30rpx;
			margin-bottom: 20rpx;

			.card-title {
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;
				font-size: 30rpx;
				font-weight: bold;
				color: #333;

				.indicator {
					width: 14rpx;
					height: 28rpx;
					background: #FF0101;
					border-radius: 100rpx;
					margin-right: 16rpx;
				}
			}

			.info-row {
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;
				font-size: 26rpx;

				&:last-child {
					margin-bottom: 0;
				}

				.label {
					color: #666;
				}

				.value {
					color: #999;
					text-align: right;
					flex: 1;
					margin-left: 20rpx;
				}
			}
		}

		.log-list {
			background: #fff;
			border-radius: 16rpx;
			padding: 30rpx;

			.log-item {
				display: flex;
				margin-bottom: 40rpx;
				position: relative;

				&:last-child {
					margin-bottom: 0;
				}

				.dot {
					width: 20rpx;
					height: 20rpx;
					border-radius: 50%;
					margin-right: 20rpx;
					margin-top: 10rpx;
					flex-shrink: 0;
				}

				.log-content {
					flex: 1;

					.log-header {
						display: flex;
						justify-content: space-between;
						margin-bottom: 10rpx;

						.log-title {
							font-size: 28rpx;
							font-weight: bold;
							color: #333;
						}

						.log-time {
							font-size: 24rpx;
							color: #999;
						}
					}

					.log-desc {
						font-size: 26rpx;
						color: #999;
						line-height: 1.5;
						white-space: pre-wrap;
					}

					.log-btn {
						display: inline-block;
						background: #FF0101;
						color: #fff;
						font-size: 24rpx;
						padding: 10rpx 30rpx;
						border-radius: 30rpx;
						margin-top: 20rpx;
					}
				}
			}
		}

		.detail-list {
			.detail-item {
				background: #fff;
				border-radius: 16rpx;
				padding: 30rpx;
				margin-bottom: 20rpx;

				.info-row {
					display: flex;
					justify-content: space-between;
					margin-bottom: 20rpx;
					font-size: 26rpx;

					&:last-child {
						margin-bottom: 0;
					}

					.label {
						color: #666;
					}

					.value {
						color: #999;
						text-align: right;
						flex: 1;
						margin-left: 20rpx;
					}
				}
			}
		}
	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: #fff;
		padding: 20rpx 30rpx;
		padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

		.btn-main {
			height: 88rpx;
			line-height: 88rpx;
			background: #FF0101;
			color: #fff;
			text-align: center;
			border-radius: 14rpx;
			font-size: 32rpx;
		}
	}

    .warning-text {
        margin-bottom: 20rpx;
        font-size: 24rpx;
        color: #999999;
        display: flex;
        align-items: center;
        justify-content: center;
        
        text {
            margin-left: 10rpx;
        }
    }

    .invoice-upload-hint {
        font-size: 26rpx;
        color: #666;
        margin-bottom: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .amount {
            color: #FF0101;
            font-weight: bold;
            margin: 0 4rpx;
        }
    }

    .btn-view-invoice {
        margin-top: 30rpx;
        height: 88rpx;
        line-height: 88rpx;
        background: #FF0101;
        color: #fff;
        text-align: center;
        border-radius: 14rpx;
        font-size: 32rpx;
    }
}
</style>
