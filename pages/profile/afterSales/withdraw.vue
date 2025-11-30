<template>
	<view class="container" v-if="isComplete">
		<view>
			<view class="frm-comm">
				<view class="rs rs-line">
					<view class="lab">取消原因</view>
					<view class="txt flex">
						<picker mode="selector" @change="cancelReason" :value="currentIndex" :range="arrCancelReason">
							<view class="in-picker" :class="{ 'in-picker_place': objReason.content.length == 0 }">{{
		objReason.content.length == 0 ? '请选择取消原因' : objReason.content }}</view>
						</picker>
					</view>
				</view>
			</view>
		</view>
		<view class="other-reason" v-if="isReason">
			<view class="uni-textarea">
				<textarea placeholder-style="color:#898989" placeholder="请输入其他原因" @blur="getReason" required />
			</view>
		</view>
		<view v-if="isComplete" class="lnk-common lnk-primary" @tap="cancelApplication">提交
		</view>
	</view>
</template>

<script>
import { getDoorPickup, submitCancel } from '@/api/after-sale.js'
export default {
	data() {
		return {
			isComplete: false,
			isReason: false,
			objDoorPickup: {},
			sn: "",
			arrCancelReason: [
				"预约信息有误",
				"快递员无法取件",
				"上门太慢",
				"联系不上快递员",
				"快递员要求取消",
				"超时未接单",
				"其他"
			],
			currentIndex: 0,
			objReason: {
				content: ""
			},
			reasonCode: 1,     //取消原因编号
			reasonMsg: ""      //取消原因描述
		}
	},
	methods: {
		loadDoorPickup: function () {
			//获取上门取件订单详情信息
			getDoorPickup(this.sn).then(res => {
				this.isComplete = true;
				if (res.data.success) {
					this.objDoorPickup = res.data.result
				}
			})
		},
		cancelReason(e) {
			let reasonContent = this.arrCancelReason[e.detail.value];
			this.objReason.content = reasonContent;
			this.reasonMsg = reasonContent;
			switch (reasonContent) {
				case "预约信息有误":
					this.reasonCode = 1;
					this.isReason = false;
					break;
				case "快递员无法取件":
					this.reasonCode = 2;
					this.isReason = false;
					break;
				case "上门太慢":
					this.reasonCode = 3;
					this.isReason = false;
					break;
				case "联系不上快递员":
					this.reasonCode = 7;
					this.isReason = false;
					break;
				case "快递员要求取消":
					this.reasonCode = 8;
					this.isReason = false;
					break;
				case "超时未接单":
					this.reasonCode = 9;
					this.isReason = false;
					break;
				case "其他":
					this.reasonCode = 11;
					this.isReason = true;
					break;
				default:
					break;
			}
		},
		cancelApplication() {
			if (this.reasonCode == 11 && this.reasonMsg.length == 0) {
				uni.showToast({
					title: "请输入其他原因",
					icon: "none"
				})
				return;
			}
			let cancelOrderObj = {
				shipperCode: this.objDoorPickup.shipperCode,
				orderCode: this.objDoorPickup.orderCode,
				logisticCode: this.objDoorPickup.logisticCode,
				cancelType: this.reasonCode,
				cancelMsg: this.reasonMsg
			};
			uni.showLoading({
				title: "加载中"
			})
			submitCancel(cancelOrderObj).then(res => {
				uni.hideLoading()
				if (res.data.success) {
					uni.showToast({
						title: "取消成功,1秒后回到首页",
						icon: "none"
					})
					setTimeout(() => {
						uni.reLaunch({ url: "/pages/tabbar/home/index" })
					}, 1000)
				}
			}).catch(() => {
				uni.hideLoading()
			})
		},
		getReason(e) {
			this.reasonMsg = e.detail.value;
		}
	},
	onLoad: function (options) {
		this.sn = options.sn;
		// 加载上门取件订单详情信息
		this.loadDoorPickup()

	},
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;
	padding: 0 0 20rpx;

	.frm-comm {
		margin: 0;

		.txt::after {
			top: 47%;
		}
	}

	.other-reason {
		background: #fff;
		padding: 20rpx;
		margin-top: 10rpx;
	}

}
</style>
