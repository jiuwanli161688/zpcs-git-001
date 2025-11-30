<template>
	<view class="container">
		<!-- 上门取件进度状态 -->
		<view class="wrap-state" v-if="isComplete">
			<image class="icon" :src="iconSalesStatus" mode="aspectFit"></image>
			<view class="text">{{ statusText }}</view>
		</view>
		<!-- 寄回地址 -->
		<view class="wrap-receive sendAddress" v-if="isComplete">
			<view class="tit-box">
				<view class="title">寄回地址</view>
			</view>
			<view class="receive">
				<view class="hd">
					<view class="tit">{{ sendBackName }}</view>
					<view class="tel">{{ sendBackTel }}</view>
				</view>
				<view class="bd">{{ sendBackAddress }}</view>
			</view>
		</view>
		<!-- 取件地址 -->
		<view class="wrap-receive" v-if="isComplete">
			<view class="tit-box">
				<view class="title">取件地址</view>
			</view>
			<view class="receive">
				<view class="hd">
					<view class="tit">{{ pickupName }}</view>
					<view class="tel">{{ pickupTel }}</view>
				</view>
				<view class="bd">{{ pickupAddress }}</view>
			</view>
		</view>
		<view class="wrap-receive" v-if="isComplete">
			<view class="content">服务提交时间：{{ objDoorPickup.createTime }}</view>
			<view class="content kdn">快递服务订单：{{ objDoorPickup.kdnOrderCode }}
				<button @tap="copyKdnOrderCode" class="copy-btn">复制</button>
			</view>
			<view class="content">预约开始时间：<span
					:style="{ color: timeRed || objDoorPickup.updateStartTime ? '#FF0000' : '' }">{{
						objDoorPickup.updateStartTime ? objDoorPickup.updateStartTime : objDoorPickup.startTime }}</span></view>
			<view class="content">预约结束时间：<span
					:style="{ color: timeRed || objDoorPickup.updateEndTime ? '#FF0000' : '' }">{{
						objDoorPickup.updateEndTime ? objDoorPickup.updateEndTime : objDoorPickup.endTime }}</span></view>
			<view class="content" v-if="objDoorPickup.logisticCode">
				快递承运公司：{{ shipperCode }}</view>
			<view class="content kdn" v-if="objDoorPickup.logisticCode">
				退件快递单号：{{ objDoorPickup.logisticCode }}
				<button @tap="copyBackCode" class="copy-btn">复制</button>
			</view>
			<view class="content" v-if="objDoorPickupLog.state == '301'">
				退件快递费用：<span class="price">{{ objDoorPickup.totalFee }}</span>(平台支付)</view>
		</view>
		<!-- v-if="isComplete && objDoorPickup.pickupCode" -->
		<view class="wrap-receive pickup-code"
			v-if="isComplete && objDoorPickup.state == '103' || objDoorPickup.state == '104'">
			<view>取件码</view>
			<view class="code">{{ objDoorPickup.pickupCode }}</view>
			<!-- <view class="pickupTime" :style="{ color: timeRed }">取件时间：{{ objDoorPickup.createTime }}</view> -->
			<view v-if="objDoorPickup.personName">快递员：{{ objDoorPickup.personName }}</view>
			<view v-if="objDoorPickup.personTel">快递员电话：{{ objDoorPickup.personTel }}</view>
		</view>
		<view class="wrap-process" v-if="isComplete">
			<view class="list">
				<view class="item" v-for="(item, index) in objDoorPickupLog" :key="index">
					<view class="hd">
						<image class="icon" :src="iconStep" mode="aspectFit"></image>
						<view class="text">{{ item.createTime }}</view>
						<view class="express" v-if="item.operateType">{{ item.operateType == "1" ? "快递平台" : "快递公司" }}
						</view>
					</view>
					<view class="bd">{{ item.reason }}</view>
				</view>
			</view>
		</view>
		<!-- <view v-if="isComplete && showPickup" class="lnk-common lnk-primary"
			data-link="/pages/profile/afterSales/selfExpress" @tap="handlerLink">自行邮寄
		</view> -->
		<!-- 取消申请 -->
		<view
			v-if="isComplete && objDoorPickup.state == '100' || objDoorPickup.state == '102' || objDoorPickup.state == '103'"
			class="lnk-common lnk-primary" :class="{ 'disabled': objDoorPickup.orderUpdateStatus == '1' }"
			data-link="/pages/profile/afterSales/updateDoorTime" @tap="handlerLink">
			修改预约时间
		</view>
		<view
			v-if="isComplete && objDoorPickup.state != '301' && objDoorPickup.state != '104' && objDoorPickup.state != '3' && objDoorPickup.state != '2'"
			class="lnk-common lnk-primary btn-transparent" data-link="/pages/profile/afterSales/withdraw"
			@tap="handlerLink">取消申请
		</view>
		<view v-if="isComplete && showPickup" class="lnk-common lnk-primary"
			data-link="/pages/profile/afterSales/doorExpress" @tap="handlerLink">订单异常？重新上门取件
		</view>
		<view v-if="isComplete && objDoorPickup.state == '301' && !objDoorPickup.complaintNumber"
			class="lnk-common lnk-primary" data-link="/pages/profile/afterSales/expressAbnormal" @tap="handlerLink">
			快递异常？申请快递平台处理
		</view>
		<view v-if="isComplete && objDoorPickup.state == '301' && objDoorPickup.complaintNumber"
			class="lnk-common lnk-primary btn-transparent" data-link="/pages/profile/afterSales/processResult"
			@tap="handlerLink">查看处理结果
		</view>
	</view>
