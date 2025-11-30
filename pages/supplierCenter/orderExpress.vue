<template>
	<view class="container">
		<!-- 订单状态 -->
		<view class="wrap-state" v-if="isCompleteExpress && isCompleteGoods">
			<image class="icon" :src="iconStatus" mode="aspectFit"></image>
			<view class="text">录入快递单号</view>
		</view>
		<!-- 收件信息 -->
		<view class="wrap-receive">
			<view class="title">收件信息</view>
			<view class="receive">
				<view class="hd">
					<view class="tit">{{ objOrder.order.consigneeName }}</view>
					<view class="tel">{{ objOrder.order.consigneeMobile }}</view>
				</view>
				<view class="bd">{{
			objOrder.order.consigneeAddressPath.split(",").join("") + objOrder.order.consigneeDetail }}</view>
			</view>
		</view>

		<!-- 商品信息 -->
		<view class="wrap-goods" v-if="isCompleteExpress && isCompleteGoods">
			<view class="list">
				<view class="item" v-for="(item, index) in objOrder.orderItems" :key="index">
					<view class="bd">
						<view class="icon" :style="{ background: 'url(' + item.image + ')' }"></view>
						<view class="base">
							<view class="txt">{{ item.goodsName }}</view>
							<!--							<view class="sku">
								<text class="sku-item" v-for="(sku, s) in item.sku" :key="s">{{sku.goodsName}}</text>
							</view>-->
							<view class="inf">
								<view class="price">￥{{ item.goodsPrice | unitPrice }}</view>
								<view class="count">×{{ item.num }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="wrap-handler" v-if="isCompleteExpress && isCompleteGoods">
			<view class="frm-comm">
				<view class="rs rs-line">
					<view class="lab">快递公司</view>
					<view class="txt flex">
						<picker mode="selector" @change="bindPickerCompany" :value="curCompanyIndex" :range="arrCompany"
							range-key="label">
							<view class="in-picker" :class="{ 'in-picker_place': objExpress.logisticsId.length == 0 }">{{
			objExpress.logisticsId.length == 0 ? '请选择快递公司' : curCompanyLabel }}</view>
						</picker>
					</view>
				</view>
				<view class="rs">
					<view class="lab">快递单号</view>
					<view class="txt flex">
						<input class="s-text" type="text" v-model="objExpress.logisticsNo" placeholder="请输入快递单号" />
					</view>
				</view>
				<view class="rs">
					<view class="lab">手机尾号</view>
					<view class="txt flex">
						<input  maxlength="4" class="s-text" type="text" v-model="objExpress.contactPhone" placeholder="请输入收件人/寄件人手机尾号或隐私号" />
					</view>
				</view>
			</view>
		</view>

		<view class="wrap-control" v-if="isCompleteExpress && isCompleteGoods && !finish">
			<view class="lnk-common lnk-primary" @tap="submit">提交</view>
		</view>

		<view class="wrap-control" v-if="finish">
			<view class="lnk-common lnk-primary">已发货</view>
		</view>


	</view>
</template>

<script>

import { storeDelivery, storeLogistics, storeOrderDetail,getLastDeliveryPhone } from "../../api/store";

export default {
	name: '',
	components: {

	},
	data() {
		return {
			sn: "",
			iconStatus: `${this.iconCommon}/static/v1/order/icon-waiting.png`,
			isCompleteExpress: false,			// 快递公司完成加载
			arrCompany: [],
			curCompanyIndex: null,
			curCompanyLabel: null,

			objExpress: {
				orderSn: '',
				logisticsId: '',			// 快递公司
				logisticsNo: '',			// 快递单号
				contactPhone: ''			// 寄件人手机尾号
			},
			isCompleteGoods: false,			// 订单商品完成加载
			objOrder: {
				order: {},							// 订单编号
			},						// 订单信息
			submitting: false,
			finish: false
		}
	},
	methods: {
		submit: function () {
			if (!this.submitting) {
				if (!this.objExpress.logisticsNo || !this.objExpress.logisticsId) {
					this.$u.toast("请选择快递公司并填写快递单号");
					return;
				}
				if (!this.objExpress.contactPhone) {
					this.$u.toast("请输入收件人/寄件人手机尾号或隐私号");
					return;
				}
				// 验证手机尾号必须是四位数字
				if (!/^\d{4}$/.test(this.objExpress.contactPhone)) {
					this.$u.toast("手机尾号必须是四位数字");
					return;
				}
				let params={
					...this.objExpress,
					partDeliveryDTOList: this.objOrder.orderItems.map((item) => {
						return {
							orderItemId: item.id,
							deliveryNum: item.num,
						};
					}),
				}
				this.submitting = true;
				uni.showLoading();
				storeDelivery(params).then(res => {
					this.submitting = false;
					uni.hideLoading();
					if (res.data.code == 200) {
						this.$u.toast("发货成功");
						this.finish = true;
					} else {
						this.$u.toast(res.data.message);
					}
				})
			}
		},
		// 选择快递公司
		bindPickerCompany: function (e) {
			this.curCompanyIndex = e.detail.value
			this.curCompanyLabel = this.arrCompany[e.detail.value].label
			this.objExpress.logisticsId = this.arrCompany[e.detail.value].value
		},

		// 加载快递公司
		loadExpressData: function () {
			this.isCompleteExpress = true
			storeLogistics().then(res => {
				if (res.data.code == 200) {
					res.data.result.forEach(item => {
						this.arrCompany.push({ label: item.name, value: item.logisticsId })
					})
				} else {
					this.$u.toast(res.data.message);
				}
			})

		},

		// 加载订单信息
		loadBaseData: function () {
			this.isCompleteGoods = true
			let that = this;
			storeOrderDetail(this.sn).then(res => {
				uni.hideLoading();
				if (res.data.code == 200) {
					this.objExpress.contactPhone = res.data.result.order.consigneeMobile.slice(-4)
					that.objOrder = res.data.result;
					switch (that.objOrder.status) {
						case 'UNPAID':		// 待付款
							that.iconOrderStatus = `${that.iconBasePath}/icon-paying.png`
							break;
						case 'UNDELIVERED':		// 待发货
							that.iconOrderStatus = `${that.iconBasePath}/icon-waiting.png`
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
							break;
						case 'CANCELLED':		// 已关闭
							that.iconOrderStatus = `${that.iconBasePath}/icon-timeout.png`
							break;
					}
				} else {
					that.$u.toast(res.data.message)
				}
			})
		},
		// 加载上次填写的寄件人手机号
		loadLastContactPhone: function () {
			getLastDeliveryPhone().then(res => {
				if (res.data.code == 200) {
					this.objExpress.contactPhone = res.data.result?res.data.result:''
				}
			})
		}
	},
	onLoad: function (options) {
		this.sn = options.sn;
		this.objExpress.orderSn = options.sn;
		// 加载快递公司
		this.loadExpressData()
		// 加载订单信息
		this.loadBaseData()
		// // 加载上次填写的寄件人手机号
		// this.loadLastContactPhone()
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
	padding: 0 0 20rpx;
	.lab{
		width: 200rpx;
	}
	.wrap-state {
		height: 180rpx;
		padding: 0 0 20rpx;
	}

	.wrap-receive {
		margin: -20rpx 0 0;
		border-radius: 12rpx;
		position: relative;
		z-index: 1;
	}

	.wrap-handler {
		margin: 20rpx 0 0;
		padding: 0;

		.frm-comm {
			margin: 0 !important;
		}
	}

	.wrap-goods {
		margin: 20rpx 0 0;

		.list {
			.item {
				.bd {
					.base {
						width: calc(100vw - 40rpx - 160rpx - 20rpx);
					}
				}
			}
		}
	}
}
</style>
