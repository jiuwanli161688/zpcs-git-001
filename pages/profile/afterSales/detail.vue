<template>
	<view class="container">
		<!-- 售后状态 -->
		<view class="wrap-state" v-if="isComplete">
			<image class="icon" :src="iconSalesStatus" mode="aspectFit"></image>
			<view class="text">{{ statusText }}</view>
		</view>
		<!-- 商品信息 -->
		<view class="wrap-alone" v-if="isComplete" @tap="handlerDetail">
			<view class="bd">
				<view class="icon" :style="{ background: 'url(' + objSales.goodsImage + ')' }"></view>
				<view class="base">
					<view class="txt">{{ objSales.goodsName }}</view>
					<view class="sku">
						<text class="sku-item">{{ objSales.simpleSpecs }}</text>
					</view>
					<view class="inf">
						<view class="price">￥{{ objSales.goodsPrice | unitPrice }}</view>
						<view class="count">×{{ objSales.buyCount }}</view>
					</view>
				</view>
			</view>
			<view class="ft">
				<view class="lab">商品付款</view>
				<view class="lab">实付</view>
				<view class="txt" style="margin-right:10rpx">￥{{ objSales.flowPrice }}</view>
				<!-- <view class="txt">，</view> -->
				<view class="lab">积分抵扣</view>
				<view class="txt">{{ objSales.payPoints }}</view>
			</view>
		</view>
		<!-- 退款进度 -->
		<view class="wrap-service" v-if="isComplete && showReturnFlag">
			<view class="express">
				<view class="refund-status">
					<view class="item" :class="{ 'item-hov': item.time }" v-for="(item, index) in arrRefundData"
						:key="index">
						<view class="node-name">{{ item.status == 3 ? paymentMethod + item.text : item.text }}</view>
						<view class="node-date">{{ item.time ? item.time : '' }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 售后诉求 -->
		<view class="wrap-service">
			<view class="info">
				<view class="rs">
					<view class="lab">售后单号</view>
					<view class="inf">
						<view class="txt">{{ objSales.sn }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">订单单号</view>
					<view class="inf">
						<view class="txt">{{ objSales.orderSn }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">申请时间</view>
					<view class="inf">
						<view class="txt">{{ objSales.createTime }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">服务单位</view>
					<view class="inf">
						<view class="txt">{{ objSales.storeName }}</view>
					</view>
				</view>
				<view class="rs" v-if="objSales.redConfirmUuid">
					<view class="lab">发票冲红</view>
					<view class="inf">
						<view class="txt">{{ objSales.redConfirmUuid }}（红字确认单uuid）</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">售后类型</view>
					<view class="inf">
						<view class="txt">{{ serviceType }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">申请数量</view>
					<view class="inf">
						<view class="txt">{{ objSales.num }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">申请原因</view>
					<view class="inf">
						<view class="txt">{{ objSales.reason }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">问题描述</view>
					<view class="inf">
						<view class="txt">{{ objSales.problemDesc }}</view>
					</view>
				</view>
				<view class="rs" v-if="objSales.serviceType == 'RETURN_GOODS'">
					<view class="lab">退款方式</view>
					<view class="inf">
						<view class="txt">{{ objSales.refundWay == 'ORIGINAL' ? '原路返回' : '线下支付' }}</view>
						<view class="num">预估退款金额￥{{ objSales.expectRefundPrice | unitPrice }}，<span
								v-if="objSales.expectRefundPoints">积分{{ objSales.expectRefundPoints }}，</span>以实际情况为准
						</view>
					</view>
				</view>
				<view class="rs" v-if="userIconArr[0]">
					<view class="lab">相关截图</view>
				</view>
				<view class="ic" v-if="userIconArr[0]">
					<view class="ic-item" v-for="(item, index) in userIconArr" :key="index" v-if="item">
						<image class="ico" :src="item" mode="aspectFill" @tap="preview(userIconArr, index)"></image>
					</view>
				</view>
				<view class="btn-box" @tap="goIm">
					<view class="chat-box">
						<u-icon name="chat" size="40"></u-icon>
						<view class="link-im">联系商家</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 处理过程 -->
		<view class="wrap-process">
			<view class="list">
				<view class="item" v-for="(item, index) in objSales.afterSaleLogs" :key="index">
					<view class="hd">
						<image class="icon" :src="iconStep" mode="aspectFit"></image>
						<view class="text">{{ item.timeline }}</view>
					</view>
					<!-- 申请被拒绝原因 || 商家拒签原因 -->
					<view class="bd"
						v-if="item.serviceStatus == 'SELLER_REFUSE_HANDLE' || item.serviceStatus == 'REFUSE' || item.serviceStatus == 'SELLER_REFUSE'">
						<!-- 申请被拒绝原因 || 商家拒签原因 -->
						<view class="content">{{ item.remark }}</view>
						<!-- 申请被拒绝图片 || 商家拒签图片 -->
						<view class="thumb" v-if="item.relatedImages && item.relatedImages.length > 0">
							<view class="tu-item" v-for="(items, indexImages) in item.relatedImages" :key="indexImages">
								<image class="ico" :src="items" mode="aspectFill"
									@tap="preview(item.relatedImages, indexImages)"></image>
							</view>
						</view>
					</view>
					<!-- 商家同意申请，商品需要寄回 -->
					<view class="bd" v-if="item.serviceStatus == 'WAITING_RETURN' && item.goodsReturn">
						<view class="address">
							<view class="name">
								<view class="tit">{{ item.salesConsigneeName }}</view>
								<view class="tel">{{ item.salesConsigneeMobile }}</view>
							</view>
							<view class="text">{{ salesConsigneeAddress(item) }}</view>
						</view>
					</view>
					<!-- 用户寄出商品--物流信息 -->
					<view class="bd" v-if="item.serviceStatus == 'BUYER_RETURN'">
						<view class="express">
							<view class="name">{{ item.memberLogisticsName }}，快递单号：</view>
							<view class="code">{{ item.memberLogisticsNo }}</view>
							<view class="view" data-link="/pages/profile/logisticsTrack"
								:data-ConsigneeMobile="item.salesSendingMobile"
								:data-logisticsCode="item.memberLogisticsCode" :data-logisticsNo="item.memberLogisticsNo"
								@tap="handlerLink">跟踪</view>
						</view>
					</view>
					<!-- 商家补发快递 -->
					<view class="bd" v-if="item.serviceStatus == 'PRODUCT_REPLACEMENT' && item.agreeReissue">
						<view class="express">
							<view class="name">{{ item.reissueLogisticsName }}，快递单号：</view>
							<view class="code">{{ item.reissueLogisticsNo }}</view>
							<view class="view" data-link="/pages/profile/logisticsTrack"
								:data-ConsigneeMobile="item.salesConsigneeMobile"
								:data-logisticsCode="item.reissueLogisticsCode" :data-logisticsNo="item.reissueLogisticsNo"
								@tap="handlerLink">跟踪</view>
						</view>
					</view>
					<view class="ft">
						<view class="date">{{ item.createTime }}</view>
						<view class="name">{{ item.operatorName }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 处理表单，状态为【等待回寄商品】时显示 -->
		<view class="wrap-control">
			<view
				v-if="objSales.serviceStatus == 'WAITING_RETURN' && ((objSales.responsibilityParty == 'STORE' && !objSales.complainDeliveryMethod) || (objSales.complainDeliveryMethod == '2')) && doorFaild == false && !objSales.pickUpFlag"
				class="lnk-common lnk-primary" data-link="/pages/profile/afterSales/doorExpress" @tap="handlerLink">上门取件
			</view>
			<view v-if="objSales.pickUpFlag && objSales.serviceStatus != 'COMPLETE'" class="lnk-common lnk-primary"
				data-link="/pages/profile/afterSales/doorSchedule" @tap="handlerLink">查看上门取件进度
			</view>
			<view
				v-if="objSales.serviceStatus == 'WAITING_RETURN' && ((objSales.responsibilityParty == 'MEMBER' && !objSales.complainDeliveryMethod) || (objSales.complainDeliveryMethod == '1'))"
				class="lnk-common lnk-primary" data-link="/pages/profile/afterSales/selfExpress" @tap="handlerLink">自行寄回
			</view>
			<view v-if="objSales.serviceStatus == 'APPLY'" class="lnk-common lnk-primary" @tap="cancelSales">取消售后
			</view>
			<view
				v-if="objSales.serviceStatus == 'WAITING_RETURN' && objSales.responsibilityParty == 'STORE' && doorFaild == true"
				class="lnk-common lnk-primary" data-link="/pages/profile/afterSales/selfExpress" @tap="handlerLink">
				上门服务失败，选择自行寄回</view>
			<view
				v-if="objSales.serviceStatus == 'WAITING_RETURN' && objSales.responsibilityParty == 'STORE' && doorFaild == true"
				class="lnk-common lnk-primary" data-link="/pages/profile/afterSales/selfExpress" @tap="newDoor">
				重新校验上门取件服务</view>
			<!-- 售后申请被商家拒绝时发起投诉 -->
			<view v-if="!objSales.agreeComplaint && objSales.serviceStatus == 'SELLER_TERMINATION'"
				class="lnk-common lnk-primary" data-link="/pages/profile/complaint/insert" @tap="handlerLink">发起投诉
			</view>
		</view>

		<!-- 厂家信息 -->
		<!-- <view class="wrap-content">
			<view class="name">
				<view class="tit">厂家信息</view>
				<view class="lnk" @tap="goIm">
					<image class="icon" :src="iconChat" mode="aspectFit"></image>
					<view class="text">在线沟通</view>
				</view>
			</view>
			<view class="info">
				<view class="rs">
					<view class="lab">公司全称</view>
					<view class="txt">
						<view class="inf">{{ objSales.storeName }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">注册日期</view>
					<view class="txt">
						<view class="inf">{{ objSales.registerTime }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">联系电话</view>
					<view class="txt">
						<view class="inf">{{ objSales.linkName }} / {{ objSales.linkPhone }}</view>
					</view>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
import {
	getServiceDetail, checkDoorServiceOpen, cancelAfterSale
} from "@/api/after-sale.js";
export default {
	name: '',
	components: {

	},
	data() {
		return {
			isComplete: false,
			iconBasePath: `${this.iconCommon}/static/v1/sales`,
			iconStep: `${this.iconCommon}/static/v1/sales/icon-step.png`,
			iconChat: `${this.iconCommon}/static/v1/order/icon-chat.png`,
			iconCheck: `${this.iconCommon}/static/v1/common/icon-checked.png`,
			iconCamera: `${this.iconCommon}/static/v1/common/icon-camera.png`,
			iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,

			objSales: {
				code: '',							// 售后单号
				status: '',						// 售后状态
				statusText: '',				// 售后状态
				goods: {},						// 商品信息
				responsibilityParty: '',         //责任方
			},

			sn: '', // 售后id
			userIconArr: [],// 用户上传图片
			doorFaild: false,//
			params: {},
			arrRefundData: [],//退款数据
			showReturnFlag: false,//是否显示退款轨迹
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
				'WAIT_RED_CONFIRM_REISSUE': '等待用户确认红字确认单后补发',
			};
			return statusText[this.objSales.serviceStatus] || '';
		},
		iconSalesStatus() {
			const iconSalesStatus = {
				'APPLY': `${this.iconBasePath}/icon-process.png`, // 待处理-申请中
				'PASS': `${this.iconBasePath}/icon-process.png`, // 处理中-已通过
				'REFUSE': `${this.iconBasePath}/icon-fail.png`, // 已完成-卖家拒绝申请
				'BUYER_RETURN': `${this.iconBasePath}/icon-process.png`, // 处理中-待卖家收货
				'SELLER_CONFIRM': `${this.iconBasePath}/icon-process.png`,  // 卖家确认收货
				'SELLER_TERMINATION': `${this.iconBasePath}/icon-complete.png`, // 卖家终止售后
				'BUYER_CANCEL': `${this.iconBasePath}/icon-fail.png`,// 买家取消售后
				'WAIT_REFUND': `${this.iconBasePath}/icon-process.png`, // 等待平台退款
				'COMPLETE': `${this.iconBasePath}/icon-complete.png`, // 完成售后服务
				'WAITING_RETURN': `${this.iconBasePath}/icon-process.png`, // 等待商品回寄
				'WAITING_REISSUE': `${this.iconBasePath}/icon-process.png`, // 等待商品补发
				'WAIT_RED_CONFIRM_REISSUE': `${this.iconBasePath}/icon-process.png`, // 等待用户确认红字确认单后补发
			};
			return iconSalesStatus[this.objSales.serviceStatus] || '';
		},
		// 售后类型
		serviceType() {
			const serviceType = {
				'RETURN_GOODS': '退货',
				'EXCHANGE_GOODS': '换货',
			};
			return serviceType[this.objSales.serviceType] || '';
		},
		// 收件地址
		salesConsigneeAddress() {
			return (item) => {
				return item && item.salesConsigneeAddressPath ? item.salesConsigneeAddressPath.replace(/,/g, '') + item.salesConsigneeDetail : '';
			};
		},
		responsibilityParty() {
			const responsibilityParty = {
				'MEMBER': '用户',
				'STORE': '商家',
			};
			return responsibilityParty[this.objSales.responsibilityParty] || '';
		},
		// 付款方式
		paymentMethod() {
			const paymentMethodsText = {
				'WECHAT': '微信',
				'ALIPAY': '支付宝',
				'UNIONPAY': '银联-云闪付',
				'UNIONPAY_MP': '银联-云闪付',
				'WALLET': '余额支付',
				'BANK_TRANSFER': '线下转账'
			};
			return paymentMethodsText[this.objSales.order.paymentMethod] || '';
		},
	},
	methods: {
		//取消售后
		cancelSales() {
			uni.showModal({
				title: "提示",
				content: "是否取消售后",
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: "加载中", mask: true })
						cancelAfterSale(this.objSales.sn).then(res => {
							uni.hideLoading();
							if (res.data.code == 200) {
								this.loadBaseData()
							}
						})
					}

				}
			})

		},

		// 跳转im页面
		goIm() {
			uni.navigateTo({
				url: `/pages/Im/Chat?afterSaleSn=${this.objSales.sn}&storeId=${this.objSales.storeId}&type=business&memberId=${this.objSales.memberId}`
			});
		},
		/**
		 * 点击图片放大或保存
		 */
		preview(urls, index) {
			uni.previewImage({
				current: index,
				urls: urls,
				longPressActions: {
					itemList: ["保存图片"],
					success: function (data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function (err) {
						console.log(err.errMsg);
					},
				},
			});
		},
		// 加载售后信息
		loadBaseData: function () {
			getServiceDetail(this.sn).then((res) => {
				if (res.data.success) {
					if (this.$store.state.isShowToast) { uni.hideLoading() };
					this.isComplete = true
					this.objSales = res.data.result;
					this.showReturnFlag = res.data.result.showReturnFlag
					// let skuObj=JSON.parse(res.data.result.specs)
					// console.log(skuObj,'skuObj');
					// this.objSales.sku=skuObj['颜色']
					this.userIconArr = this.objSales.afterSaleImage?.split(',')
					this.arrRefundData = []
					this.arrRefundData.push({
						text: '商家同意',
						time: this.objSales.passRefundTime,
						status: 1
					}, {
						text: '提交支付通道',
						time: this.objSales.order.submitTime,
						status: 2
					}, {
						text: '退款成功',
						time: this.objSales.order.returnTime,
						status: 3
					},)
				}
			});
		},


		// 跳转链接
		handlerLink: function (e) {
			let eLink = e.currentTarget.dataset.link
			let eLogisticsCode = e.currentTarget.dataset.logisticscode
			let eLogisticsNo = e.currentTarget.dataset.logisticsno
			let eConsigneeMobile = e.currentTarget.dataset.consigneemobile
			if (eLink == '/pages/profile/complaint/insert') {
				uni.navigateTo({ url: `${eLink}?afterSaleId=${this.objSales.id}` })
			} else if (eLink == '/pages/profile/logisticsTrack') {
				uni.navigateTo({ url: `${eLink}?logisticsCode=${eLogisticsCode}&logisticsNo=${eLogisticsNo}&phone=${eConsigneeMobile}` })
			}
			else {
				uni.navigateTo({ url: `${eLink}?sn=${this.objSales.sn}` })
			}
		},
		handlerDetail: function () {
			uni.navigateTo({
				url: `/pages/product/goods?id=${this.objSales.skuId}&goodsId=${this.objSales.goodsId}`
			});
		},
		newDoor: async function () {
			await getServiceDetail(this.sn).then((res) => {
				if (res.data.success) {
					if (this.$store.state.isShowToast) { uni.hideLoading() };
					let objSalesTest = res.data.result;
					let receiverAddress = objSalesTest.salesConsigneeAddressPath.split(",");
					let senderAddress = objSalesTest.salesSendingAddressPath.split(",");
					this.params = {
						shipperType: 3,

						receiver: {
							provinceName: receiverAddress[0],
							cityName: receiverAddress[1],
							expAreaName: receiverAddress[2],
							address: receiverAddress[3],
						},
						sender: {
							provinceName: senderAddress[0],
							cityName: senderAddress[1],
							expAreaName: senderAddress[2],
							address: senderAddress[3],
						},
						weight: 1
					}
				}
			});
			//加载时间信息
			await checkDoorServiceOpen(this.params).then(res => {
				if (res.data.success) {
					this.$u.toast('已具备上门服务能力')
					this.$store.commit('modifyDoorTest', this.objSales.sn);
					// 判断上门服务是否失败
					let doorState = false
					this.$store.state.doorFaild.map(item => {
						if (doorState) {
							return
						}
						if (item == this.objSales.sn) {
							doorState = true
							this.doorFaild = true
						} else {
							this.doorFaild = false
						}
					})
					if (this.$store.state.doorFaild.length == 0) {
						this.doorFaild = false
					}
				} else {
					this.$u.toast('上门服务能力还不具备，请稍后再试')
				}
			})
		}
	},
	onLoad: function (options) {
		this.sn = options.afterSaleSn
	},
	onShow: async function () {
		// 加载售后信息
		await this.loadBaseData()
		// 判断上门服务是否失败
		let doorState = false
		this.$store.state.doorFaild.map(item => {
			if (doorState) {
				return
			}
			if (item == this.objSales.sn) {
				doorState = true
				this.doorFaild = true
			} else {
				this.doorFaild = false
			}
		})
		if (this.$store.state.doorFaild.length == 0) {
			this.doorFaild = false
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;

	.express {
		.refund-status {
			padding: 20rpx 0 0;

			.item {
				min-height: 100rpx;
				position: relative;
				padding: 0 0 20rpx 32rpx;

				// padding-left: 36rpx;
				&::before {
					content: '';
					position: absolute;
					background: #f3f3f3;
					border-radius: 8rpx;
					left: 6rpx;
					top: 36rpx;
					bottom: -36rpx;
					width: 3rpx;
				}

				&:last-of-type {
					padding: 0 0 0 32rpx;

					&::before {
						display: none;
					}
				}

				.node-name {
					position: relative;
					height: 68rpx;
					line-height: 68rpx;
					font-size: 32rpx;
					font-weight: 600;
					color: #666;

					&::before {
						content: '';
						position: absolute;
						background: #a1a0a0;
						width: 15rpx;
						height: 15rpx;
						border-radius: 15rpx;
						left: -32rpx;
						top: 50%;
						transform: translateY(-50%);
					}
				}

				.node-date {
					height: 32rpx;
					line-height: 32rpx;
					font-size: 26rpx;
					color: #999;
				}
			}

			.item-hov {
				&::before {
					background-color: #E22221;
				}

				.node-name {
					color: #E22221;

					&::before {
						background: #E22221;
					}
				}
			}
		}
	}

	.btn-box {
		border-top: 2rpx solid #dcdcdc;
		margin-top: 20rpx;

		.chat-box {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 20rpx;
		}

		.link-im {
			font-size: 30rpx;
			margin-left: 10rpx;
		}
	}
}
</style>
