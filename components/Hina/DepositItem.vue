<template>
	<view class="cpn">
		<view class="hd">
			<view class="line">
				<view class="lab">转账日期</view>
				<view class="txt">{{ objData.transferDate }}</view>
			</view>
			<view class="line">
				<view class="lab">转账金额</view>
				<view class="txt">{{ objData.transferMoney }}</view>
			</view>
			<view class="line">
				<view class="lab">转账银行</view>
				<view class="inf">{{ objData.transferBank }}</view>
			</view>
			<view class="line">
				<view class="lab">银行账户</view>
				<view class="inf">{{ objData.transferBankNumber }}</view>
			</view>
			<view class="line">
				<view class="lab">转账类型</view>
				<view class="inf">{{ objData.depositTransferTypeText }}</view>
			</view>
			<view class="line">
				<view class="lab">转账留言</view>
				<view class="inf">{{ objData.transferMessage }}</view>
			</view>
			<view class="line">
				<view class="lab">审核状态</view>
				<view class="inf">{{ objData.statusText }}</view>
			</view>
		</view>
		<view class="ft">
			<view class="link-item" v-if="objData.attachment" @tap="preview(objData.attachment)">附件图片</view>
			<view class="link-item" v-if="objData.depositReceiptUrl" @tap="previewPdf(objData.depositReceiptUrl)">入账收据
			</view>
		</view>
	</view>
</template>

<script>

export default {
	name: '',
	components: {

	},
	props: {
		objData: {
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
	methods: {
		// 查看附件图片
		preview: function (url) {
			uni.previewImage({
				current: this.index,
				urls: url.split(','),
				longPressActions: {
					itemList: ["保存图片"],
					success: function (data) {
					},
					fail: function (err) {

					},
				},
			});
		},
		// 预览pdf
		previewPdf(depositReceiptUrl) {
			// #ifdef APP-PLUS
			uni.downloadFile({
				url: depositReceiptUrl,
				success: function (res) {
					var filePath = res.tempFilePath;
					uni.openDocument({
						filePath: filePath,
						fileType: 'pdf',
						showMenu: true,
						success: function (res) {

						},
						fail: (err) => {
							console.log(err, "err")
						}
					});
				}
			});
			// #endif
			// #ifdef H5
			uni.openDocument({
				filePath: depositReceiptUrl,
				fileType: 'pdf',
				showMenu: true,
				success: (re) => {

				},
				fail: (err) => {

				}
			})
			// #endif

		}
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
		padding: 16rpx 0;
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

	.ft {
		height: 96rpx;
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
			border: 3rpx solid #EE0A24;
			color: #EE0A24;
		}
	}
}
</style>