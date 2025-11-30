<template>
	<view class="container">
		<!-- 售后状态 -->
		<view class="wrap-state" v-if="isComplete">
			<image class="icon" :src="iconSalesStatus" mode="aspectFit"></image>
			<view class="text">{{ statusText }}</view>
		</view>
		<!-- 商品信息 -->
		<view class="wrap-alone" v-if="isComplete">
			<view class="bd">
				<view class="icon" :style="{ background: 'url(' + objSales.goodsImage + ')' }"></view>
				<view class="base">
					<view class="txt">{{ objSales.goodsName }}</view>
					<view class="sku">
						<text class="sku-item">{{ objSales.simpleSpecs }}</text>
					</view>
					<view class="inf">
						<view class="price">￥{{ objSales.goodsPrice | unitPrice }}</view>
						<view class="count">×{{ objSales.num }}</view>
					</view>
				</view>
			</view>
			<view class="ft">
				<view class="lab">实付</view>
				<view class="txt">{{ objSales.flowPrice | unitPrice }}</view>
			</view>
		</view>


		<!-- 售后诉求 -->
		<view class="wrap-service">
			<view class="info">
				<view class="rs">
					<view class="lab">售后类型</view>
					<view class="inf">
						<view class="txt">{{ serviceType }}</view>
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
				<view class="rs" v-if="serviceType != '[换货]'">
					<view class="lab">退款方式</view>
					<view class="inf">
						<view class="txt">{{ objSales.refundWay == 'ORIGINAL' ? '原路返回' : '线下支付' }}</view>
						<view class="num">预估退款金额￥{{ objSales.expectRefundPrice | unitPrice }}，<span
								v-if="objSales.refundPoint">积分{{ objSales.refundPoint }}，</span>以实际情况为准</view>
					</view>
				</view>
				<view class="rs" v-if="userIconArr.length[0]">
					<view class="lab">相关截图</view>
				</view>
				<view class="ic" v-if="userIconArr.length[0]">
					<view class="ic-item" v-for="(item, index) in userIconArr" :key="index">
						<image class="ico" :src="item" mode="aspectFill" @tap="preview(userIconArr, index)"></image>
					</view>
				</view>
				<!-- <view class="btn-box" @tap="goIm">
					<view class="chat-box">
						<u-icon name="chat" size="40"></u-icon>
						<view class="link-im">联系客户</view>
					</view>
				</view> -->
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
		<!-- 厂家信息 -->
		<!-- <view class="wrap-content">
			<view class="name">
				<view class="tit">厂家信息</view>
				<view class="lnk" @tap="goIm">
					<image class="icon" :src="iconChat" mode="aspectFit"></image>
					<view class="text">协助客户与厂家客服沟通</view>
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
	getDealerServiceDetail,
} from "@/api/dealerCenter.js";
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
			},

			sn: '', // 售后id
			userIconArr: [],// 用户上传图片
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
			};
			return iconSalesStatus[this.objSales.serviceStatus] || '';
		},
		// 售后类型
		serviceType() {
			const serviceType = {
				'RETURN_GOODS': '[退货]',
				'EXCHANGE_GOODS': '[换货]',
			};
			return serviceType[this.objSales.serviceType] || '';
		},
		// 收件地址
		salesConsigneeAddress() {
			return (item) => {
				return item && item.salesConsigneeAddressPath ? item.salesConsigneeAddressPath.replace(/,/g, '') + item.salesConsigneeDetail : '';
			};
		}
	},
	methods: {
		// 跳转im页面
		goIm() {
			uni.navigateTo({
				url: `/pages/Im/Chat?afterSaleSn=${this.objSales.sn}&storeId=${this.objSales.storeId}&type=business&myId=${this.objSales.distributorId}&distributorFlag=true&memberId=${this.objSales.memberId}`
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
			getDealerServiceDetail(this.sn).then((res) => {
				if (res.data.success) {
					if (this.$store.state.isShowToast) { uni.hideLoading() };
					this.isComplete = true
					this.objSales = res.data.result;
					this.userIconArr = this.objSales.afterSaleImage?.split(',')
				}
			});
		},


		// 跳转链接
		handlerLink: function (e) {
			let eLink = e.currentTarget.dataset.link
			let eLogisticsCode = e.currentTarget.dataset.logisticscode
			let eLogisticsNo = e.currentTarget.dataset.logisticsno
			let eConsigneeMobile = e.currentTarget.dataset.consigneemobile
			uni.navigateTo({ url: `${eLink}?logisticsCode=${eLogisticsCode}&logisticsNo=${eLogisticsNo}&phone=${eConsigneeMobile}` })
		},
	},
	onLoad: function (options) {
		this.sn = options.afterSaleSn
	},
	onShow: function () {
		// 加载售后信息
		this.loadBaseData()
	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;

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
