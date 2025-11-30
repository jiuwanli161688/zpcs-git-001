<template>
	<view class="container">
		<view class="frm-sign">
			<view class="frm-title">
				<view class="name">企业签章</view>
				<view class="step">
					<view class="cur">3</view>
					<view class="sum">/4</view>
				</view>
			</view>
			<view class="min-photo">
				<view class="col-signature">
					<view class="rs-file" @tap="handlerUpfile">
						<image class="icon-signature" :src="iconSignature" mode="aspectFit"
							v-if="fileSignature.length == 0"></image>
						<image class="file-signature" :src="fileSignature" mode="aspectFit" v-if="fileSignature.length > 0">
						</image>
					</view>
				</view>
			</view>
			<view class="frm-touse">
				<image :src="iconTips" mode="aspectFit" class="icon"></image>
				<view class="text">点击上传企业电子签章，图片大小限制2M以内;</view>
			</view>
		</view>

		<view class="frm-sign">
			<view class="frm-title">
				<view class="name">法人签字</view>
			</view>
			<view class="box-signs" @tap="handlerSign">
				<image class="icon" :src="fileSigning" mode="aspectFill" v-if="fileSigning.length > 0"></image>
				<view class="text" v-if="fileSigning.length == 0">点击此处录入手写签名</view>
			</view>
		</view>
		<view class="lnk-common lnk-preview" @tap="previewAgreementEve">协议预览</view>
		<view class="lnk-common lnk-primary" @tap="handlerSubmit">提交签约</view>
		<view class="lnk-common lnk-primary" v-if="previous" @tap="handlerPrevious">上一步</view>
		<!-- #ifdef APP-PLUS -->
		<yk-authpup ref="authpupCamera" type="top" @changeAuth="changeAuthCamera" permissionID="CAMERA"></yk-authpup>
		<yk-authpup ref="authpup" type="top" @changeAuth="changeAuth" permissionID="WRITE_EXTERNAL_STORAGE"></yk-authpup>
		<!-- #endif -->
	</view>
</template>

<script>

import storage from '@/utils/storage.js';
import ykAuthpup from "@/components/yk-authpup/yk-authpup";
import { getUserInfo } from '@/api/members'
import { businessLicenseOcr, idCardOcr, uploadPrivateFile, signatureOcr } from "../../../api/common";
import { distributorDetail, distributorUploadSigning, distributorPreviewProtocol, renreDistributorUploadSigning } from "../../../api/distributor";

