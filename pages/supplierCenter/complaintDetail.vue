<template>
	<view class="container">
		<!-- 投诉状态 -->
		<view class="wrap-state" v-if="isComplete">
			<image class="icon" :src="iconStatus" mode="aspectFit"></image>
			<view class="text">{{ objComplaint.statusText }}</view>
		</view>
		<!-- 商品信息 -->
		<view class="wrap-alone" v-if="isComplete">
			<view class="bd">
				<view class="icon" :style="{ background: 'url(' + objComplaint.goodsImage + ')' }"></view>
				<view class="base">
					<view class="txt">{{ objComplaint.goodsName }}</view>
					<view class="sku">{{ objComplaint.sku }}</view>
					<view class="inf">
						<view class="price">￥{{ objComplaint.goodsPrice | unitPrice }}</view>
						<view class="count">×{{ objComplaint.buyCount }}</view>
					</view>
				</view>
			</view>
			<view class="ft">
				<view class="lab">实付</view>
				<view class="txt">{{ objComplaint.flowPrice | unitPrice }}</view>
			</view>
		</view>

		<!-- 投诉内容 -->
		<view class="wrap-service">
			<view class="name">客户举证</view>
			<view class="info">
				<view class="rs">
					<view class="lab">订单单号</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.orderSn }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">售后单号</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.afterSaleSn }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">客户诉求</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.serviceType == 'RETURN_GOODS' ? '退货' : '换货' }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab" v-if="objComplaint.serviceType == 'RETURN_GOODS'">退货数量</view>
					<view class="lab" v-if="objComplaint.serviceType != 'RETURN_GOODS'">换货数量</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.num }}</view>
					</view>
				</view>
				<view class="rs" v-if="objComplaint.serviceType == 'RETURN_GOODS' && objComplaint.expectRefundPrice">
					<view class="lab">退款金额</view>
					<view class="inf">
						<view class="num">￥{{ objComplaint.expectRefundPrice }}</view>
					</view>
				</view>
				<view class="rs" v-if="objComplaint.serviceType == 'RETURN_GOODS' && objComplaint.expectRefundPoints">
					<view class="lab">退款积分</view>
					<view class="inf">
						<view class="num">{{ objComplaint.expectRefundPoints }} 积分</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">投诉主题</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.complaintTheme }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">问题描述</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.content }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">提交日期</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.createTime }}</view>
					</view>
				</view>
				<view class="rs" v-if="objComplaint.images">
					<view class="lab">相关截图</view>
				</view>
				<view class="ic" v-if="objComplaint.images">
					<view class="ic-item" v-for="item in objComplaint.images.split(',')">
						<image class="ico" :src="item" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 客户举证后：后续买卖双方的举证循环显示 -->
		<view class="wrap-service" v-for="item in objComplaint.orderComplaintEvidenceVOList">
			<view class="name">{{ item.type == 'BUYER' ? '客户' : '商家' }}回复</view>
			<view class="info">
				<view class="rs">
					<view class="lab">问题描述</view>
					<view class="inf">
						<view class="txt">{{ item.description }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">提交日期</view>
					<view class="inf">
						<view class="txt">{{ item.createTime }}</view>
					</view>
				</view>
				<view class="rs" v-if="item.imgs.length > 0">
					<view class="lab">相关截图</view>
				</view>
				<view class="ic" v-if="item.imgs.length > 0">
					<view class="ic-item" v-for="image in item.imgs">
						<image class="ico" :src="image" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 状态为【等待商家举证】时显示 -->
		<view class="wrap-control" v-if="objComplaint.complainStatus == 'NEW'">
			<view class="lnk-common lnk-primary" @tap="handlerLink">我要举证</view>
		</view>
		<!-- 状态为【等待平台仲裁】时显示 -->
		<view class="wrap-control" v-if="objComplaint.complainStatus == 'WAIT_ARBITRATION'">
			<view class="lnk-common lnk-primary" @tap="handlerLink">继续举证</view>
		</view>

		<!-- 平台仲裁 -->
		<view class="wrap-service" v-if="objComplaint.arbitrationResultText">
			<view class="name">平台仲裁</view>
			<view class="info">
				<view class="rs">
					<view class="lab">仲裁时间</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.arbitrationTime }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">仲裁结果</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.arbitrationResultText }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">商品处理</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.goodsText }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">退款方式</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.refundText }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">退款金额</view>
					<view class="inf">
						<view class="num">￥{{ objComplaint.applyRefundPrice }}</view>
					</view>
				</view>
				<!-- 仲裁备注说明 -->
				<view class="rs">
					<view class="lab">备注说明</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.refusalReason }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="lnk-chat" @tap="goIm">
			<image class="ico" :src="iconChat" mode="aspectFit"></image>
			<view class="txt">还有疑问？点击这里咨询客服</view>
		</view> -->
	</view>
