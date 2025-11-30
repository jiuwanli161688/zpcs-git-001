<template>
	<view class="container">
		<view class="avatar">
			<image class="icon" :src="objData.storeLogo ? objData.storeLogo : this.avatarIcon" mode="aspectFill"
				@tap="handlerAvatar"></image>
			<view class="text">点击头像修改</view>
		</view>

		<view class="frm-comm">
			<view class="frm-title">联系方式</view>
			<view class="rs rs-line">
				<view class="lab">联系人姓名</view>
				<view class="txt flex">
					<input class="s-text" v-model="objData.linkName" type="text" placeholder="请输入" />
				</view>
			</view>
			<view class="rs">
				<view class="lab">联系人手机</view>
				<view class="txt flex">
					<input class="s-text" v-model="objData.linkPhone" type="text" placeholder="请输入" />
				</view>
			</view>
		</view>
		<view class="frm-comm des">
			<view class="frm-title">服务描述</view>
			<view class="txt flex">
				<textarea v-model="objData.serviceDesc" placeholder="请输入" class="s-textarea"></textarea>
			</view>
		</view>
		<view class="lnk-common lnk-primary lnk-mb24" @tap="submit">提交</view>

		<view class="frm-view lnk-mb24">
			<view class="frm-title">准入类目</view>
			<view class="rs" v-for="(item, index) in objData.storeCategoryApplyVOS">
				<view class="lab">类目{{ index + 1 }}</view>
				<view class="txt">{{ item.categoryName.split(',').join(' / ') }}</view>
			</view>
		</view>
		<view class="frm-view">
			<view class="frm-title">企业信息</view>
			<view class="rs">
				<view class="lab">企业名称</view>
				<view class="txt">{{ objData.storeName }}</view>
			</view>
			<view class="rs">
				<view class="lab">统一社会信用代码</view>
				<view class="txt">{{ objData.licenseNum }}</view>
			</view>
			<view class="rs">
				<view class="lab">经营地址</view>
				<view class="txt">{{ objData.companyAddress }}</view>
			</view>
			<view class="rs">
				<view class="lab">法人姓名</view>
				<view class="txt">{{ objData.legalName }} / {{ objData.legalPhone }}</view>
			</view>
		</view>

		<!--		<view class="lnk-common lnk-secondary">查看平台签约协议</view>-->

	</view>
</template>

<script>

import storage from '@/utils/storage.js'
import { editStoreBaseInfo, getStoreInfo } from "../../api/store";
import { businessLicenseOcr, idCardOcr, upload } from "../../api/common";
import { distributorSubmit } from "../../api/distributor";

export default {
	name: '',
	components: {

	},
	data() {
		return {
			isComplete: false,
			iconAvatar: `${this.iconCommon}/static/v1/demo/avatar.jpg`,
			objData: {
				storeLogo: "",
				linkName: "",
				linkPhone: "",
				storeName: "",
				licenseNum: "",
				companyAddress: "",
				legalName: "",
				legalPhone: "",
				cooperationAgreementUrl: "",
				storeCategoryApplyVOS: []
			},
			submitting: false,
			avatarIcon: `${this.iconCommon}/static/v1/profile/avatar.png`,
		}
	},
	methods: {
		submit: function () {
			if (!this.submitting) {
				this.submitting = true;
				let that = this;
				if (this.valid()) {
					uni.showLoading({ title: "正在保存" })
					editStoreBaseInfo({ linkName: this.objData.linkName, linkPhone: this.objData.linkPhone, storeLogo: this.objData.storeLogo, serviceDesc: this.objData.serviceDesc }).then(res => {
						that.submitting = false;
						uni.hideLoading();
						if (res.data.code == 200) {
							that.$u.toast("保存成功")
						} else {
							that.$u.toast(res.data.message)
						}
					})
				} else {
					this.submitting = false;
				}
			}
		},
		valid: function () {
			if (this.$u.test.isEmpty(this.objData.linkName)) {
				this.$u.toast("请输入联系人姓名")
				return false;
			}

			if (!this.$u.test.mobile(this.objData.linkPhone)) {
				this.$u.toast("联系人号码格式不正确")
				return false;
			}

			return true;
		},
		// 上传头像
		handlerAvatar: function () {
			let _this = this
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'], 		// 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], 					// 从相册选择
				success: (res) => {
					uni.showLoading();
					uni.uploadFile({
						url: upload,
						filePath: res.tempFilePaths[0],
						name: "file",
						header: {
							accessToken: storage.getAccessToken(),
						},
						success: (uploadFileRes) => {
							uni.hideLoading();
							uni.hideLoading();
							let data = JSON.parse(uploadFileRes.data);
							if (data.code == 200) {
								_this.$u.toast("上传成功,提交后保存")
								_this.objData.storeLogo = data.result;
							} else {
								_this.$u.toast(data.message)
							}
						},
					});
					// 注意：上传文件接口执行成功后渲染头像网络路径
					// _this.iconAvatar = res.data.file
					// 调用文件上传接口
				}
			})
		},
	},
	onLoad: function () {
	},
	onShow: function () {
		getStoreInfo().then(res => {
			if (res.data.code == 200) {
				this.objData = res.data.result;
			} else {
				this.$u.toast(res.data.message);
			}
		})
	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;
	padding: 20rpx;

	.txt {
		// padding: 20rpx;
		// text-align: center;

		.s-textarea {
			width: 100%;
			height: 100rpx;
			padding: 10rpx;
			border: 1rpx solid #ccc;
			border-radius: 10rpx;
			font-size: 28rpx;
		}
	}

}
</style>