export default {
	name: '',
	components: {
		ykAuthpup
	},
	data() {
		return {
			previous: false,
			isComplete: false,
			iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,
			iconSignature: `${this.iconCommon}/static/v1/apply/icon-signature.png`,
			fileSignature: '',				// 企业公章
			fileSigning: '',					// 手写签名
			objData: {
				chopPhoto: "", // 公章图片
				signNamePhoto: "" //签名图片
			},
			submitting: false,
			isRenewState: false, // 是否续签
		}
	},
	methods: {
		// 上传头像
		handlerUpfile: function () {
			// #ifdef APP-PLUS
			if (plus.os.name == 'Android') {
				this.$refs['authpupCamera'].open(); // 调起相机权限目的弹框
			}
			// #endif
			let _this = this
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'], 		// 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], 					// 从相册选择
				success: (res) => {
					uni.showLoading({ title: "正在上传" })
					uni.uploadFile({
						url: uploadPrivateFile,
						filePath: res.tempFilePaths[0],
						name: "file",
						header: {
							accessToken: storage.getAccessToken(),
						},
						success: (uploadFileRes) => {
							uni.hideLoading();
							_this.$u.toast("上传成功")
							let data = JSON.parse(uploadFileRes.data);
							if (data.code == 200) {
								_this.fileSignature = res.tempFilePaths[0]
								uni.showLoading({ title: "正在识别信息" })
								signatureOcr({ sealAddress: data.result }).then(res => {
									uni.hideLoading();
									if (res.data.code == 200) {
										_this.objData.chopPhoto = data.result;
									} else {
										_this.fileSignature = ''
										_this.$u.toast("未识别成功 " + ocrRes.data.message)
									}
								})

							} else {
								this.$u.toast("上传失败，请稍后重试")
							}


						},
					});
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

		// 跳转签名页面
		handlerSign: function () {
			// 上一页面用此方法监听并给对应字段赋值
			uni.$once('picker', (res) => {
				this.fileSigning = res
				this.objData.signNamePhoto = res
			})
			uni.navigateTo({
				url: '/pages/apply/dealer/signing'
			})
		},
		handlerPrevious: function () {
			uni.redirectTo({
				url: '/pages/apply/dealer/archives?source=already'
			})
		},
		// 协议预览功能-服务商
		previewAgreementEve() {
			distributorPreviewProtocol().then(res => {
				if (res.data.success) {
					// #ifdef H5
					var user = navigator.userAgent;
					//android端
					var isAndroid = user.indexOf("Android") > -1 || user.indexOf("Adr") > -1;
					//ios端
					var isiOS = !!user.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
					if (isAndroid) {
						window.open(res.data.result)
					} else if (isiOS) {
						window.location.href = res.data.result;
					}
					// #endif

					// #ifdef APP-PLUS || MP-WEIXIN
					uni.showLoading({
						title: '正在下载'
					})
					uni.downloadFile({
						url: res.data.result,
						success: (res) => {
							uni.hideLoading()
							var filePath = res.tempFilePath
							uni.openDocument({
								filePath: filePath,
								fileType: 'pdf',
								showMenu: true,
								success: (re) => {
									console.log('打开文档成功', re)
								},
								fail: (err) => {
									console.log('打开文档失败', err)
								}
							})
						},
						fail: (er) => {
							uni.hideLoading()
							console.log('下载失败', er)
						}
					})
					// #endif
				}
			})
		},
		// 执行提交签约
		handlerSubmit: function () {
			if (!this.submitting) {
				this.submitting = true;
				if (this.valid()) {
					uni.showLoading({ title: "正在提交" })
					console.log("this.isRenewState", this.isRenewState)
					if (this.isRenewState) { // 续签
						renreDistributorUploadSigning(this.objData).then(res => {
							console.log('aa')
							uni.hideLoading();
							this.submitting = false;
							if (res.data.code == 200) {
								uni.redirectTo({
									url: '/pages/apply/dealer/status'
								})
							} else {
								this.$u.toast(res.data.message)
							}
						})
					} else { // 正常签
						distributorUploadSigning(this.objData).then(res => {
							uni.hideLoading();
							this.submitting = false;
							if (res.data.code == 200) {
								uni.redirectTo({
									url: '/pages/apply/dealer/status'
								})
							} else {
								this.$u.toast(res.data.message)
							}
						})
					}
				} else {
					this.submitting = false;
				}
			}

		},
		valid: function () {
			if (this.$u.test.isEmpty(this.objData.chopPhoto)) {
				this.$u.toast("请上传企业公章照片")
				return false;
			}

			if (this.$u.test.isEmpty(this.objData.signNamePhoto)) {
				this.$u.toast("请完成法人签名")
				return false;
			}
			return true;
		},

		// 没看懂
		handlerLoadSome: function () {
			distributorDetail().then(res => {
				uni.hideLoading();
				if (res.data.code == 200) {
					let result = res.data.result;
					this.objData.signNamePhoto = result.signNamePhoto;
					this.objData.chopPhoto = result.chopPhoto;
					this.fileSignature = result.chopPhoto ? result.chopPhoto : "";
					this.fileSigning = result.signNamePhoto ? result.signNamePhoto : "";
				}
			})
		}
	},
	onLoad: async function (options) {
		this.previous = options.previous
		if (options.renewState) {
			this.isRenewState = options.renewState
		}
		// #ifdef H5
		let tempSearch = window.location.search.slice(1)
		if (tempSearch.length > 0) {
			let tempArrFilter = tempSearch.split('&')
			if (tempArrFilter.length == 3) {
				storage.setAccessToken(tempArrFilter[1].slice(7))
				storage.setRefreshToken(tempArrFilter[2].slice(8))
				await getUserInfo().then((user) => {
					if (user.data.success) {
						storage.setUserInfo(user.data.result)
						storage.setHasLogin(true)
						storage.setAutoCp(0)
					}
				})
			}
			if (tempArrFilter.length == 4) {
				storage.setAccessToken(tempArrFilter[1].slice(7))
				storage.setRefreshToken(tempArrFilter[2].slice(8))
				await getUserInfo().then((user) => {
					if (user.data.success) {
						storage.setUserInfo(user.data.result)
						storage.setHasLogin(true)
						storage.setAutoCp(0)
					}
				})
			}
		}
		// #endif

		if (options.source == 'already') {
			this.handlerLoadSome()
		}
	},
	onShow: function () {
		// #ifdef H5
		let tempSearch = window.location.search.slice(1)
		if (tempSearch.length > 0) {
			let tempArrFilter = tempSearch.split('&')
			if (tempArrFilter.length == 3) {
				storage.setAccessToken(tempArrFilter[1].slice(7))
				storage.setRefreshToken(tempArrFilter[2].slice(8))
			}
			if (tempArrFilter.length == 4) {
				storage.setAccessToken(tempArrFilter[1].slice(7))
				storage.setRefreshToken(tempArrFilter[2].slice(8))
			}
		}
		// #endif
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

.lnk-preview {
	border: 1px solid #e6e6e6;
}
</style>
