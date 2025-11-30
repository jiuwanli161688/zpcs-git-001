<template>
	<view class="container">
		<!-- 商品信息 -->
		<view class="wrap-alone" v-if="isComplete">
			<view class="bd">
				<view class="icon" :style="{ background: 'url(' + goods.goodsImage + ')' }"></view>
				<view class="base">
					<view class="txt">{{ goods.goodsName }}</view>
					<view class="sku">
						<text class="sku-item">{{ goods.simpleSpecs }}</text>
					</view>
					<view class="inf">
						<view class="price">￥{{ goods.goodsPrice | unitPrice }}</view>
						<view class="count">×{{ goods.num }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 举证表单 -->
		<view class="wrap-handler" v-if="isComplete">
			<view class="wrap">
				<view class="rs-flex rs-line">
					<view class="lab">投诉主题</view>
					<view class="inf">
						<picker mode="selector" @change="bindPickerTitle" :value="curTitleIndex" :range="arrTitle"
							range-key="label">
							<view class="in-picker" :class="{ 'in-picker_place': curTitleLabel.length < 0 }">{{
								curTitleLabel.length == 0 ? '请选择' : curTitleLabel }}</view>
						</picker>
					</view>
				</view>
				<view class="rs-flex rs-line">
					<view class="lab">我的诉求</view>
					<view class="inf">
						<view class="in-flex">
							<view class="txt">{{ serviceType }}</view>
						</view>
					</view>
				</view>
				<view class="rs-name">问题描述：</view>
				<view class="rs-area">
					<textarea v-model="form.description" placeholder="请输入" class="i-area" />
				</view>
				<view class="rs-tips">
					<image :src="iconTips" mode="aspectFit" class="icon"></image>
					<view class="text">请您上传相关证明图片</view>
				</view>
				<view class="rs-file">
					<view class="item" v-for="(item, index) in arrThumb" :key="index" :data-thumb="index"
						@tap="handlerUpfile">
						<view class="thumb">
							<image class="pic" mode="aspectFill" :src="item"></image>
							<image class="del-image" @tap="deleteImage(index)" @tap.stop v-if="item.length > 0"
								:src="iconFailed"></image>
						</view>
					</view>
					<view class="item" v-if="arrThumb.length + arrVideo.length < 9" :data-thumb="-1" @tap="handlerUpfile">
						<view class="thumb">
							<image class="ico" mode="aspectFit" :src="iconCamera"></image>
						</view>
					</view>
				</view>
				<view class="rs-tips">
					<image :src="iconTips" mode="aspectFit" class="icon"></image>
					<view class="text">请您上传相关证明视频</view>
				</view>
				<view class="rs-file">
					<view class="item" v-for="(item, index) in arrVideo" :key="index" :data-thumb="index"
						@tap="handlerUpfileVideo">
						<view class="thumb">
							<video style="width:0" id="myVideo" objectFit="contain" :src="item" controls></video>
							<image class="pic" mode="aspectFill" :src="shipin" @tap="viewVideo" @tap.stop>
							</image>
							<image class="del-image" @tap="deleteImageVideo(index)" @tap.stop :src="iconFailed" v-if="item">
							</image>
						</view>
					</view>
					<view class="item" v-if="arrVideo.length + arrVideo.length < 9" :data-thumb="-1"
						@tap="handlerUpfileVideo">
						<view class="thumb">
							<image class="ico" mode="aspectFit" :src="iconCamera"></image>
						</view>
					</view>
				</view>

			</view>

			<view class="lnk-common lnk-primary" @tap="handlerSubmit">提交投诉</view>
		</view>

		<!-- 投诉失败弹窗 -->
		<u-popup v-model="showFailPopup" mode="center" width="600rpx" border-radius="16">
			<view class="popup-content">
				<view class="popup-text">该订单完成已超过售后时效，若商品遇到问题，可与商家客服进行协商处理。</view>
				<view class="popup-buttons">
					<view class="popup-btn know-btn" @tap="closeFailPopup">我知道了</view>
					<view class="popup-btn contact-btn" @tap="contactService">联系客服</view>
				</view>
			</view>
		</u-popup>
		<!-- #ifdef APP-PLUS -->
		<yk-authpup ref="authpupCamera" type="top" @changeAuth="changeAuthCamera" permissionID="CAMERA"></yk-authpup>
		<yk-authpup ref="authpup" type="top" @changeAuth="changeAuth" permissionID="WRITE_EXTERNAL_STORAGE"></yk-authpup>
		<!-- #endif -->

	</view>
</template>

<script>
import storage from "@/utils/storage.js";
import { upload } from "@/api/common.js";
import { orderComplainInfo, addComplain } from "@/api/after-sale.js";
import { getDictData } from "@/api/common.js";
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
			iconFailed: `${this.iconCommon}/static/v1/common/icon-fail.png`,
			shipin: `${this.iconCommon}/static/shipin.jpg`,
			arrThumb: [],
			arrVideo: [],

			form: {
				afterSaleId: '',							// 售后id
				complainTopic: '', // 投诉主题
				content: '', // 投诉内容
				images: '', // 投诉图片
				description: '', // 投诉描述
			},
			goods: [],// 商品信息
			arrTitle: [],
			curTitleIndex: '',
			curTitleLabel: '',
			isCanSubmit: true,//默认可点击
			showFailPopup: false, // 控制投诉失败弹窗显示
			storeId: '', // 存储商家ID，用于联系客服
		}
	},
	computed: {
		// 售后类型
		serviceType() {
			const serviceType = {
				'RETURN_GOODS': '[退货]',
				'EXCHANGE_GOODS': '[换货]',
			};
			return serviceType[this.goods.serviceType] || '';
		},
	},
	methods: {
		// 选择投诉主题
		bindPickerTitle: function (e) {
			this.curTitleIndex = e.detail.value
			this.form.complainTopic = this.arrTitle[e.detail.value].value
			this.curTitleLabel = this.arrTitle[e.detail.value].label
		},

		// 提交投诉
		handlerSubmit() {
			let form = this.form
			if (!form.complainTopic) {
				this.$u.toast('请选择投诉主题')
				return
			}
			if (!form.description) {
				this.$u.toast('请输入投诉描述')
				return
			}
			if (this.arrThumb.length == 0 && this.arrVideo.length == 0) {
				this.$u.toast('请您上传相关证明图片或视频')
				return
			}
			if (!this.isCanSubmit) return
			this.isCanSubmit = false
			let data = [...this.arrThumb]
			this.arrVideo.map(item => {
				data.push(item)
			})
			form.images = data.join(',')
			form.content = form.description
			addComplain(form).then((res) => {
				if (res.data.success) {
					this.$u.toast('提交成功')
					uni.navigateBack()
				} else {
					// 投诉失败，显示弹窗
					this.showFailPopup = true
				}
				this.isCanSubmit = true
			}).catch((err) => {
				// 请求异常，也显示弹窗
				this.showFailPopup = true
				this.isCanSubmit = true
			})
		},

		// 关闭失败弹窗
		closeFailPopup() {
			this.showFailPopup = false
		},

		// 联系商家客服
		contactService() {
			this.showFailPopup = false
			// 跳转到与当前商家的客服聊天页面
			uni.navigateTo({
				url: `/pages/Im/Chat?storeId=${this.storeId}&type=business`
			})
		},

		// 加载字典数据
		loadDictData: function () {
			getDictData({ type: 'complaint_subject', pageSize: 100 }).then((res) => {
				if (res.data.success) {
					this.isComplete = true
					res.data.result.records.forEach(item => {
						this.arrTitle.push({ label: item.dictName, value: item.dictCode })
					});
				}
			})
		},
		// 加载投诉信息
		loadBaseData: function () {
			orderComplainInfo({ afterSaleId: this.form.afterSaleId }).then((res) => {
				if (res.data.success) {
					this.isComplete = true
					this.goods = res.data.result
					// 保存商家ID，用于联系客服
					this.storeId = res.data.result.storeId || ''
				}
			})
		},

		handlerUpfile: function (e) {
			// #ifdef APP-PLUS
			if (plus.os.name == 'Android') {
				this.$refs['authpupCamera'].open(); // 调起相机权限目的弹框
			}
			// #endif
			let eThumb = parseInt(e.currentTarget.dataset.thumb)
			let _this = this
			let num = 9 - this.arrThumb.length + this.arrVideo.length
			uni.chooseImage({
				count: num,
				sizeType: ['original', 'compressed'], 		// 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], 					// 从相册选择
				success: (res) => {
					let tempFilePaths = res.tempFilePaths;
					tempFilePaths.forEach((item, index) => {
						uni.uploadFile({
							url: upload,
							filePath: item,
							name: "file",
							header: {
								accessToken: storage.getAccessToken(),
							},
							success: (uploadFileRes) => {
								let data = JSON.parse(uploadFileRes.data);
								// 注意：上传文件接口执行成功后渲染数组
								if (eThumb < 0) {
									_this.arrThumb.push(data.result)
									_this.arrImage = _this.arrThumb
								} else {
									_this.arrThumb.splice(eThumb, 1, data.result)
									_this.arrImage = _this.arrThumb
								}
							},
							fail: (err) => {
								console.log(err, "err")
							}
						});
					})

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
		handlerUpfileVideo: function (e) {
			// #ifdef APP-PLUS
			if (plus.os.name == 'Android') {
				this.$refs['authpupCamera'].open(); // 调起相机权限目的弹框
			}
			// #endif
			let eThumb = parseInt(e.currentTarget.dataset.thumb)
			let _this = this
			let num = 9 - this.arrThumb.length + this.arrVideo.length
			uni.chooseVideo({
				count: num,
				sizeType: ['original', 'compressed'], 		// 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], 					// 从相册选择
				success: (res) => {
					let tempFilePaths = res.tempFilePath;
					uni.uploadFile({
						url: upload,
						filePath: tempFilePaths,
						name: "file",
						header: {
							accessToken: storage.getAccessToken(),
						},
						success: (uploadFileRes) => {
							let data = JSON.parse(uploadFileRes.data);
							// 注意：上传文件接口执行成功后渲染数组
							if (eThumb < 0) {
								_this.arrVideo.push(data.result)
								_this.arrImage = _this.arrVideo
							} else {
								_this.arrVideo.splice(eThumb, 1, data.result)
								_this.arrImage = _this.arrVideo
							}
						},
						fail: (err) => {
							console.log(err, "err")
						}
					});

				}
			})
		},
		deleteImage(index) {
			this.arrThumb.splice(index, 1)
		},
		deleteImageVideo(index) {
			this.arrVideo.splice(index, 1)
		},
		//查看视频
		viewVideo() {
			const videoContext = uni.createVideoContext('myVideo', this);
			videoContext.requestFullScreen({
				direction: 0 // 0：正常方向，1：横向
			});
		}
	},
	onLoad: function (options) {
		this.form.afterSaleId = options.afterSaleId
		// 加载字典
		this.loadDictData()
		// 加载投诉信息
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

	.wrap-handler {
		margin: 20rpx 0 0 0 !important;

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

	.popup-content {
		padding: 30rpx;

		.popup-text {
			font-size: 28rpx;
			color: #333;
			text-align: center;
			padding: 20rpx 0 40rpx;
			line-height: 1.5;
		}

		.popup-buttons {
			display: flex;
			justify-content: space-between;
			padding-top: 20rpx;
			border-top: 1px solid #f5f5f5;

			.popup-btn {
				flex: 1;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				font-size: 28rpx;
				border-radius: 8rpx;
			}

			.know-btn {
				color: #333;
				margin-right: 20rpx;
				background-color: #f5f5f5;
			}

			.contact-btn {
				color: #fff;
				background-color: #E22221;
			}
		}
	}
}
</style>
