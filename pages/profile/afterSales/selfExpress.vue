<template>
	<view class="container">
		<!-- 商品信息 -->
		<view class="wrap-alone" v-if="isCompleteSales && isCompleteExpress">
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
		</view>
		<!-- 寄件地址 -->
		<!-- <view class="wrap-receive" v-if="isCompleteSales && isCompleteExpress">
			<view class="tit-box">
				<view class="title">寄件地址</view>
				<view class="title edit-tit" @tap="editAddress">编辑</view>
			</view>
			<view class="receive">
				<view class="hd">
					<view class="tit">{{ objSales.salesSendingName }}</view>
					<view class="tel">{{ objSales.salesSendingMobile }}</view>
				</view>
				<view class="bd">{{ salesSendingAddress }}</view>
			</view>
		</view> -->
		<!-- 收件地址 -->
		<view class="wrap-receive" v-if="isCompleteSales && isCompleteExpress">
			<view class="title">寄回地址</view>
			<view class="receive">
				<view class="hd">
					<view class="tit">{{ objSales.salesConsigneeName }}</view>
					<view class="tel">{{ objSales.salesConsigneeMobile }}</view>
				</view>
				<view class="bd">{{ salesConsigneeAddress }}</view>
			</view>
		</view>

		<view class="wrap-handler" v-if="isCompleteSales && isCompleteExpress">
			<view class="frm-comm">
				<view class="rs rs-line">
					<view class="lab">快递公司</view>
					<view class="txt flex">
						<picker mode="selector" @change="bindPickerCompany" :value="curCompanyIndex" :range="arrCompany"
							range-key="label">
							<view class="in-picker"
								:class="{ 'in-picker_place': objExpress.courierCompany.length == 0 }">{{
			objExpress.courierCompany.length == 0 ? '请选择快递公司' : objExpress.courierCompany }}</view>
						</picker>
					</view>
				</view>
				<view class="rs">
					<view class="lab">快递单号</view>
					<view class="txt flex">
						<input class="s-text" type="text" v-model="objExpress.logisticsNo" placeholder="请输入快递单号" />
					</view>
				</view>
			</view>
		</view>

		<view class="wrap-control" v-if="isCompleteSales && isCompleteExpress">
			<view class="lnk-common lnk-primary" @tap="handlerSave">提交</view>
		</view>
	</view>
</template>

<script>
import { getServiceDetail, fillShipInfo } from "@/api/after-sale.js";
import { getLogistics, getAddressDetail } from "@/api/address.js";
export default {
	name: '',
	components: {

	},
	data() {
		return {
			isCompleteSales: false,
			objSales: {
				code: '',							// 售后单号
				status: '',						// 售后状态
				statusText: '',				// 售后状态
			},

			isCompleteExpress: false,
			arrCompany: [],
			curCompanyIndex: null,

			objExpress: {
				courierCompany: '',			// 快递公司
				logisticsId: "", //快递公司ID
				logisticsNo: ''			// 快递单号
			},
			sn: '',
			isCanSubmit: true,//默认可点击

		}
	},
	computed: {
		// 收件地址
		salesConsigneeAddress() {
			return this.objSales && this.objSales.salesConsigneeAddressPath ? this.objSales.salesConsigneeAddressPath.replace(/,/g, '') + this.objSales.salesConsigneeDetail : '';
		},
		// 寄件地址
		salesSendingAddress() {
			return this.objSales && this.objSales.salesSendingAddressPath ? this.objSales.salesSendingAddressPath.replace(/,/g, '') + this.objSales.salesSendingDetail : '';
		}
	},
	methods: {
		// 更换地址
		editAddress() {
			uni.navigateTo({
				url: '/pages/config/address/home?isSel=true&sn=' + this.sn
			})
		},
		// 根据地址id加载地址详情
		loadAddressDetailFun(id) {
			this.objExpress.addressId = id
			getAddressDetail(id).then((res) => {
				this.objSales.salesSendingName = res.data.result.name
				this.objSales.salesSendingMobile = res.data.result.mobile
				this.objSales.salesSendingDetail = res.data.result.detail
				this.objSales.salesSendingAddressPath = res.data.result.consigneeAddressPath
				if (this.$store.state.isShowToast) { uni.hideLoading() };
			})
		},
		// 保存
		handlerSave: function () {
			if (!this.objExpress.logisticsId) {
				this.$u.toast('请选择快递公司')
				return
			}
			if (!this.objExpress.logisticsNo) {
				this.$u.toast('请输入快递单号')
				return
			}
			if (!this.isCanSubmit) return
			this.isCanSubmit = false
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			this.objExpress.returnMethod = 'SELF_RETURN'
			fillShipInfo(this.sn, this.objExpress).then((res) => {
				if (res.data.success) {
					this.$u.toast('保存成功')
					uni.navigateBack()
				}
				this.isCanSubmit = true
			})
		},
		// 选择快递公司
		bindPickerCompany: function (e) {
			this.curCompanyIndex = e.detail.value
			this.objExpress.courierCompany = this.arrCompany[e.detail.value].label
			this.objExpress.logisticsId = this.arrCompany[e.detail.value].value
			console.log(this.objExpress)
		},

		// 加载快递公司
		loadExpressData: function () {
			getLogistics().then((res) => {
				if (res.data.success) {
					this.isCompleteExpress = true
					res.data.result.forEach((item, index) => {
						this.arrCompany[index] = {
							value: item.id,
							label: item.name,
						};
					});
				}
			});
		},
		// 加载售后信息
		loadBaseData: function () {
			getServiceDetail(this.sn).then((res) => {
				if (res.data.success) {
					if (this.$store.state.isShowToast) { uni.hideLoading() };
					this.isCompleteSales = true
					this.objSales = res.data.result;

				}
			});
		},
	},
	onLoad: function (options) {
		this.sn = options.sn
		// 加载售后信息
		this.loadBaseData()
		// 加载快递公司
		this.loadExpressData()
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

	.wrap-receive {
		.tit-box {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.edit-tit {
				margin: 20rpx 20rpx 0;
				color: red;
			}
		}

		.title {
			font-size: 28rpx;
			font-weight: 600;
			color: #333;
		}
	}

	.wrap-handler {
		margin: 20rpx 0 0;
		padding: 0;

		.frm-comm {
			margin: 0 !important;
		}
	}
}
</style>