</template>

<script>


import { storeComplainDetail } from "../../api/store";
import { createChatPool } from "../../api/im";

export default {
	name: '',
	components: {

	},
	data() {
		return {
			isComplete: false,
			iconBasePath: `${this.iconCommon}/static/v1/sales`,
			iconStatus: '',					// 投诉状态图标
			objComplaint: {
				code: '',							// 投诉单号
				status: '',						// 投诉状态
				statusText: '',				// 投诉状态
				goods: {},						// 商品信息
			},
			id: '',
			iconDemo: `${this.iconCommon}/static/v1/demo/r4.jpg`,
			iconChat: `${this.iconCommon}/static/v1/order/icon-chat.png`,
		}
	},
	methods: {
		// 跳转im页面
		goIm() {
			createChatPool().then(res => {
				if (res.data.code == 200) {
					uni.navigateTo({
						url: `/pages/Im/Chat?complaintId=${this.objComplaint.id}&storeId=${this.objComplaint.storeId}&myId=${this.objComplaint.storeId}&storeFlag=true&memberId=${this.objComplaint.memberId}`
					});
				}
			})
		},
		//加载信息
		loadBaseData: function () {
			this.isComplete = true;
			let that = this;
			uni.showLoading({})
			storeComplainDetail(this.id).then(res => {
				if (res.data.code == 200) {
					this.objComplaint = res.data.result;
					switch (this.objComplaint.complainStatus) {
						case 'NEW':
							this.objComplaint.statusText = '新提交'
							break;
						case 'CANCEL':
							this.objComplaint.statusText = '已取消'
							break;
						case 'WAIT_ARBITRATION':
							this.objComplaint.statusText = '等待仲裁'
							break;
						case 'COMPLETE':
							this.objComplaint.statusText = '已完成'
							break;
					}
					switch (this.objComplaint.complainStatus) {
						case 'NEW':
							this.iconStatus = `${this.iconBasePath}/icon-complete.png`
							break;
						case 'CANCEL':
							this.iconStatus = `${this.iconBasePath}/icon-complete.png`
							break;
						case 'WAIT_ARBITRATION':
							this.iconStatus = `${this.iconBasePath}/icon-process.png`
							break;
						case 'COMPLETE':
							this.iconStatus = `${this.iconBasePath}/icon-complete.png`
							break;
					}
					switch (this.objComplaint.arbitrationResult) {
						case 'REJECT_REFUND_RETURN':
							this.objComplaint.arbitrationResultText = '拒绝退货'
							this.objComplaint.goodsText = '无需寄回'
							this.objComplaint.refundText = '无需退回'
							break;
						case 'REJECT_EXCHANGE':
							this.objComplaint.arbitrationResultText = '拒绝退货'
							this.objComplaint.goodsText = '无需寄回'
							this.objComplaint.refundText = '无需退回'
							break;
						case 'AGREE_REFUND_RETURN_SHIP':
							this.objComplaint.arbitrationResultText = '同意退货'
							this.objComplaint.goodsText = '买家寄回'
							this.objComplaint.refundText = '原路退回'
							break;
						case 'AGREE_REFUND_NO_SHIP':
							this.objComplaint.arbitrationResultText = '同意退货'
							this.objComplaint.goodsText = '无需寄回'
							this.objComplaint.refundText = '原路退回'
							break;
						case 'AGREE_EXCHANGE_NO_SHIP':
							this.objComplaint.arbitrationResultText = '同意换货'
							this.objComplaint.goodsText = '无需寄回'
							this.objComplaint.refundText = '无需退回'
							break;
						case 'AGREE_EXCHANGE_SHIP':
							this.objComplaint.arbitrationResultText = '同意换货'
							this.objComplaint.goodsText = '买家寄回'
							this.objComplaint.refundText = '无需退回'
							break;
					}
				} else {
					that.$u.toast(res.data.message);
				}
			})
		},

		// 我要举证/继续举证页面一样
		handlerLink: function () {
			uni.navigateTo({
				url: '/pages/supplierCenter/complaintEvidence?id=' + this.objComplaint.id
			})
		},
	},
	onLoad: function (options) {
		this.id = options.id;

	},
	onShow: function () {
		// 加载投诉信息
		this.loadBaseData()
	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;
}

.lnk-chat {
	background: #E22221;
	margin: 0 24rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 12rpx;
	margin-top: 20rpx;

	.ico {
		width: 40rpx;
		height: 40rpx;
	}

	.txt {
		padding: 0 0 0 16rpx;
		color: #FFF;
		font-size: 26rpx;
	}
}
</style>
