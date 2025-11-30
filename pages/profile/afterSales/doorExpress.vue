<template>
	<view class="container">
		<!-- 商品信息 -->
		<view class="wrap-alone" v-if="isCompleteSales">
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
		</view>
		<!-- 寄件地址 -->
		<view class="wrap-receive" v-if="isCompleteSales">
			<view class="tit-box">
				<view class="title">寄件地址</view>
				<view class="title edit-tit" @tap="editAddress">编辑</view>
			</view>
			<view class="receive">
				<view class="hd">
					<view class="tit">{{ objSales.salesSendingName }}</view>
					<view class="tel">{{ objSales.salesSendingMobile }}</view>
				</view>
				<view class="bd">{{ sendAddress }}</view>
			</view>
		</view>
		<!-- 收件地址 -->
		<view class="wrap-receive" v-if="isCompleteSales">
			<view class="title">收件地址</view>
			<view class="receive">
				<view class="hd">
					<view class="tit">{{ objSales.salesConsigneeName }}</view>
					<view class="tel">{{ objSales.salesConsigneeMobile }}</view>
				</view>
				<view class="bd">{{ receivAddress }}</view>
			</view>
		</view>

		<view class="wrap-handler" v-if="isCompleteSales">
			<view class="frm-comm">
				<!-- 收件省份即是退件地址省份 -->
				<view class="rs rs-line">
					<view class="lab">收件省份</view>
					<view class="txt txt-r">{{ objSales.salesConsigneeAddressPath }}</view>
				</view>
				<!-- 重量由接口返回 -->
				<view class="rs rs-line">
					<view class="lab">包裹重量</view>
					<view class="txt txt-r weight"><input class="s-text" type="number" @input="onInput"
							v-model="packageWeight" placeholder="请输入商品重量" />KG</view>
				</view>
				<view class="rs">
					<view class="lab">上门时间</view>
					<view class="txt flex">
						<picker mode="selector" @change="bindPickerTime" :value="objExpress.curTime" :range="arrTimeRange"
							range-key="time">
							<view class="in-picker picker-color"
								:class="{ 'in-picker_place': objExpress.curTime.length < 0 }">{{
									objExpress.curTime.length == 0 ? '请选择上门取件时间' : arrTimeRange[objExpress.curTime].time }}
							</view>
						</picker>
					</view>
				</view>
			</view>
		</view>

		<view class="wrap-control" v-if="isCompleteSales">
			<view class="lnk-common lnk-primary" @tap="handlerSave">提交</view>
		</view>
	</view>
</template>

