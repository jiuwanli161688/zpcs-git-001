<template>
	<view class="container">
		<view class="wrap-handler">
			<view class="name">继续举证</view>
			<view class="wrap">
				<view class="rs-area">
					<textarea placeholder="请输入" class="i-area" v-model="form.description" />
				</view>
				<view class="rs-tips">
					<image :src="iconTips" mode="aspectFit" class="icon"></image>
					<view class="text">有图有真相，建议您上传相关证明图片</view>
				</view>
				<view class="rs-file">
					<view class="item" v-for="(item, index) in arrThumb" :key="index" :data-index="index"
						@tap="handlerUpfile">
						<view class="thumb">
							<image class="ico" mode="aspectFit" :src="iconCamera" v-if="item.length == 0"></image>
							<image class="pic" mode="aspectFill" :src="item" v-if="item.length > 0"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="lnk-common lnk-primary" @tap="handlerSubmit">提交</view>
			<!-- #ifdef APP-PLUS -->
			<yk-authpup ref="authpupCamera" type="top" @changeAuth="changeAuthCamera" permissionID="CAMERA"></yk-authpup>
			<yk-authpup ref="authpup" type="top" @changeAuth="changeAuth"
				permissionID="WRITE_EXTERNAL_STORAGE"></yk-authpup>
			<!-- #endif -->
		</view>


	</view>
</template>

<script>
import storage from "@/utils/storage.js";
import { upload } from "@/api/common.js";
import { complainAdd } from "@/api/after-sale.js";
import ykAuthpup from "@/components/yk-authpup/yk-authpup";
export default {
	name: '',
	components: {
		ykAuthpup
	},
	data() {
		return {
			isComplete: false,
			iconRefuse: `${this.iconCommon}/static/v1/sales/icon-refuse.png`,
			iconCamera: `${this.iconCommon}/static/v1/common/icon-camera.png`,
			iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,
			arrThumb: [''],
			form: {},
			isCanSubmit: true,//默认可点击
		}
	},
	methods: {
		handlerUpfile: function (e) {
			// #ifdef APP-PLUS
			if (plus.os.name == 'Android') {
				this.$refs['authpupCamera'].open(); // 调起相机权限目的弹框
			}
			// #endif
			let eIndex = parseInt(e.currentTarget.dataset.index)
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
							// 注意：上传文件接口执行成功后渲染数组
							_this.arrThumb.splice(eIndex, 1, data.result)

							// 最多上传九张图片
							if (_this.arrThumb[_this.arrThumb.length - 1].length > 0 && _this.arrThumb.length < 9) {
								_this.arrThumb.push('')
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

		// 提交投诉
		handlerSubmit() {
			let form = this.form
			if (!form.description) {
				this.$u.toast('请输入投诉描述')
				return
			}
			if (!this.isCanSubmit) return
			this.isCanSubmit = false
			this.arrThumb.pop();
			form.imgs = this.arrThumb
			complainAdd(form).then((res) => {
				if (res.data.success) {
					this.$u.toast('提交成功')
					uni.navigateBack()
				}
				this.isCanSubmit = true
			})
		},
	},
	onLoad: function (options) {
		this.form.complaintId = options.id
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

	.wrap-handler {
		margin: 0 !important;
	}
}
</style>