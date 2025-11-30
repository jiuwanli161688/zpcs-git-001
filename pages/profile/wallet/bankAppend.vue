<template>
	<view class="container">
		<view class="box-card">
			<view class="link" v-if="fileBankCard.length == 0" @tap="handlerAvatar">
				<image class="icon" :src="iconUpfile" mode="aspectFit"></image>
				<view class="text">点击上传银行卡</view>
			</view>
			<image class="file" :src="fileBankCard" mode="scaleToFill" v-if="fileBankCard.length > 0"></image>
		</view>
		<view class="frm-comm">
			<view class="rs rs-line">
				<view class="lab">银行名称</view>
				<view class="txt flex">
					<input class="s-text" v-model="form.bankName" type="text" placeholder="自动识别" />
				</view>
			</view>
			<view class="rs rs-line">
				<view class="lab">开户行名称</view>
				<view class="txt flex">
					<input class="s-text" v-model="form.bankAccountName" type="text" placeholder="请输入开户行名称" />
				</view>
			</view>
			<view class="rs rs-line">
				<view class="lab">银行卡号</view>
				<view class="txt flex">
					<input class="s-text" v-model="form.bankCardNumber" type="text" placeholder="自动识别" />
				</view>
			</view>
			<view class="rs rs-line">
				<view class="lab">持卡人</view>
				<view class="txt flex">
					<input class="s-text" v-model="form.holderName" type="text" placeholder="请输入持卡人姓名" />
				</view>
			</view>
			<!-- <view class="rs rs-line">
				<view class="lab">身份证号</view>
				<view class="txt flex">
					<input class="s-text" v-model="form.idCard" type="text" placeholder="请输入持卡人身份证号" />
				</view>
			</view> -->
			<view class="rs rs-line">
				<view class="lab">预留手机号</view>
				<view class="txt flex">
					<input class="s-text" v-model="form.phone" type="text" placeholder="请输入银行预留手机号" />
				</view>
			</view>
		</view>
		<view class="lnk-common lnk-primary" @tap="handlerSubmit">保存</view>
	</view>
</template>

<script>
import storage from "@/utils/storage.js";
import { upload, ocrBank } from "@/api/common.js";
import { addMemberBank } from "@/api/members"


export default {
	name: '',
	components: {

	},
	data() {
		return {
			isComplete: false,
			iconUpfile: `${this.iconCommon}/static/v1/wallet/icon-upfile.png`,
			fileBankCard: '',
			form: {
				bankName: '',//银行名称
				bankCardNumber: '', // 银行卡号
				holderName: '', // 持卡人姓名
				validDate: '',// 过期时间
				bankCardType: '借记卡',// 银行卡类型
				bankAccountName: '', // 银行开户行

			}
		}
	},
	methods: {
		// 上传银行卡
		handlerAvatar: function () {
			let _this = this
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'], 		// 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], 					// 从相册选择
				success: (res) => {
					let tempFilePaths = res.tempFilePaths;
					uni.uploadFile({
						url: upload,
						filePath: tempFilePaths[0],
						name: "file",
						header: {
							accessToken: storage.getAccessToken(),
						},
						success: (uploadFileRes) => {
							let data = JSON.parse(uploadFileRes.data);
							_this.fileBankCard = data.result;
							// 识别银行卡
							ocrBank({ cardAddress: data.result }).then((re) => {
								if (re.data.success) {
									_this.$u.toast('识别成功')
									_this.form = re.data.result
								} else {
									_this.$u.toast('识别失败')
								}
							})
						},
					});

				}
			})
		},
		// 新增银行卡
		handlerSubmit() {
			if (!this.form.bankName) {
				this.$u.toast('请输入银行名称')
				return
			}
			if (!this.form.bankAccountName) {
				this.$u.toast('请输入银行支行名称')
				return
			}
			if (!this.form.bankCardNumber) {
				this.$u.toast('请输入银行卡号')
				return
			}
			if (!this.form.holderName) {
				this.$u.toast('请输入持卡人姓名')
				return
			}
			// if (!this.$u.test.idCard(this.form.idCard)) {
			//   this.$u.toast('请输入正确的持卡人身份证号码')
			//   return
			// }
			if (!this.$u.test.mobile(this.form.phone)) {
				this.$u.toast('请输入正确的银行预留手机号')
				return
			}
			uni.showLoading({ title: "正在保存" })
			let params = {
				cardNumber: this.form.bankCardNumber,
				cardholder: this.form.holderName,
				cardType: this.form.bankCardType,
				expirationTime: this.form.validDate,
				bankName: this.form.bankName,
				bankAccountName: this.form.bankAccountName,
				// idCard:this.form.idCard,
				phone: this.form.phone,
			}
			addMemberBank(params).then((res) => {
				uni.hideLoading();
				if (res.data.success) {
					this.$u.toast('新增银行卡成功')
					uni.navigateBack();
				}
			})
		},

	},
	onLoad: function () {
		this.form.holderName = storage.getUserInfo().realName
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
	padding: 20rpx;

}
</style>
