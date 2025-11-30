<template>
	<view class="container">
		<view class="frm-sign">
			<view class="frm-title">
				<view class="name">证件上传</view>
				<view class="step">
					<view class="cur">3</view>
					<view class="sum">/4</view>
				</view>
			</view>

			<view class="min-title">上传营业执照</view>
			<view class="min-photo">
				<view class="col-12">
					<view class="rs-file" data-type='company' @tap="handlerUpfile">
						<image class="icon-company" :src="iconLicenseCompany" mode="aspectFit"
							v-if="fileCompany.length == 0"></image>
						<image class="file-company" :src="fileCompany" mode="aspectFit" v-if="fileCompany.length > 0">
						</image>
					</view>
				</view>
			</view>
			<view class="frm-touse">
				<image :src="iconTips" mode="aspectFit" class="icon"></image>
				<view class="text">点击上传企业营业执照，图片大小限制2M以内;</view>
			</view>
			<view class="min-title">上传法人证件</view>
			<view class="min-photo">
				<view class="col-06">
					<view class="rs-file" data-type='person-ps' @tap="handlerUpfile">
						<image class="icon-person" :src="iconLicensePerson1" mode="aspectFit"
							v-if="filePersonPs.length == 0"></image>
						<image class="file-person" :src="filePersonPs" mode="aspectFit" v-if="filePersonPs.length > 0">
						</image>
					</view>
				</view>
				<view class="col-06">
					<view class="rs-file" data-type='person-dt' @tap="handlerUpfile">
						<image class="icon-person" :src="iconLicensePerson2" mode="aspectFit"
							v-if="filePersonDt.length == 0"></image>
						<image class="file-person" :src="filePersonDt" mode="aspectFit" v-if="filePersonDt.length > 0">
						</image>
					</view>
				</view>
			</view>
			<view class="frm-touse">
				<image :src="iconTips" mode="aspectFit" class="icon"></image>
				<view class="text">点击上传法人身份证正反面，图片大小限制2M以内;</view>
			</view>
		</view>
		<view class="lnk-common lnk-primary" @tap="handlerSubmit">提交审核</view>
		<!-- #ifdef APP-PLUS -->
		<yk-authpup ref="authpupCamera" type="top" @changeAuth="changeAuthCamera" permissionID="CAMERA"></yk-authpup>
		<yk-authpup ref="authpup" type="top" @changeAuth="changeAuth" permissionID="WRITE_EXTERNAL_STORAGE"></yk-authpup>
		<!-- #endif -->
	</view>
</template>

<script>
import ykAuthpup from "@/components/yk-authpup/yk-authpup";

export default {
	name: '',
	components: {
		ykAuthpup
	},
	data() {
		return {
			isComplete: false,
			iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,
			iconLicenseCompany: `${this.iconCommon}/static/v1/apply/icon-company.png`,
			iconLicensePerson1: `${this.iconCommon}/static/v1/apply/icon-person_1.png`,
			iconLicensePerson2: `${this.iconCommon}/static/v1/apply/icon-person_2.png`,
			fileCompany: '',						// 营业执照路径
			filePersonPs: '',						// 身份证正面
			filePersonDt: '',						// 身份证背面
		}
	},
	methods: {
		// 上传头像
		handlerUpfile: function (e) {
			// #ifdef APP-PLUS
			if (plus.os.name == 'Android') {
				this.$refs['authpupCamera'].open(); // 调起相机权限目的弹框
			}
			// #endif
			let _this = this
			let eType = e.currentTarget.dataset.type
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'], 		// 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], 					// 从相册选择
				success: (res) => {
					let params = { file: res.tempFilePaths[0] }
					if (eType == 'person-ps') {
						_this.filePersonPs = res.tempFilePaths[0]
					} else if (eType == 'person-dt') {
						_this.filePersonDt = res.tempFilePaths[0]
					} else {
						_this.fileCompany = res.tempFilePaths[0]
					}
					// 注意：上传文件接口执行成功后渲染网络路径
					// 调用文件上传接口
				}
			})
		},
		// 用户相机授权权限后的回调
		changeAuthCamera() {
			this.$refs['authpup'].open(); // 调起相册权限目的弹框
		},

		// 用户相册授权权限后的回调
		changeAuth() {
			// 这里是权限通过后执行自己的代码逻辑
			console.log('权限已授权，可执行自己的代码逻辑了');
		},

		handlerSubmit: function () {
			uni.navigateTo({
				url: '/pages/apply/dealer/status'
			})
		},
	},
	onLoad: function () {

	},
	onShow: function () {

	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #FFF;
	min-height: 100vh;
	box-sizing: border-box;
	padding: 20rpx;
}
</style>