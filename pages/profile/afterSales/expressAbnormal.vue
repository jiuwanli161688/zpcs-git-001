<template>
	<view class="container" v-if="isComplete">
		<!-- 举证表单 -->
		<view class="wrap-handler">
			<view class="wrap">
				<view class="rs-flex rs-line">
					<view class="lab">异常原因</view>
					<view class="inf">
						<view class="in-flex">
							<view class="txt">虚假揽件</view>
						</view>
					</view>
				</view>
				<view class="rs-flex rs-line">
					<view class="lab">姓名</view>
					<view class="inf">
						<view class="in-flex">
							<input class="s-text" type="text" v-model="workName" placeholder="请输入您的姓名"
								placeholder-style="{ fontSize: '30rpx' }" />
						</view>
					</view>
				</view>
				<view class="rs-flex rs-line">
					<view class="lab">电话</view>
					<view class="inf">
						<view class="in-flex">
							<input class="s-text" type="number" v-model="workTel" placeholder="请输入您的手机号码"
								placeholder-style="{ fontSize: '30rpx' }" />
						</view>
					</view>
				</view>
				<view class="rs-name">反馈内容：</view>
				<view class="rs-area">
					<textarea v-model="feedbackContent" placeholder="请输入" class="i-area" />
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
							<image class="pic" mode="aspectFill" :src="item" @tap.stop v-if="item.length > 0"></image>
							<image class="del-image" @tap="deleteImage(index)" @tap.stop v-if="item.length > 0"
								:src="iconFailed"></image>
						</view>
					</view>
				</view>
			</view>

			<view class="lnk-common lnk-primary" @tap="handlerWork">提交</view>
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
import ykAuthpup from "@/components/yk-authpup/yk-authpup";
import { upload } from "@/api/common.js";
import { submitWork, getDoorPickup } from '@/api/after-sale.js'
export default {
	data() {
		return {
			isComplete: false,
			iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,
			iconCamera: `${this.iconCommon}/static/v1/common/icon-camera.png`,
			iconFailed: `${this.iconCommon}/static/v1/common/icon-fail.png`,
			sn: "",
			objDoorDetail: {},
			currentIndex: 0,
			arrThumb: [''],
			workName: "",
			workTel: "",
			feedbackContent: "",
			picList: [],
		}
	},
	components: {
		ykAuthpup
	},
	methods: {
		loadDoorPickup: function () {
			//获取上门取件订单详情信息
			getDoorPickup(this.sn).then(res => {
				this.isComplete = true;
				if (res.data.success) {
					this.objDoorDetail = res.data.result
				}
			})
		},
		handlerWork: function () {
			if (this.workName.length == 0) {
				uni.showToast({
					title: '请输入您的姓名',
					icon: 'none'
				});
				return;
			}

			if (this.workTel.length == 0) {
				uni.showToast({
					title: '请输入您的手机号码',
					icon: 'none'
				});
				return;
			}

			if (this.feedbackContent.length == 0) {
				uni.showToast({
					title: '请输入反馈内容',
					icon: 'none'
				});
				return;
			}
			let objAbnormal = {
				mobile: this.workTel,
				name: this.workName,
				orderCode: this.objDoorDetail.orderCode,
				logisticCode: this.objDoorDetail.logisticCode,
				complaintType: 1,
				complaintContent: this.feedbackContent,
				source: 4,
				picList: this.picList,
			}
			submitWork(objAbnormal).then(res => {
				if (res.data.success) {
					uni.showToast({
						title: '提交成功,1秒后返回',
						icon: 'none'
					});
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 1000)
				}
			})
		},
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
				sourceType: ['album', 'camera'], 					// 从相册或相机选择
				success: (res) => {
					if (res.tempFiles[0].size > 1024 * 1024 * 2) {
						uni.showToast({
							title: '图片大小不能超过2M',
							icon: 'none'
						});
						return;
					}
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
							if (data.result) {
								_this.picList.push({ pictureItem: data.result })
							}
							// 最多上传四张张图片
							if (_this.arrThumb[_this.arrThumb.length - 1].length > 0 && _this.arrThumb.length < 4) {
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
		deleteImage(index) {
			this.arrThumb.splice(index, 1)
		}
	},
	onLoad: function (options) {
		this.sn = options.sn
		this.loadDoorPickup()
	},
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;

	.wrap-handler {
		margin: 20rpx 0 0 0 !important;


		.inf {

			.in-flex {
				font-size: 30rpx;

				.s-text {
					text-align: right;
				}
			}
		}


		.thumb {
			position: relative;

			.del-image {
				position: absolute;
				width: 50rpx;
				height: 50rpx;
				top: 0;
				right: 0;
				border-radius: 25rpx;
				background-position: center center;
				background-size: contain;
			}
		}


	}
}
</style>