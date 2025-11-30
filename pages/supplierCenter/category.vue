<template>
	<view class="container">


		<view class="fix-head" :style="{ top: `${envWinTopPX}px` }">
			<view class="hd">可选类目</view>
			<view class="bd">
				<view class="bd-flex">
					<picker mode="multiSelector" :range="newCategory" :value="curSelected" @change="pickerChange"
						@columnchange="pickerColumnChange">
						<view class="s-name" :class="{ 's-name_place': curSelectedLabel[0].length == 0 }">{{
							categoryText }}
						</view>
					</picker>
					<view class="s-ctrl" @tap="handlerInsert">添加</view>
				</view>
			</view>
		</view>

		<view class="wrapper">
			<view class="frm-sign">
				<view class="frm-title">
					<view class="name">已选类目</view>
				</view>

				<view class="min-group" v-if="curCategory.length > 0">
					<view class="item" v-for="(item, index) in curCategory" :key="index">
						<view class="hd">
							<view class="name" style="color: green" v-if="!item.status">{{ '[本次新增]' + item.categoryTxt
							}}
							</view>
							<view class="name" style="color: orange" v-if="item.status == 'TOBEAUDIT'">
								{{ '[待审核]' + item.categoryTxt }}</view>
							<view class="name" style="color: red" v-if="item.status == 'REFUSE'">
								{{ '[已驳回]' + item.categoryTxt }}</view>
							<view class="name" v-if="item.status == 'PASS'">{{ item.categoryTxt }}</view>
							<view class="ctrl" v-if="item.status != 'PASS'" @tap="delCategory(index)">删除</view>
							<view class="ctrl" style="color:green" v-if="item.status == 'PASS'">持有</view>

						</view>
						<view class="bd" v-if="item.certificate.length > 0">
							<view class="certificate" v-for="(f, i) in item.certificate" :key="i">

								<!-- 当状态为空时显示 -->
								<view class="name"
									v-if="item.status != 'REFUSE' && item.status != 'TOBEAUDIT' && item.status != 'PASS'">
									需要上传{{ f.name }}</view>
								<view class="file" @tap="handlerUpfile" :data-group="index" :data-thumb="i"
									v-if="item.status != 'REFUSE' && item.status != 'TOBEAUDIT' && item.status != 'PASS'">
									<image class="thumb" mode="scaleToFill" v-if="f.file && f.file.length > 0"
										:src="f.file"></image>
									<view class="label" v-if="!f.file || f.file.length == 0">点击上传资质照片</view>
								</view>

								<!-- 当状态为已驳回时 -->
								<view class="name" v-if="item.status == 'REFUSE'">需要上传{{ f.name }}</view>
								<view class="file" @tap="handlerUpfile" :data-group="index" :data-thumb="i"
									v-if="item.status == 'REFUSE'">
									<image class="thumb" mode="scaleToFill" v-if="f.file && f.file.length > 0"
										:src="f.file"></image>
									<view class="label" v-if="!f.file || f.file.length == 0">点击上传资质照片</view>
								</view>

								<!-- 当状态为持有和待审核时 -->
								<view class="name" v-if="item.status == 'PASS' || item.status == 'TOBEAUDIT'">{{ f.name
								}}
								</view>
								<view class="file" :data-group="index" :data-thumb="i"
									v-if="item.status == 'PASS' || item.status == 'TOBEAUDIT'">
									<image class="thumb" mode="scaleToFill" v-if="f.file && f.file.length > 0"
										:src="f.file"></image>
								</view>
							</view>
						</view>
						<view class="name" v-if="item.status == 'REFUSE'">{{ '原因：' + item.refuseReason }}</view>

					</view>
				</view>
			</view>
			<view>注意：提交后，所有非持有的类目将重新进入待审核状态。</view>
			<view class="lnk-common lnk-primary" @tap="handlerPreview">提交</view>
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
import { getCategoryIndexData } from "../../api/home";
import { getCategoryCompetency } from "../../api/goods";
import { appendStoreAllCategory, getStoreAllCategory } from "../../api/store";
import { upload } from "../../api/common";
import ykAuthpup from "@/components/yk-authpup/yk-authpup";

