<template>
	<view class="container">
		<!-- 订单状态 -->
		<view class="wrap-state" v-if="isComplete">
			<image class="icon" :src="iconOrderStatus" mode="aspectFit"></image>
			<view class="text">{{ objOrder.orderStatusText }}</view>
		</view>
		<!-- 收件信息 -->
		<view class="wrap-receive" v-if="isComplete">
			<view class="title">收件信息</view>
			<view class="receive">
				<view class="hd">
					<view class="tit">{{ objOrder.consigneeName }}</view>
					<view class="tel">{{ objOrder.consigneeMobile }}</view>
				</view>
				<view class="bd">{{ consigneeAddress }}</view>
				<view v-if="this.againDelivery" class="lnk-common lnk-primary" @tap="handleAgainDelivery">修改订单</view>
			</view>
		</view>
		<!-- 退款进度 -->
		<view class="wrap-receive" v-if="isComplete && showReturnFlag">
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
		<!-- v-if="isComplete && (objOrder.orderStatus == 'DELIVERED' || objOrder.orderStatus == 'UNDELIVERED' || objOrder.orderStatus == 'COMPLETED')" -->
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
		<!-- 因涉及多个快递包裹，无法改变订单的签收状态。 -->
		<!-- <view class="wrap-receive" v-if="isComplete && objOrder.deliverStatus == 'RECEIVED'">
			<view class="title">物流信息</view>
			<view class="express">
				<view class="oked">订单已签收，感谢对中品维度的支持，期待再次为您服务。</view>
			</view>
		</view> -->

		<!-- 商品信息 -->
		<view class="wrap-goods" v-if="isComplete">
			<view class="list">
				<view class="item" v-for="(item, index) in objOrder.goods" :key="index">
					<view class="bd" @tap.stop="handlerDetail(item)">
						<view class="icon" :style="{ background: 'url(' + item.image + ')' }"></view>
						<view class="base">
							<view class="txt">{{ item.goodsName }}</view>
							<view class="sku">
								<text class="sku-item">{{ item.simpleSpecs }}</text>
							</view>
							<view class="inf">
								<view class="price">￥{{ item.unitPrice | unitPrice }}</view>
								<view class="count">×{{ item.num }}</view>
							</view>
						</view>
					</view>

					<view class="ft ft-ext">
						<view class="text">
							{{ item.afterSaleStatus == 'EXPIRED' ? '该商品已超过售后期' : '' }}
						</view>
						<view class="link-ext">
							<!-- 未发生售后 -->
							<view v-if="item.afterSaleStatus == 'NOT_APPLIED'" class="link" @tap="handlerLink"
								:data-goods-Sn="item.sn" data-link="/pages/profile/afterSales/insert">申请售后</view>
							<!-- 发生过售后 -->
							<view
								v-if="item.afterSaleStatus == 'PART_AFTER_SALE' || item.afterSaleStatus == 'ALREADY_APPLIED'"
								class="link" @tap="handlerAfterSale(item.afterSaleSn)">查看售后</view>
							<!-- 超出售后期 -->
							<view v-if="item.afterSaleStatus == 'EXPIRED'" class="link link-dis">无法申请</view>
							<!-- 再次购买 已完成并且不是定制商品 -->
							<view
								v-if="(objOrder.orderStatus == 'COMPLETED' || objOrder.orderStatus == 'FINISH') && !item.customFlag && isFull"
								class="link" @tap="handlerLink" :data-sku-Id="item.skuId" :data-num="item.num"
								data-link="/pages/tabbar/cart/cartList">加入购物车</view>
						</view>
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
						<view class="inf">{{ objOrder.sn }}</view>
						<view class="lnk" @tap="copySn(objOrder.sn)">复制</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">创建时间</view>
					<view class="txt">
						<view class="inf">{{ objOrder.createTime }}</view>
					</view>
				</view>
				<view class="rs" v-if="objOrder.paymentTime">
					<view class="lab">付款时间</view>
					<view class="txt">
						<view class="inf">{{ objOrder.paymentTime }}</view>
					</view>
				</view>
				<view class="rs" v-if="objOrder.paymentMethod">
					<view class="lab">付款方式</view>
					<view class="txt">
						<view class="inf">{{ paymentMethod }}</view>
					</view>
				</view>
				<view class="rs" v-if="objOrder.logisticsTime">
					<view class="lab">发货时间</view>
					<view class="txt">
						<view class="inf">{{ objOrder.logisticsTime }}</view>
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
				<view class="rs" v-if="objOrder.remark">
					<view class="lab">备注信息</view>
					<view class="txt">
						<view class="inf">{{ objOrder.remark }}</view>
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

		<!-- 定制要求 -->
		<view class="wrap-content" v-if="isComplete && objOrder.goods[0].customFlag">
			<view class="name">
				<view class="tit">定制要求</view>
			</view>
			<view class="text">{{ objOrder.goods[0].customRequirements }}</view>
		</view>

		<!-- 相关附件 -->
		<!--		<view class="wrap-content" >-->
		<view class="wrap-content"
			v-if="isComplete && objOrder.goods[0].customFlag && objOrder.goods[0].attachment.length > 0">
			<view class="name">
				<view class="tit">相关附件</view>
			</view>
			<view class="list">
				<view class="item" v-for="(item, index) in attachment" :key="index">
					<!-- 需要判断icon样式 -->
					<image class="icon" :src="fileIcon" mode="aspectFit"></image>
					<view class="info">
						<view class="hd">
							<!-- <image v-if="item.type=='image/png'||item.type=='image/jpg'" class="file":src="item.file" mode="aspectFit" @tap="preview(item.file,index)"></image>
							<view v-else class="file">{{item.file}}</view> -->
							<view class="size">{{ item.size }}KB</view>
						</view>
						<view class="bd">{{ item.date }}</view>
					</view>
				</view>
				<view>移动端暂不支持查看附件，请前往PC端下载查看详情。</view>
			</view>
		</view>


		<!-- 客户信息 -->
		<view class="wrap-content" v-if="isComplete">
			<view class="name">
				<view class="tit">客户信息</view>
				<!-- <view class="lnk" >
					<image class="icon" :src="iconChat" mode="aspectFit"></image>
					<view class="text">在线沟通</view>
				</view> -->
			</view>
			<view class="info">
				<view class="rs">
					<view class="lab">客户昵称</view>
					<view class="txt">
						<view class="inf">{{ objOrder.memberName }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">注册日期</view>
					<view class="txt">
						<view class="inf">{{ objOrder.registerTime }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">联系电话</view>
					<view class="txt">
						<view class="inf">{{ objOrder.consigneeName }} / {{ objOrder.consigneeMobile }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 厂家信息 -->
		<!-- <view class="wrap-content" v-if="isComplete">
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
						<view class="inf">{{ objOrder.storeName }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">注册日期</view>
					<view class="txt">
						<view class="inf">{{ objOrder.storeRegisterTime }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">联系电话</view>
					<view class="txt">
						<view class="inf">{{ objOrder.storeLinkman }} / {{ objOrder.storeLinkPhone }}</view>
					</view>
				</view>
			</view>
		</view> -->

		<!-- 付款信息 -->
		<view class="wrap-price" v-if="isComplete">
			<view class="rs">
				<view class="lab">商品总额</view>
				<view class="txt">
					<view class="num">+￥{{ objOrder.goodsPrice }}</view>
				</view>
			</view>
			<view class="rs">
				<view class="lab">运费</view>
				<view class="txt">
					<view class="num">+￥{{ objOrder.freightPrice | unitPrice }}</view>
				</view>
			</view>
			<view class="rs" v-if="objOrder.priceDetail.payPoint > 0">
				<view class="lab">积分</view>
				<view class="txt">
					<view class="inf">（使用{{ objOrder.priceDetail.payPoint }}积分）</view>
					<view class="num">-￥{{ objOrder.priceDetail.payPoint }}</view>
				</view>
			</view>
			<view class="rs total">
				<view class="lab">实付款</view>
				<view class="txt">
					<view class="rmb">￥{{ objOrder.priceDetail.billPrice | unitPrice }}</view>
				</view>
			</view>
		</view>

		<!-- 注意判断状态为已取消、已关闭、已完成时不显示按钮容器 -->
		<view class="wrap-control" v-if="isComplete">
			<!-- 再次购买 -->
			<view class="lnk-common lnk-primary" v-if="!objOrder.customFlag&&isFull" @tap.stop="repurchaseOrderEve(objOrder)">再次购买</view>
			<!-- 待付款 -->
			<view class="lnk-common lnk-primary"
				v-if="objOrder.orderStatus == 'DELIVERED' || objOrder.orderStatus == 'UNDELIVERED'" @tap="handlerUrge">我要催单
			</view>
			<view class="lnk-common lnk-primary" v-if="objOrder.orderStatus == 'UNPAID'" @tap="handlerPay">立即付款</view>
			<view class="lnk-common lnk-secondary" v-if="objOrder.orderStatus == 'UNPAID'" @tap="handlerCancel">取消订单
			</view>
			<!-- 待发货 -->
			<view class="lnk-common lnk-secondary"
				v-if="objOrder.orderStatus == 'UNDELIVERED' || objOrder.orderStatus == 'PAID'" @tap="handlerCancel">取消订单
			</view>
			<!-- 待收货 -->
			<view class="lnk-common lnk-primary" v-if="objOrder.orderStatus == 'DELIVERED'" @tap="handlerConfirm">确认收货
			</view>
			<!-- 待评价 -->
			<view class="lnk-common lnk-primary"
				v-if="objOrder.orderStatus == 'COMPLETED' && objOrder.commentStatus == 'UNFINISHED'" @tap="handlerLink"
				data-link="/pages/profile/comment/insert">发表评价</view>
			<!-- 查看评价 -->
			<view class="lnk-common lnk-primary"
				v-if="objOrder.commentStatus != 'UNFINISHED' && objOrder.commentStatus != 'NEW'" @tap="handlerCommentDetail"
				data-link="/pages/profile/comment/detail">查看评价</view>
			<!-- 申请开票 -->
			<view class="lnk-common lnk-primary"
				v-if="(objOrder.orderStatus == 'COMPLETED' || objOrder.orderStatus == 'FINISH') && (objOrder.receiptStatus == 0 || objOrder.receiptStatus == 1) && objOrder.isInvoiceOutTime == false"
				@tap="handlerInvoice">申请开票</view>
			<!-- 查看开票 -->
			<view class="lnk-common lnk-primary" v-if="objOrder.receiptStatus == 3" @tap.stop="handlerInvoiceDetail">
				查看开票
			</view>
			<!-- 发票重开 -->
			<view class="lnk-common lnk-primary" v-if="objOrder.receiptStatus == 3" @tap.stop="handlerInvoiceReopen">
				重开发票
			</view>
		</view>


	</view>
</template>

<script>
import { getOrderDetail, repurchaseOrder } from "@/api/order.js";
import { cancelOrder, confirmReceipt, getAddressStatus, getPackage, urgeOrder } from '@/api/order.js'
import * as API_trade from '@/api/trade.js';
import storage from "@/utils/storage.js";
export default {
	name: '',
	components: {

	},
	data() {
		return {
			isComplete: false,
			iconBasePath: `${this.iconCommon}/static/v1/order`,
			iconChat: `${this.iconCommon}/static/v1/order/icon-chat.png`,
			iconOrderStatus: '',		// 订单状态图标
			objOrder: {
				sn: '',							// 订单编号
				status: '',
				orderStatusText: '',				// 订单状态
				goods: [],						// 商品信息
				isDiy: false,					// 是否定制
				diyText: '',					// 定制描述
				diyFile: [],					// 相关附件
			},						// 订单信息
			orderSn: '',// 订单编号
			attachment: [],// 附件数组
			againDelivery: false,//是否重新发货
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
			arrRefundData: [],//退款数据
			showReturnFlag: false,//是否显示退款轨迹
		}
	},
	computed: {
		isFull(){
			return this.$store.state.isFull
		},
		// 收件地址
		consigneeAddress() {
			return this.objOrder && this.objOrder.consigneeAddressPath ? this.objOrder.consigneeAddressPath.replace(/,/g, '') + this.objOrder.consigneeDetail : '';
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
			return paymentMethodsText[this.objOrder.paymentMethod] || '';
		},
		// 附件icon
		fileIcon() {
			if (this.objOrder && this.objOrder.goods && this.objOrder.goods.length > 0) {
				const fileIconName = {
					'application/msword': `${this.iconCommon}/static/v1/order/icon-doc.png`,
					'application/pdf': `${this.iconCommon}/static/v1/order/icon-pdf.png`,
					'application/vnd.ms-powerpoint': `${this.iconCommon}/static/v1/order/icon-ppt.png`,
					'application/vnd.openxmlformats-officedocument.presentationml.presentation': `${this.iconCommon}/static/v1/order/icon-ppt.png`,
					'text/plain': `${this.iconCommon}/static/v1/order/icon-txt.png`,
					'application/vnd.ms-excel': `${this.iconCommon}/static/v1/order/icon-xls.png`,
				};
				const defaultIcon = `${this.iconCommon}/static/v1/order/icon-otf.png`;
				const fileType = this.objOrder.goods[0].attachmentType;
				return fileIconName[fileType] || defaultIcon;
			} else {
				return '';
			}
		}

	},

	methods: {
		// 再次购买
		repurchaseOrderEve(e) {
			repurchaseOrder(e.sn).then(res => {
				if (res.data.success) {
					uni.reLaunch({
						url: `/pages/tabbar/cart/cartList?OrderId=${e.sn}`,
					})
				}
			})
		},
		// 获取包裹列表及物流信息
		loadPackage() {
			getPackage(this.orderSn).then((res) => {
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
					this.logisticsObj.logisticsName = this.orderPackage[0].newLogisticsName ? this.orderPackage[0].newLogisticsName : this.orderPackage[0].logisticsName
					this.logisticsObj.logisticsNo = this.orderPackage[0].newLogisticsNo ? this.orderPackage[0].newLogisticsNo : this.orderPackage[0].logisticsNo
					this.logisticsObj.logisticsCode = this.orderPackage[0].newLogisticsCode ? this.orderPackage[0].newLogisticsCode : this.orderPackage[0].logisticsCode
					this.logisticsObj.consigneeMobile = this.orderPackage[0].consigneeMobile
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
			let date = ''
			if (uni.getSystemInfoSync().platform == 'ios') {
				date = this.objOrder.paymentTime.replace(/-/g, "/")
			} else {
				date = this.objOrder.paymentTime
			}
			const timeDate = new Date(date);
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
		// 跳转im页面
		goIm() {
			uni.navigateTo({
				url: `/pages/Im/Chat?orderSn=${this.objOrder.sn}&storeId=${this.objOrder.storeId}&type=business&memberId=${this.objOrder.memberId}`
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
		// 申请开票
		handlerInvoice() {
			uni.navigateTo({
				url: '/pages/profile/invoice/apply?orderSn=' + this.orderSn
			})
		},
		// 查看商品详情
		handlerDetail: function (item) {
			uni.navigateTo({
				url: `/pages/product/goods?id=${item.skuId}&goodsId=${item.goodsId}`
			});
		},
		// 查看评价详情
		handlerCommentDetail: function () {
			uni.navigateTo({
				url: '/pages/profile/comment/detail?orderSn=' + this.orderSn
			});
		},
		// 跳转重开发票
		handlerInvoiceReopen() {
			uni.navigateTo({
				url: '/pages/profile/invoice/reopen?orderSn=' + this.orderSn
			})
		},
		// 跳转发票详情
		handlerInvoiceDetail() {
			uni.navigateTo({
				url: '/pages/profile/invoice/detail?orderSn=' + this.orderSn
			})
		},
		// 复制订单号
		copySn(number) {
			uni.setClipboardData({
				data: number,
				success: function () {
					console.log('success');
				}
			});
		},
		// 加载订单信息
		loadBaseData: function () {
			uni.showLoading({
				title: "加载中",
			});
			getOrderDetail(this.orderSn).then((res) => {
				if (res.data.success) {
					if (this.$store.state.isShowToast) { uni.hideLoading() };
					this.isComplete = true
					this.showReturnFlag = res.data.result.showReturnFlag
					const order = res.data.result;
					this.objOrder = order.order;
					this.objOrder.goods = order.orderItems;
					this.objOrder.priceDetail = JSON.parse(this.objOrder.priceDetail)
					//将手机号码隐藏
					this.objOrder.consigneeMobile = this.objOrder.consigneeMobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
					this.handleOrderStatus(this.objOrder.orderStatus)					// 订单状态
					// 这是附件字段处理
					this.attachment = []
					getAddressStatus(this.objOrder.id).then(res => {
						this.againDelivery = res.data.result
					})
					let file = this.objOrder.goods[0].attachment?.split(',')
					this.attachment.push({
						file: file,
						date: this.objOrder.goods[0].attachmentTime,
						size: this.objOrder.goods[0].attachmentSize,
						type: this.objOrder.goods[0].attachmentType
					})
					this.arrRefundData = []
					this.arrRefundData.push({
						text: '申请取消订单',
						time: this.objOrder.cancelTime,
						status: 1
					}, {
						text: '提交支付通道',
						time: this.objOrder.submitTime,
						status: 2
					}, {
						text: '退款成功',
						time: this.objOrder.returnTime,
						status: 3
					},)
					this.loadPackage()
					this.calculateIsShowLogistics()
				}
			});
		},
		// 处理订单状态
		handleOrderStatus(orderStatus) {
			switch (orderStatus) {
				case 'UNPAID':
					this.objOrder.orderStatusText = '未付款'
					this.iconOrderStatus = `${this.iconBasePath}/icon-paying.png`
					break;
				case 'PAID':
					this.objOrder.orderStatusText = '已付款'
					this.iconOrderStatus = `${this.iconBasePath}/icon-waiting.png`
					break;
				case 'UNDELIVERED':
					this.objOrder.orderStatusText = '待发货'
					this.iconOrderStatus = `${this.iconBasePath}/icon-waiting.png`
					break;
				case 'DELIVERED':
					this.objOrder.orderStatusText = '已发货'
					this.iconOrderStatus = `${this.iconBasePath}/icon-confirm.png`
					break;
				case 'COMPLETED':
					this.objOrder.orderStatusText = '已完成'
					this.iconOrderStatus = `${this.iconBasePath}/icon-complete.png`
					break;
				case 'FINISH':
					this.objOrder.orderStatusText = '已完成'
					this.iconOrderStatus = `${this.iconBasePath}/icon-complete.png`
					break;
				case 'CANCEL':
					this.objOrder.orderStatusText = '已取消'
					this.iconOrderStatus = `${this.iconBasePath}/icon-cancel.png`
					break;
				case 'CANCELLED':
					this.objOrder.orderStatusText = '已关闭'
					this.iconOrderStatus = `${this.iconBasePath}/icon-timeout.png`
					break;
				default:
					this.objOrder.orderStatusText = '未知'
					this.iconOrderStatus = `${this.iconBasePath}/icon-paying.png`
					break;
			}
		},
		// 跳转立即支付
		handlerPay: function () {
			/*
			  注意判断终端类型，
				微信小程序直接调用支付
				其他类型跳转收银台页面
			*/
			// if 终端 == 小程序
			// 调用微信立即支付
			// else
			uni.navigateTo({
				url: '/pages/cart/payment/payOrder?trade_sn=' + this.objOrder.tradeSn
			})
		},
		// 执行取消订单
		handlerCancel: function () {
			uni.showModal({
				title: "谨慎操作",
				content: "您确定要取消订单吗？",
				confirmText: "确定",
				confirmColor: "#FF0000",
				cancelText: "取消",
				success: (res) => {
					if (res.confirm) {
						cancelOrder({ orderSn: this.orderSn }).then((res) => {
							if (res.data.success) {
								this.loadBaseData()
								uni.showToast({
									title: "已取消",
									duration: 2000,
									icon: "none",
								});
							} else {
								uni.showToast({
									title: res.data.message,
									duration: 2000,
									icon: "none",
								});
							}
						});
					}
				},
			});

		},
		// 执行确认收货
		handlerConfirm: function () {
			uni.showModal({
				title: "谨慎操作",
				content: "您确定已经收到货物了吗？",
				confirmText: "确定",
				confirmColor: "#FF0000",
				cancelText: "取消",
				success: (res) => {
					if (res.confirm) {
						confirmReceipt(this.orderSn).then((res) => {
							if (res.data.code == 200) {
								uni.showToast({
									title: "已确认收货",
									duration: 2000,
									icon: "none",
								});
								this.loadBaseData()
							} else {
								uni.showToast({
									title: res.data.message,
									duration: 2000,
									icon: "none",
								});
							}
						});
					}
				},
			});
		},

		// 跳转页面链接
		handlerLink: function (e) {
			let eLink = e.currentTarget.dataset.link
			let goodsSn = e.currentTarget.dataset.goodsSn
			let skuId = e.currentTarget.dataset.skuId
			let num = e.currentTarget.dataset.num
			if (eLink == '/pages/profile/comment/insert') {
				uni.navigateTo({ url: `${eLink}?orderSn=${this.orderSn}&type=add` })
			} else if (eLink == '/pages/profile/logisticsTrack') {
				uni.navigateTo({ url: `${eLink}?logisticsCode=${this.logisticsObj.logisticsCode}&logisticsNo=${this.logisticsObj.logisticsNo}&phone=${this.logisticsObj.consigneeMobile}` })
			} else if (eLink == '/pages/tabbar/cart/cartList') {
				this.addToCartOrBuy(skuId, num)
			} else {
				uni.navigateTo({ url: `${eLink}?orderSn=${this.orderSn}&goodsSn=${goodsSn}` })
			}
		},
		// 再次购买--加入购物车
		addToCartOrBuy(skuId, num) {
			let data = {
				skuId: skuId,
				num: num
			};
			API_trade.addToCart(data).then(res => {
				if (res.data.code == 200) {
					uni.reLaunch({
						url: "/pages/tabbar/cart/cartList",
					});
				}
			});

		},
		// 跳转售后
		handlerAfterSale(afterSaleSn) {
			uni.navigateTo({ url: `/pages/profile/afterSales/detail?afterSaleSn=${afterSaleSn}` })
		},
		//更换地址
		handleAgainDelivery() {
			uni.navigateTo({ url: `/pages/config/address/home?id=${this.objOrder.id}` })
		},
		// 新增：处理催单操作
		handlerUrge: function () {
			let eId = this.orderSn// 获取订单ID
			uni.showModal({
				title: "订单催促",
				content: "确定要发送催单信息吗？",
				confirmText: "确定",
				cancelText: "取消",
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: "处理中",
							mask: true
						})
						urgeOrder(eId).then((res) => {
							uni.hideLoading()
							console.log(res, "0000000000000000")
							if (res.data.code == 200) {
								uni.showToast({
									title: res.data.result || "催单成功",
									duration: 2000,
									icon: "none",
								});
							} else {
								uni.showToast({
									title: res.data.message || "催单失败",
									duration: 2000,
									icon: "none",
								});
							}
						}).catch((err) => {
							uni.hideLoading()
							uni.showToast({
								title: "催单失败，请稍后再试",
								duration: 2000,
								icon: "none",
							});
						});
					}
				},
			});
		},
	},
	onLoad: function (options) {
		this.orderSn = options.orderSn
	},
	onShow: function () {
		// 加载订单信息
		this.loadBaseData()
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

		.list {
			.item {
				.ft-ext {
					.link-ext {
						display: flex;
						justify-content: flex-end;
						align-items: center;
					}
				}
			}
		}
	}

	// 订单价格
	.wrap-price {
		border-radius: 12rpx;
		margin: 0 20rpx;
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

	.express {
		font-size: 26rpx;
		line-height: 48rpx;
		display: flex;

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
