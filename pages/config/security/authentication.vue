<template>
	<view class="container">
		<!-- 待定 -->
		<view class="frm-comm">
			<view class="frm-title">上传身份证</view>
			<view class="min-photo">
				<view class="col-06">
					<view class="rs-file" data-type='person-ps' @tap="handlerUpfile">
						<image class="icon-person" :src="iconLicensePerson1" mode="aspectFit"
							v-if="form.filePersonPs.length == 0"></image>
						<image class="file-person" :src="form.filePersonPs" mode="scaleToFill"
							v-if="form.filePersonPs.length > 0"></image>
					</view>
				</view>
				<view class="col-06">
					<view class="rs-file" data-type='person-dt' @tap="handlerUpfile">
						<image class="icon-person" :src="iconLicensePerson2" mode="aspectFit"
							v-if="form.filePersonDt.length == 0"></image>
						<image class="file-person" :src="form.filePersonDt" mode="scaleToFill"
							v-if="form.filePersonDt.length > 0"></image>
					</view>
				</view>
			</view>
		</view>

		<view class="frm-comm">
			<view class="rs rs-line">
				<view class="lab">真实姓名</view>
				<view class="txt flex">
					<input class="s-text" v-model="form.realName" type="text" placeholder="请输入真实姓名" />
				</view>
			</view>
			<view class="rs">
				<view class="lab">身份证号</view>
				<view class="txt flex">
					<input class="s-text" v-model="form.idCardNumber" type="idcard" placeholder="请输入身份证号" />
				</view>
			</view>
		</view>

		<view class="lnk-common lnk-primary" @tap="handlerSave">提交</view>
		<view class="txt-tips">温馨提示：中品维度商城APP收集您的身份证信息仅用于验证您的真实身份，不作任何其他用途。</view>
		<!-- #ifdef APP-PLUS -->
		<yk-authpup ref="authpupCamera" type="top" @changeAuth="changeAuthCamera" permissionID="CAMERA"></yk-authpup>
		<yk-authpup ref="authpup" type="top" @changeAuth="changeAuth" permissionID="WRITE_EXTERNAL_STORAGE"></yk-authpup>
		<!-- #endif -->
	</view>
</template>

<script>
import { certification, OCRIdCard } from '@/api/members.js'
import storage from "@/utils/storage.js";
import { uploadPrivateFile } from "@/api/common.js";
import ykAuthpup from "@/components/yk-authpup/yk-authpup";
export default {
	name: '',
	components: {
		ykAuthpup
	},
	data() {
		return {
			isComplete: false,
			iconLicensePerson1: `${this.iconCommon}/static/v1/apply/icon-person_1.png`,
			iconLicensePerson2: `${this.iconCommon}/static/v1/apply/icon-person_2.png`,
			form: {
				filePersonPs: '',						// 身份证正面
				filePersonDt: '',						// 身份证背面
				idCardNumber: '', // 身份证号
				realName: '', // 真实姓名
			},
			isCanSubmit: true,//默认可点击
			type: "0"     //判断是否是强制跳过来的
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
					let tempFilePaths = res.tempFilePaths;
					// 调用文件上传接口
					uni.uploadFile({
						url: uploadPrivateFile,
						filePath: tempFilePaths[0],
						name: "file",
						header: {
							accessToken: storage.getAccessToken(),
						},
						success: (uploadFileRes) => {
							let data = JSON.parse(uploadFileRes.data);
							if (eType == 'person-ps') {
								_this.form.filePersonPs = data.result;
								// 获取身份证号
								OCRIdCard({ idCardAddress: data.result }).then((res) => {
									if (res.data.success) {
										this.$u.toast('识别成功')
										this.form.realName = res.data.result.name
										this.form.idCardNumber = res.data.result.idCardNumber
									}
								})
							}
							if (eType == 'person-dt') {
								_this.form.filePersonDt = data.result;
							}

						},
					});
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
		handlerSave: function () {
			let form = this.form
			if (!form.realName) {
				this.$u.toast('请输入真实姓名')
				return
			}
			if (!form.idCardNumber) {
				this.$u.toast('请输入身份证号')
				return
			}
			if (!this.$u.test.idCard(form.idCardNumber)) {
				this.$u.toast('请正确输入身份证号')
				return
			}

			if (!form.filePersonPs) {
				this.$u.toast('请上传身份证正面')
				return
			}
			if (!form.filePersonDt) {
				this.$u.toast('请上传身份证反面')
				return
			}
			if (!this.isCanSubmit) return
			this.isCanSubmit = false
			let params = {
				idCardImgUrl: `${form.filePersonPs},${form.filePersonDt}`,
				idCardNumber: form.idCardNumber,
				realName: form.realName
			}
			certification(params).then((res) => {
				if (res.data.success) {
					this.$u.toast('提交成功')
					if (this.type == "1") {
						uni.redirectTo({
							url: '/pages/profile/wallet/bankAccount'
						})
					} else {
						uni.navigateBack()
					}
				}
				this.isCanSubmit = true
			})
		},
	},
	onLoad: function (option) {
		this.type = option.type
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

.txt-tips {
	margin-top: 15rpx;
	font-size: 24rpx;
	color: #b1afaf;
	// text-align: center;
}
</style>