<script>
import { getServiceDetail, doorReceiveSubmit, checkDoorServiceOpen } from "@/api/after-sale.js";
import { getAddressDetail } from "@/api/address.js";
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

			arrCompany: [],
			curCompanyIndex: null,

			objExpress: {
				curTime: '',
				addressId: ''
			},
			sn: '',
			isCanSubmit: true,					//默认可点击
			arrTimeRange: [],						//上门时间
			packageWeight: 1, 						//商品重量只能是数字,
			receivAddress: "",       //收件地址
			sendAddress: "",          //寄件地址
			params: {},              //上门取件服务校验参数
			doorSubmit: {}             //上门取件提交参数
		}
	},
	computed: {

	},
	methods: {
		// 选择取件时间
		bindPickerTime: function (e) {
			this.objExpress.curTime = Number(e.detail.value)
		},
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
				let objSendAddress = res.data.result
				this.objSales.salesSendingName = res.data.result.name
				this.objSales.salesSendingMobile = res.data.result.mobile
				this.objSales.salesSendingDetail = res.data.result.detail
				this.objSales.salesSendingAddressPath = res.data.result.consigneeAddressPath
				this.sendAddress = objSendAddress.consigneeAddressPath.split(",").join("") + objSendAddress.detail
				if (this.$store.state.isShowToast) { uni.hideLoading() };
			})
		},
		// 保存
		handlerSave: function () {
			if (!this.objExpress.curTime && this.objExpress.curTime !== 0) {
				this.$u.toast('请选择预约时间')
				return
			}
			if (!this.isCanSubmit) return
			this.isCanSubmit = false
			uni.showLoading({
				title: "加载中",
				mask: true,
			});
			this.objExpress.returnMethod = 'PICKUP';
			let ConsignAddress = this.objSales.salesConsigneeAddressPath.split(",");
			let sendingAddress = this.objSales.salesSendingAddressPath.split(",");
			let startEndDate = this.arrTimeRange[this.objExpress.curTime].time.split(" ")[0];
			let userStartTime = this.arrTimeRange[this.objExpress.curTime].time.split(" ")[1] + ":00";
			let userEndTime = this.arrTimeRange[this.objExpress.curTime].time.split(" ")[3] + ":00";
			this.doorSubmit = {
				shipperType: 3,
				receiverName: this.objSales.salesConsigneeName,
				receiverMobile: this.objSales.salesConsigneeMobile,
				receiverProvinceName: ConsignAddress[0],
				receiverCityName: ConsignAddress[1],
				receiverExpAreaName: ConsignAddress[2],
				receiverAddress: this.objSales.salesConsigneeDetail,
				receiverAddressId: this.objSales.salesConsigneeAddressId,
				senderName: this.objSales.salesSendingName,
				senderMobile: this.objSales.salesSendingMobile,
				senderProvinceName: sendingAddress[0],
				senderCityName: sendingAddress[1],
				senderExpAreaName: sendingAddress[2],
				senderAddress: this.objSales.salesSendingDetail,
				startDate: startEndDate + " " + userStartTime,
				endDate: startEndDate + " " + userEndTime,
				commodity: [
					{
						goodsName: this.objSales.goodsName,
						goodsQuantity: this.objSales.num,
						goodsPrice: this.objSales.goodsPrice,
					}
				]

			}
			if (!this.doorSubmit.senderAddressId) {
				this.doorSubmit.senderAddressId = this.objSales.salesConsigneeAddressId
			}

			doorReceiveSubmit(this.sn, this.doorSubmit).then((res) => {
				if (res.data.success) {
					this.$u.toast('保存成功')
					uni.redirectTo({
						url: '/pages/profile/afterSales/doorSchedule?sn=' + this.sn
					})
				}
				this.isCanSubmit = true
			})
		},

		//商品重量小于0，重定向到1
		onInput(e) {
			if (e.target.value < 0) {
				this.inputValue = 1
			}
		},

		// 加载售后信息
		loadBaseData: async function () {
			await getServiceDetail(this.sn).then((res) => {
				if (res.data.success) {
					if (this.$store.state.isShowToast) { uni.hideLoading() };
					this.isCompleteSales = true
					this.objSales = res.data.result;
					this.receiverAddress = this.objSales.salesConsigneeAddressPath.split(",");
					this.senderAddress = this.objSales.salesSendingAddressPath.split(",");
					this.params = {
						shipperType: 3,

						receiver: {
							provinceName: this.receiverAddress[0],
							cityName: this.receiverAddress[1],
							expAreaName: this.receiverAddress[2],
							address: this.receiverAddress[3],
						},
						sender: {
							provinceName: this.senderAddress[0],
							cityName: this.senderAddress[1],
							expAreaName: this.senderAddress[2],
							address: this.senderAddress[3],
						},
						weight: this.packageWeight
					}
					// 收件地址
					this.receivAddress = this.objSales.salesConsigneeAddressPath.split(",").join("") + this.objSales.salesConsigneeDetail

					// 寄件地址
					this.sendAddress = this.objSales.salesSendingAddressPath.split(",").join("") + this.objSales.salesSendingDetail
				}
			});
			//加载时间信息
			await checkDoorServiceOpen(this.params).then(res => {
				if (res.data.success) {
					//返回总时间数组
					let doorTime = res.data.result.times;
					//获得想要显示的时间数据
					let doorTimeArr = doorTime.map((item) => {
						let startTimeArr = item.startTime.split(" ")
						let startStr = startTimeArr[1].split(":").slice(0, 2).join(":")
						let endStr = item.endTime.split(" ")[1].split(":").slice(0, 2).join(":")
						startTimeArr.push(item.endTime.split(" ")[1])
						let startAndEnd = startStr + " - " + endStr
						startTimeArr.pop();
						startTimeArr.pop();
						startTimeArr.push(startAndEnd);
						return startTimeArr
					})

					for (let i = 0; i < doorTimeArr.length; i++) {
						let objDoorTime = {
							time: doorTimeArr[i].join(" "),
							value: i
						}
						this.arrTimeRange.push(objDoorTime)
					}
				} else {
					this.$store.commit('modifyDoor', this.sn);
					uni.redirectTo({
						url: '/pages/profile/afterSales/doorError?sn=' + this.sn
					})
				}
			})
		},
		loadAddressIdPath: function (e) {
			//接收改变地址后传递过来的地址id路径
			this.doorSubmit.senderAddressId = e
		}


	},
	onLoad: function (options) {
		this.sn = options.sn
		// 加载售后信息
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

			.picker-color {}
		}
	}

	.weight {
		display: flex;
		justify-content: flex-end;

		.s-text {
			height: 100%;
			margin-right: 10rpx;
		}
	}
}
</style>