export default {
	name: '',
	components: {
		ykAuthpup
	},
	computed: {
		categoryText: function () {
			return this.curSelectedLabel[0].length == 0 ? '请选择经营类目' : `${this.curSelectedLabel[0]} / ${this.curSelectedLabel[1]} / ${this.curSelectedLabel[2]}`
		}
	},
	data() {
		return {
			isComplete: false,
			iconDemoCompany: `${this.iconCommon}/static/v1/demo/yingyezhizhao.jpg`,

			allCategory: [],											// 加载全部类目
			newCategory: [],											// 待选经营类目
			curSelected: [0, 0, 0],								// 选中经营类目下标
			curSelectedValue: ['', '', ''],				// 选中经营类目ID
			curSelectedLabel: ['', '', ''],				// 选中经营类目文本



			curCategory: [],											// 待提经营类目
			submitting: false,
			source: "",
			envWinTopPX: 0,// 导航栏高度
		}
	},
	methods: {
		// 跳转提交预览
		handlerPreview: function () {
			let that = this;
			if (!this.submitting) {
				if (this.curCategory.length == 0) {
					this.$u.toast("至少选择一个类目")
					return;
				}
				this.submitting = true;
				//构造参数
				let data = [];

				let lack = false;
				this.curCategory.forEach(cur => {
					if (cur.status != 'PASS') {
						let dataItem = { categoryId: cur.categoryIds.join(","), storeCategoryCompetencyApplyDTOList: [] }
						if (cur.certificate.length > 0) {
							cur.certificate.forEach(cert => {
								if (cert.file) {
									dataItem.storeCategoryCompetencyApplyDTOList.push({
										categoryCompetencyId: cert.id,
										fileUrl: cert.file
									})
								} else {
									lack = true;
								}

							})
						}
						data.push(dataItem);
					}
				})
				if (lack) {
					this.$u.toast("请上传全部所需资质再提交")
					this.submitting = false;
					return;
				}
				uni.showLoading({})
				appendStoreAllCategory(data).then(res => {
					uni.hideLoading();
					this.submitting = false;
					if (res.data.code == 200) {
						that.$u.toast("提交成功，等待审核");
						setTimeout(() => { that.loadCategoryData() }, 1000)
					} else {
						that.$u.toast(res.data.message);
					}
				})
			}

		},

		// 新增经营类目
		handlerInsert: function () {
			if (this.curSelectedLabel[0].length == 0) {
				this.$u.toast("请选择经营类目")
				return
			}

			// 注意：校验重复添加
			let match = false;
			let that = this;
			this.curCategory.forEach(item => {
				if (item.categoryIds.join(",") == that.curSelectedValue.join(",")) {
					match = true;
				}
			})
			if (match) {
				this.$u.toast("请勿重复添加")
			} else {
				uni.showLoading();
				getCategoryCompetency({ categoryId: this.curSelectedValue[2] }).then(res => {
					if (res.data.code == 200) {
						let arrCertificate = res.data.result;
						if (!arrCertificate) {
							arrCertificate = [];
						} else {
							arrCertificate.forEach(itm => {
								itm.file = "";
							})
						}
						that.curCategory.push({
							categoryTxt: [...that.curSelectedLabel].join("/"),
							categoryIds: [...that.curSelectedValue],
							certificate: arrCertificate
						})
						// 重置当前选中类目
						for (let i = 0; i < 3; i++) {
							that.curSelected.splice(i, 1, 0)
							that.curSelectedValue.splice(i, 1, '')
							that.curSelectedLabel.splice(i, 1, '')
						}
						// 初始选中经营类目
						that.initCurCategory()
					} else {
						that.$u.toast(res.data.message);
					}
				})

			}

		},

		delCategory: function (index) {
			this.curCategory.splice(index, 1);
		},
		// 上传资质文件
		handlerUpfile: function (e) {
			// #ifdef APP-PLUS
			if (plus.os.name == 'Android') {
				this.$refs['authpupCamera'].open(); // 调起相机权限目的弹框
			}
			// #endif
			let _this = this
			let eGroup = e.currentTarget.dataset.group
			let eThumb = e.currentTarget.dataset.thumb
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'], 		// 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], 					// 从相册选择
				success: (res) => {
					uni.showLoading({ title: "正在上传" })
					uni.uploadFile({
						url: upload,
						filePath: res.tempFilePaths[0],
						name: "file",
						header: {
							accessToken: storage.getAccessToken(),
						},
						success: (res) => {
							uni.hideLoading();
							let data = JSON.parse(res.data)
							this.$u.toast("上传成功")
							_this.curCategory[eGroup].certificate[eThumb].file = data.result
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


		// 确定类目选择
		pickerChange: function (e) {
			this.curSelected = e.detail.value
			let curCategory1 = this.allCategory[this.curSelected[0]]
			let curCategory2 = curCategory1.children[this.curSelected[1]]
			let curCategory3 = curCategory2.children[this.curSelected[2]]
			this.curSelectedValue = [curCategory1.id, curCategory2.id, curCategory3.id]
			this.curSelectedLabel = [curCategory1.name, curCategory2.name, curCategory3.name]
		},
		// 变更类目选择
		pickerColumnChange: function (e) {
			let _this = this
			let curSelectedIndex = e.detail.value
			// 变更1级
			if (e.detail.column === 0) {
				_this.curSelected.splice(0, 1, curSelectedIndex)
				let curSelectedCategory = _this.allCategory[curSelectedIndex]
				// 加载备选2级别
				_this.newCategory[1] = curSelectedCategory.children.map(o => { return o.name })
				// 加载备选3级别
				_this.newCategory[2] = curSelectedCategory.children[0].children.map(o => { return o.name })
				// 默认选择下标0的2级
				_this.curSelected.splice(1, 1, 0)
				// 默认选择下标0的3级
				_this.curSelected.splice(2, 1, 0)
			}
			// 变更2级
			if (e.detail.column === 1) {
				_this.curSelected.splice(1, 1, curSelectedIndex)
				let curSelectedCategory = _this.allCategory[_this.curSelected[0]]
				_this.newCategory[2] = curSelectedCategory.children[curSelectedIndex].children.map(o => { return o.name })
				// 默认选择下标0的3级
				_this.curSelected.splice(2, 1, 0)
			}
			// 变更3级
			if (e.detail.column === 2) {
				_this.curSelected.splice(2, 1, curSelectedIndex)
			}
		},
		// 加载全部商品类目
		loadCategoryData: function () {
			uni.showLoading();
			getCategoryIndexData().then(res => {
				uni.hideLoading();
				if (res.data.code == 200) {
					this.allCategory = res.data.result;
					// 初始选中经营类目
					this.initCurCategory()
					uni.showLoading()
					getStoreAllCategory().then(echoRes => {
						if (echoRes.data.code == 200) {
							this.curCategory = [];
							let result = echoRes.data.result;
							result.forEach(item => {
								let certificates = [];
								item.storeCategoryCompetencyApplyDTOList.forEach(itm => {
									certificates.push({
										id: itm.categoryCompetencyId,
										name: itm.categoryCompetencyName,
										file: itm.fileUrl
									})
								})
								this.curCategory.push({
									categoryTxt: item.categoryName.split(",").join("/"),
									categoryIds: item.categoryId.split(","),
									certificate: [...certificates],
									status: item.status,
									refuseReason: item.refuseReason
								});
							})
						} else {
							this.$u.toast(echoRes.data.message);
						}
					})
				} else {
					this.$u.toast(res.data.message);
				}
			})

		},

		// 初始选中经营类目
		initCurCategory: function () {
			this.newCategory[0] = this.allCategory.map(o => { return o.name })
			this.newCategory[1] = this.allCategory[0].children.map(o => { return o.name })
			this.newCategory[2] = this.allCategory[0].children[0].children.map(o => { return o.name })
		},
	},
	onLoad: function (options) {
		this.envWinTopPX = uni.getWindowInfo().windowTop
		this.source = options.source;
		// 加载全部商品类目
		this.loadCategoryData()
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
	padding: 0 0 20rpx;

	.fix-head {
		position: sticky;
		left: 0;
		right: 0;
		top: 0;
		height: calc(96rpx + 88rpx + 20rpx);
		background: #FFF;
		padding: 0 20rpx;
		z-index: 999;

		.hd {
			font-size: 28rpx;
			color: #333;
			font-weight: 600;
			height: 96rpx;
			line-height: 96rpx;
			padding: 0 0 0 20rpx;
			position: relative;

			&::after {
				position: absolute;
				content: '';
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 6rpx;
				height: 40rpx;
				border-radius: 6rpx;
				background: #E22221;
			}
		}

		.bd {
			.bd-flex {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 88rpx;
				position: relative;

				&::after {
					position: absolute;
					content: '';
					left: -20rpx;
					right: -20rpx;
					bottom: 0;
					height: 3rpx;
					background: #EBEDF0;
				}

				.s-name {
					width: calc(100vw - 40rpx - 120rpx);
					height: 88rpx;
					line-height: 88rpx;
					font-size: 26rpx;
					color: #323232;
					box-sizing: border-box;
					padding: 0 20rpx 0 0;
				}

				.s-name_place {
					color: #A3A3A3;
					font-size: 26rpx;
				}

				.s-ctrl {
					width: 120rpx;
					height: 56rpx;
					line-height: 50rpx;
					border: 3rpx solid #E22221;
					text-align: center;
					font-size: 24rpx;
					color: #E22221;
					border-radius: 4rpx;
				}
			}
		}
	}

	.wrapper {
		padding: 0 20rpx;
	}

	.min-group {
		.item {
			margin: 0 0 20rpx;

			&:last-of-type {
				margin: 0;
			}

			border: 3rpx dashed #dedede;
			padding: 0 20rpx;

			.hd {
				height: 80rpx;
				line-height: 80rpx;
				font-size: 26rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.name {
					color: #666;
				}

				.ctrl {
					color: #e22221;
				}
			}

			.bd {
				border-top: 3rpx solid #EBEDF0;
				padding: 0 0 20rpx;

				.certificate {
					padding: 16rpx 0 0;

					&:first-of-type {
						padding: 0;
					}

					.name {
						height: 72rpx;
						line-height: 72rpx;
						font-size: 24rpx;
						color: #999;
					}

					.file {
						height: 360rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						background: rgba(226, 34, 33, 0.1);
						border-radius: 6rpx;

						.thumb {
							width: calc(100vw - 40rpx - 40rpx - 40rpx);
							height: 320rpx;
							border-radius: 6rpx;
						}

						.label {
							color: #f7c1c1;
							font-size: 32rpx;
						}
					}
				}
			}
		}
	}
}
</style>