</template>

<script>
import { getDoorPickup, getDoorPickupLog, getServiceDetail } from '@/api/after-sale.js'
export default {
	data() {
		return {
			isComplete: false,
			showPickup: false,
			iconBasePath: `${this.iconCommon}/static/v1/sales`,
			iconStep: `${this.iconCommon}/static/v1/sales/icon-step.png`,
			sn: '',       //售后单号
			objDoorPickup: {           //上门取件订单详情信息

			},
			objDoorPickupLog: [],          //上门取件日志
			sendBackName: "",
			sendBackTel: "",
			sendBackAddress: "",
			pickupName: "",
			pickupTel: "",
			pickupAddress: "",
			timeRed: "",
		}
	},
	methods: {
		loadDoorPickup: function () {


			//获取上门取件日志
			getDoorPickupLog(this.sn).then(res => {
				if (res.data.success) {
					this.objDoorPickupLog = res.data.result
					this.objDoorPickupLog = this.objDoorPickupLog.filter(item => item.state != '102')

					//获取上门取件订单详情信息
					getDoorPickup(this.sn).then(res => {
						this.isComplete = true;
						if (res.data.success) {
							this.objDoorPickup = res.data.result
						}
						//是否显示重新下单
						if (this.objDoorPickup.state == "203" || this.objDoorPickup.state == "99" || this.objDoorPickup.state == "206") {
							this.showPickup = true;
						}
					})

				}

				//修改预约时间变色
				this.objDoorPickupLog.forEach(item => {
					if (item.state == '110') {
						this.timeRed = "#FF0000"
					}
				})
			})
			//获取售后信息
			getServiceDetail(this.sn).then(res => {
				if (res.data.success) {
					let objSales = res.data.result;
					this.sendBackName = objSales.salesConsigneeName;
					this.sendBackTel = objSales.salesConsigneeMobile;
					this.sendBackAddress = objSales.salesConsigneeAddressPath.split(",").join("") + objSales.salesConsigneeDetail;
					this.pickupName = objSales.salesSendingName;
					this.pickupTel = objSales.salesSendingMobile;
					this.pickupAddress = objSales.salesSendingAddressPath.split(",").join("") + objSales.salesSendingDetail;
				}
			})
		},
		copyKdnOrderCode() {
			uni.setClipboardData({
				data: this.objDoorPickup.kdnOrderCode,
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
		copyBackCode() {
			uni.setClipboardData({
				data: this.objDoorPickup.logisticCode,
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
		handlerLink(e) {
			let eLink = e.currentTarget.dataset.link;
			if (eLink == "/pages/profile/afterSales/processResult") {
				uni.navigateTo({
					url: `${eLink}?complaintNumber=${this.objDoorPickup.complaintNumber}`
				})
				return;
			}
			uni.navigateTo({ url: `${eLink}?sn=${this.sn}` })
		},
	},
	computed: {
		//上门取件服务状态
		statusText() {
			const statusText = {
				'100': '下单成功',
				'102': '分配网点',
				'103': '分配快递员',
				'104': '已取件',
				'301': '已揽件',
				'99': '调度失败',
				'203': '已取消',
				'2': "在途中",
				'3': "签收成功",
				'206': "订单异常"
			};
			return statusText[this.objDoorPickup.state] || '';
		},
		iconSalesStatus() {
			const iconSalesStatus = {
				'100': `${this.iconBasePath}/icon-complete.png`, // 下单成功
				'102': `${this.iconBasePath}/icon-process.png`, // 分配网点
				'103': `${this.iconBasePath}/icon-complete.png`, // 分配快递员
				'104': `${this.iconBasePath}/icon-complete.png`, // 已取件
				'301': `${this.iconBasePath}/icon-complete.png`,  // 已揽件
				'2': `${this.iconBasePath}/icon-process.png`,  // 在途中
				'3': `${this.iconBasePath}/icon-complete.png`,  // 签收成功
				"99": `${this.iconCommon}/static/v1/goods/icon-takecare.png`,  //推送调度失败
				"203": `${this.iconCommon}/static/v1/goods/icon-takecare.png`, //推送取消状态
				"206": `${this.iconCommon}/static/v1/goods/icon-takecare.png`,  //推送调度失败
			};
			return iconSalesStatus[this.objDoorPickup.state] || '';
		},
		//快递公司编码
		shipperCode() {
			const shipperCode = {
				'SF': '顺丰速运',
				'YTO': '圆通速递',
				'ZTO': '中通快递',
				'STO': '申通快递',
				'YD': '韵达速递',
				'JD': '京东物流',
				'EMS': '邮政速递',
				'JTSD': '极兔速递',
				"DBL": "德邦快递",
				"DNWL": "丹鸟",
				"CNSD": "菜鸟速递",
				"CAINIAO": "菜鸟裹裹"
			}
			return shipperCode[this.objDoorPickup.shipperCode] || '';
		}
	},
	onLoad: function (options) {
		this.sn = options.sn;
		// 加载上门取件订单详情信息
		this.loadDoorPickup()
	},
	onShow() {
		this.loadDoorPickup()
	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;

	.wrap-state {
		display: flex;
		flex-direction: column;

		.icon {
			width: 100%;
		}

		.text {
			width: 100%;
			text-align: center;
			margin: 30rpx 0;
			padding: 0;
		}

	}


	.wrap-receive {
		overflow: hidden;

		.content {
			margin: 18rpx 0;
			color: #989898;
			font-size: 28rpx;

			.price {
				color: #f00;
			}
		}

		.kdn {
			display: flex;

			.copy-btn {
				height: 40rpx;
				font-size: 28rpx;
				line-height: 40rpx;
				border: 1px solid #f00;
				background-color: transparent;
				color: #f00;
			}
		}

		.title {
			font-weight: bold;
			color: black;
			font-size: 30rpx;
		}

		.bd {
			color: #989898;
		}
	}

	.sendAddress {
		border-radius: 40rpx 40rpx 0 0;
		margin: 0;
	}

	.lnk-primary {
		margin-left: 10rpx;
		margin-right: 10rpx;
	}

	.btn-transparent {
		background-color: transparent;
		color: #f00;
		font-weight: bold;
	}

	.pickup-code {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 260rpx;
		color: #333;

		.code {
			font-size: 50rpx;
			font-weight: bold;
		}

		.pickupTime {
			color: #989898;
		}
	}

	.wrap-process {

		.list {

			.item {

				.hd {

					.express {
						text-align: right;
						flex: 1;
						font-weight: bold;
						color: #989898;
					}

					.text {
						color: #989898;
					}
				}

				.bd {
					font-weight: bold;
					color: #333;
				}
			}
		}

	}

	.disabled {
		opacity: 0.5;
		pointer-events: none;
	}

}
</style>
