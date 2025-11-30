<template>
	<view class="container">
		<!-- 订单状态 -->
		<view class="wrap-state" v-if="isComplete">
			<image class="icon" :src="iconOrderStatus" mode="aspectFit"></image>
			<view class="text">{{ objOrder.orderStatusValue }}</view>
		</view>
		<!-- 收件信息 -->
		<view class="wrap-receive" v-if="isComplete">
			<view class="title">收件信息</view>
			<view class="receive">
				<view class="hd">
					<view class="tit">{{ objOrder.order.consigneeName }}</view>
					<view class="tel">{{ objOrder.order.consigneeMobile }}</view>
				</view>
				<view class="bd">{{ consigneeAddress }}</view>
			</view>
		</view>
		<!-- 包裹信息 -->
		<view class="wrap-receive orderPackage-box"
			v-if="orderPackage.length > 1 && isShowLogistics && objOrder.orderStatus != 'CANCEL'">
			<view class="orderPackage" :class="{ active: selectedIndex === index }" v-for="(item, index) in orderPackage"
				:key="index" @tap="handleOrderPackage(item, index)">
				<view class="img-box" v-for="(items, indexs) in item.thumbnailArr" :key="indexs">
					<image class="thumbnail" :src="items" mode="aspectFit"></image>
				</view>
				<view class="text-box">
					<view class="text">包裹{{ index + 1 }}</view>
					<view class="text">(共{{ item.deliverNumberTotal }}件)</view>
				</view>
			</view>
		</view>
		<!-- 快递信息 -->
		<view class="wrap-receive" v-if="logisticsObj.logisticsNo && isShowLogistics && objOrder.orderStatus != 'CANCEL'">
			<view class="title">物流信息</view>
			<view class="express">
				<!-- 正在配送 -->
				<view class="bd">
					<view class="express">
						<view class="name">{{ logisticsObj.logisticsName }}，快递单号：</view>
						<view class="code">{{ logisticsObj.logisticsNo }}</view>
						<view class="view" data-link="/pages/profile/logisticsTrack" @tap="handlerLink">跟踪</view>
					</view>
				</view>
				<!-- <view class="list">
					<view class="item">
						<view class="hd">2024-02-02/周五 17:17:42</view>
						<view class="bd">[武汉市]您的快件离开【湖北省武汉市东西湖区高桥】，已发往【武汉转运中心】</view>
					</view>
					<view class="item">
						<view class="hd">2022-12-12/周五 15:33:45</view>
						<view class="bd">[武汉市]您的快件被【湖北省武汉市东西湖区高桥】揽收，揽收人: 刘英杰（18505832458）</view>
					</view>
				</view> -->
			</view>
		</view>

		<!-- 快递信息 -->
		<!-- <view class="wrap-receive" v-if="isComplete && false">
			<view class="title">物流信息</view>
			<view class="express">
				<view class="oked">订单已签收，感谢对中品维度的支持，期待再次为您服务。</view>
			</view>
		</view> -->

		<!-- 商品信息 -->
		<view class="wrap-goods" v-if="isComplete">
			<view class="list">
				<view class="item" v-for="(item, index) in objOrder.orderItems" :key="index">
					<view class="bd">
						<view class="icon" :style="{ background: 'url(' + item.image + ')' }"></view>
						<view class="base">
							<view class="txt">{{ item.goodsName }}</view>
							<view class="sku">
								<text class="sku-item">{{ item.simpleSpecs }}</text>
							</view>
							<view class="inf">
								<view class="price">￥{{ item.flowPrice | unitPrice }}</view>
								<view class="count">×{{ item.num }}</view>
							</view>
						</view>
					</view>
					<!-- 已发货、且发生售后时可见 -->
					<view class="ft"
						v-if="item.afterSaleStatus == 'PART_AFTER_SALE' || item.afterSaleStatus == 'ALREADY_APPLIED'">
						<view class="text"></view>
						<view class="link" @tap="handlerAfterSale(item.afterSaleSn)">查看售后</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 订单信息 -->
		<view class="wrap-content" v-if="isComplete">
			<view class="info">
				<view class="rs">
					<view class="lab">订单编号</view>
					<view class="txt">
						<view class="inf">{{ objOrder.order.sn }}</view>
						<view class="lnk" @tap="copySn(objOrder.order.sn)">复制</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">创建时间</view>
					<view class="txt">
						<view class="inf">{{ objOrder.order.createTime }}</view>
					</view>
				</view>
				<view class="rs" v-if="temp && objOrder.order.paymentTime">
					<view class="lab">付款时间</view>
					<view class="txt">
						<view class="inf">{{ objOrder.order.paymentTime }}</view>
					</view>
				</view>
				<view class="rs" v-if="temp && paymentMethod">
					<view class="lab">付款方式</view>
					<view class="txt">
						<view class="inf">{{ paymentMethod }}</view>
					</view>
				</view>
				<view class="rs" v-if="objOrder.order.logisticsTime">
					<view class="lab">发货时间</view>
					<view class="txt">
						<view class="inf">{{ objOrder.order.logisticsTime }}</view>
					</view>
				</view>
				<view class="rs" v-if="objOrder.completeTime">
					<view class="lab">完成时间</view>
					<view class="txt">
						<view class="inf">{{ objOrder.completeTime }}</view>
					</view>
				</view>
				<view class="rs" v-if="logisticsObj.logisticsNo && orderPackage.length == 1">
					<view class="lab">配送方式</view>
					<view class="txt">
						<view class="inf">{{ logisticsObj.logisticsName }} {{ logisticsObj.logisticsNo }}</view>
						<view class="lnk" @tap="copySn(logisticsObj.logisticsNo)">复制</view>
					</view>
				</view>
				<view class="rs" v-if="objOrder.order.remark">
					<view class="lab">备注信息</view>
					<view class="txt">
						<view class="inf">{{ objOrder.order.remark }}</view>
					</view>
				</view>
			</view>
		</view>

		<view v-for="item in objOrder.orderItems">
			<!-- 定制要求 -->
			<view class="wrap-content" v-if="isComplete && item.customRequirements">
				<view class="name">
					<view class="tit">定制要求</view>
				</view>
				<view class="text">{{ item.customRequirements }}</view>
			</view>

			<!--		 相关附件 -->
			<view class="wrap-content" v-if="isComplete && item.attachment && item.attachment.length > 0">
				<view class="name">
					<view class="tit">相关附件</view>
				</view>
				<view class="list" v-if="item.attachment">
					<view class="item" v-for="(itm, index) in [item.attachment]" :key="index">
						<image class="icon" :src="iconCommon + '/static/v1/order/icon-otf.png'" mode="aspectFit">
						</image>
						<view class="info">
							<view class="hd">
								<view class="file">点击查看定制要求附件</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 客户信息 -->
		<view class="wrap-content" v-if="isComplete">
			<view class="name">
				<view class="tit">客户信息</view>
				<!-- <view class="lnk" @tap="goIm">
					<image class="icon" :src="iconChat" mode="aspectFit"></image>
					<view class="text">在线沟通</view>
				</view> -->
			</view>
			<view class="info">
				<view class="rs">
					<view class="lab">客户昵称</view>
					<view class="txt">
						<view class="inf">{{ objOrder.order.memberName }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">注册日期</view>
					<view class="txt">
						<view class="inf">{{ objOrder.order.registerTime }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">联系电话</view>
					<view class="txt">
						<view class="inf">{{ objOrder.order.memberName }} / {{ objOrder.order.memberMobile }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 厂家信息 -->
		<!-- <view class="wrap-content" v-if="isComplete">
			<view class="info">
				<view class="rs">
					<view class="lab">公司全称</view>
					<view class="txt">
						<view class="inf">{{ objOrder.order.storeName }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">注册日期</view>
					<view class="txt">
						<view class="inf">{{ objOrder.order.storeRegisterTime }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">联系电话</view>
					<view class="txt">
						<view class="inf">{{ objOrder.order.storeLinkman }} / {{ objOrder.order.storeLinkPhone }}</view>
					</view>
				</view>
			</view>
		</view> -->

		<!-- 付款信息 -->
		<view class="wrap-price" v-if="isComplete">
			<view class="rs">
				<view class="lab">商品总额</view>
				<view class="txt">
					<view class="num">+￥{{ objOrder.order.goodsPrice }}</view>
				</view>
			</view>
			<view class="rs">
				<view class="lab">运费</view>
				<view class="txt">
					<view class="num">+￥{{ objOrder.order.freightPrice }}</view>
				</view>
			</view>
			<view class="rs">
				<view class="lab">积分</view>
				<view class="txt">
					<view class="inf">（使用{{ priceDetailDTO.payPoint }}积分）</view>
					<view class="num">-￥{{ priceDetailDTO.payPoint }}</view>
				</view>
			</view>
			<view class="rs total">
				<view class="lab">{{ objOrder.order.paymentTime ? '实付款' : '应付款' }}</view>
				<view class="txt">
					<view class="rmb">￥{{ objOrder.order.flowPrice }}</view>
				</view>
			</view>
		</view>

		<!-- 订单状态为：待发货时显示 -->
		<view class="wrap-control" v-if="objOrder.order.orderStatus == 'UNDELIVERED'">
			<view class="lnk-common lnk-primary" @tap="handlerExpress">立即发货</view>
		</view>




	</view>
</template>

<script>

import { storeOrderDetail } from "../../api/store";
import { getPackage } from '@/api/order.js'
export default {
	name: '',
	components: {

	},
	data() {
		return {
			sn: "",
			isComplete: false,
			iconBasePath: `${this.iconCommon}/static/v1/order`,
			iconChat: `${this.iconCommon}/static/v1/order/icon-chat.png`,
			iconOrderStatus: '',		// 订单状态图标
			logisticsStaus: true,       //物流信息是否显示


			objOrder: {
				order: {}
			},						// 订单信息
			temp: true,    //是否显示付款时间和付款方式
			orderPackage: [],//包裹列表
			selectedIndex: null, // 初始化为未选中
			logisticsObj: {
				logisticsNo: '',		// 物流单号
				logisticsName: '',		// 物流公司名称
				logisticsTime: '',	// 物流跟踪时间
				logisticsCode: '',	// 物流公司编号
				consigneeMobile: '',	// 收件人手机号
			},// 物流信息
			isShowLogistics: false,//是否显示物流信息
			priceDetailDTO: {},//价格详情
		}
	},
	computed: {
		// 收件地址
		consigneeAddress() {
			return this.objOrder && this.objOrder.order.consigneeAddressPath ? this.objOrder.order.consigneeAddressPath.replace(/,/g, '') + this.objOrder.order.consigneeDetail : '';
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
			return paymentMethodsText[this.objOrder.order.paymentMethod] || '';
		},
	},
	methods: {
		// 获取包裹列表及物流信息
		loadPackage() {
			getPackage(this.sn).then((res) => {
				if (res.data.success) {
					this.orderPackage = res.data.result;
					this.orderPackage.forEach((item) => {
						// 初始化 deliverNumberTotal 和 thumbnailArr
						item.deliverNumberTotal = 0;
						item.thumbnailArr = [];
						item.orderPackageItemList.forEach((items) => {
							// 累加 deliverNumberTotal
							item.deliverNumberTotal += items.deliverNumber;
							// 收集 thumbnail 到 thumbnailArr
							if (item.thumbnailArr.length < 3) {
								item.thumbnailArr.push(items.thumbnail);
							}
						});
					});
					this.selectedIndex = 0; // 默认选中第一个
					this.logisticsObj.logisticsName = this.orderPackage[0]?.newLogisticsName ? this.orderPackage[0]?.newLogisticsName : this.orderPackage[0]?.logisticsName
					this.logisticsObj.logisticsNo = this.orderPackage[0]?.newLogisticsNo ? this.orderPackage[0]?.newLogisticsNo : this.orderPackage[0]?.logisticsNo
					this.logisticsObj.logisticsCode = this.orderPackage[0]?.newLogisticsCode ? this.orderPackage[0]?.newLogisticsCode : this.orderPackage[0]?.logisticsCode
					this.logisticsObj.consigneeMobile = this.orderPackage[0]?.consigneeMobile
					// 单包裹才给物流时间赋值
					if (this.orderPackage.length == 1) {
						this.logisticsObj.logisticsTime = this.orderPackage[0].newLogisticsTime ? this.orderPackage[0].newLogisticsTime : this.orderPackage[0].logisticsTime
					}

				}
			})
		},
		calculateIsShowLogistics() {
			// 获取当前时间
			const now = new Date();
			// 将 this.time 转为日期对象
			const timeDate = new Date(this.objOrder.order.paymentTime);
			// 计算时间差（以毫秒为单位）
			const diffTime = now - timeDate;
			// 判断是否在 75 天内
			this.isShowLogistics = diffTime < 75 * 1000 * 60 * 60 * 24

		},
		handleOrderPackage(item, index) {
			this.selectedIndex = index; // 更新选中项
			// 物流信息赋值
			if (item.newLogisticsNo) {
				this.logisticsObj.logisticsNo = item.newLogisticsNo
				this.logisticsObj.logisticsName = item.newLogisticsName
				this.logisticsObj.logisticsCode = item.newLogisticsCode
			} else {
				this.logisticsObj.logisticsNo = item.logisticsNo
				this.logisticsObj.logisticsName = item.logisticsName
				this.logisticsObj.logisticsCode = item.logisticsCode
			}
			this.logisticsObj.consigneeMobile = item.consigneeMobile
		},
		// 跳转物流轨迹
		handlerLink: function (e) {
			let eLink = e.currentTarget.dataset.link
			uni.navigateTo({ url: `${eLink}?logisticsCode=${this.logisticsObj.logisticsCode}&logisticsNo=${this.logisticsObj.logisticsNo}&phone=${this.logisticsObj.consigneeMobile}` })
		},
		// 跳转im页面
		goIm() {
			uni.navigateTo({
				url: `/pages/Im/Chat?orderSn=${this.objOrder.order.sn}&storeId=${this.objOrder.order.storeId}&type=business&myId=${this.objOrder.order.storeId}&storeFlag=true&memberId=${this.objOrder.order.memberId}`
			});
		},
		// 跳转售后
		handlerAfterSale(afterSaleSn) {
			uni.navigateTo({ url: `/pages/supplierCenter/salesDetail?sn=${afterSaleSn}` })
		},
		// 跳转立即发货
		handlerExpress: function () {
			uni.navigateTo({
				url: '/pages/supplierCenter/orderExpress?sn=' + this.sn
			})
		},
		// 复制
		copySn(number) {
			uni.setClipboardData({
				data: number,
				success: function () {
				}
			});
		},
		// 加载订单信息
		loadBaseData: function () {
			this.isComplete = true
			let that = this;
			uni.showLoading();
			storeOrderDetail(this.sn).then(res => {
				uni.hideLoading();
				if (res.data.code == 200) {
					that.objOrder = res.data.result;
					that.priceDetailDTO = that.objOrder.order.priceDetailDTO;
					switch (that.objOrder.order.orderStatus) {
						case 'UNPAID':		// 待付款
							that.iconOrderStatus = `${that.iconBasePath}/icon-paying.png`
							this.logisticsStaus = false;
							this.temp = false;
							break;
						case 'UNDELIVERED':		// 待发货
							that.iconOrderStatus = `${that.iconBasePath}/icon-waiting.png`
							this.logisticsStaus = false;
							break;
						case 'PAID':		// 已付款
							that.iconOrderStatus = `${that.iconBasePath}/icon-complete.png`
							this.logisticsStaus = false;
							break;
						case 'DELIVERED':		// 待收货
							that.iconOrderStatus = `${that.iconBasePath}/icon-confirm.png`
							break;
						case 'COMPLETED':		// 待评价
							that.iconOrderStatus = `${that.iconBasePath}/icon-comment.png`
							break;
						case 'FINISH':		// 已完成
							that.iconOrderStatus = `${that.iconBasePath}/icon-complete.png`
							break;
						case 'CANCEL':		// 已取消
							that.iconOrderStatus = `${that.iconBasePath}/icon-cancel.png`
							this.logisticsStaus = false;
							this.temp = false;
							break;
						case 'CANCELLED':		// 已关闭
							that.iconOrderStatus = `${that.iconBasePath}/icon-timeout.png`
							break;
					}
					this.loadPackage()
					this.calculateIsShowLogistics()
				} else {
					that.$u.toast(res.data.message)
				}
			})
		},
	},
	onLoad: function (options) {
		this.sn = options.sn;
		// 加载订单信息
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

	.wrap-content {
		border-radius: 12rpx;
		margin: 0 20rpx 20rpx;
	}

	// 订单物流
	.wrap-receive {
		border-radius: 12rpx;
		margin: 0 20rpx 20rpx;
		position: relative;
		z-index: 1;
		border-radius: 12rpx;
	}

	// 订单商品
	.wrap-goods {
		border-radius: 12rpx;
		margin: 0 20rpx 20rpx;
	}

	// 订单价格
	.wrap-price {
		border-radius: 12rpx;
		margin: 0 20rpx;
	}

	.express {
		font-size: 26rpx;
		line-height: 48rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;

		.name {
			color: #666;
		}

		.code {
			color: #E22221;
		}

		.view {
			margin: 0 0 0 16rpx;
			font-size: 24rpx;
			color: #333;
			width: 80rpx;
			height: 48rpx;
			line-height: 40rpx;
			box-sizing: border-box;
			text-align: center;
			border: 3rpx solid #dedede;
			border-radius: 8rpx;
		}
	}

	.orderPackage-box {
		display: flex;
		align-items: center;
		padding: 0 20rpx !important;
		overflow-x: scroll;
		height: 140rpx;

		.orderPackage {
			display: flex;
			align-items: center;
			justify-content: center;
			background: #f3f3f3;
			border-radius: 16rpx;
			padding: 6rpx 12rpx;
			margin: 10rpx;
			border: 2rpx solid #f3f3f3;

			.img-box {
				.thumbnail {
					height: 60rpx;
					width: 60rpx;
					padding: 0 6rpx;
				}
			}

			.text-box {
				margin-left: 10rpx;
				align-items: center;
				justify-content: center;
				display: flex;
				white-space: nowrap;

				.text {
					font-size: 26rpx;
				}
			}
		}

		.active {
			border: 2rpx solid #E22221;
			/* 激活时的边框 */
			color: #E22221;
			/* 激活时的字体颜色 */
		}
	}
}
</style>
