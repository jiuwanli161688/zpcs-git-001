<template>
	<view class="container" v-if="allCategory.length > 0">


		<view class="fix-head">
			<view class="hd">可选类目</view>
			<view class="bd">
				<view class="bd-flex">
					<picker mode="multiSelector" :range="newCategory" :value="curSelected" @change="pickerChange"
						@columnchange="pickerColumnChange">
						<view class="s-name" :class="{ 's-name_place': curSelectedLabel[0].length == 0 }">
							{{ categoryText }}
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
							<view class="name">{{ item.categoryTxt }}</view>
							<view class="ctrl" @tap="delCategory(index)">删除</view>
						</view>
						<!-- <view class="bd" v-if="item.certificate.length > 0">
							<view class="certificate" v-for="(f, i) in item.certificate" :key="i">
								<view class="name">需要上传{{ f.name }}</view>
								<view class="file" @tap="handlerUpfile" :data-group="index" :data-thumb="i">
									<image class="thumb" mode="scaleToFill" v-if="f.file.length > 0" :src="f.file">
									</image>
									<view class="label" v-if="f.file.length == 0">点击上传资质照片</view>
								</view>
								<view>
									<view class="rs rs-line">
										<u-checkbox v-model="f.longterm">资质长期有效</u-checkbox>
									</view>
									<view v-show="!f.longterm" class="rs rs-line">
									<picker mode="date" :value="f.expireTime" @change="endTimeChangeCategory"
										:data-group="index" :data-thumb="i">
										<view class="uni-input">{{f.expireTime?f.expireTime:'选择类目资质到期时间'}}</view>
									</picker>
									</view>
								</view>
							</view>
							<p>选择经营品牌</p>
							<view class="certificate" v-for="(f, i) in item.brands" :key="i"
								style="border:1px solid lightpink;padding: 25px;">
								<view class="name">
									<u-checkbox v-model="f.enable"></u-checkbox>{{ f.name }}
								</view>
								<view v-if="f.enable">
									<view class="file" @tap="handlerUpBrandfile" :data-group="index" :data-thumb="i">
										<image class="thumb" mode="scaleToFill" v-if="f.competencyImg.length > 0"
											:src="f.competencyImg"></image>
										<view class="label" v-if="f.competencyImg.length == 0">点击上传资质照片</view>
									</view>
									<view>
										<view class="rs rs-line">
											<u-checkbox v-model="f.longterm">资质长期有效</u-checkbox>
										</view>
										<view v-show="!f.longterm" class="rs rs-line">
											<picker mode="date" :value="f.endTime" @change="endTimeChange"
												:data-group="index" :data-thumb="i">
												<view class="uni-input">{{f.endTime?f.endTime:'选择品牌授权到期时间'}}</view>
											</picker>
										</view>
									</view>
								</view>
							</view>
						</view> -->
					</view>
				</view>
			</view>
			<view class="lnk-common lnk-primary" @tap="handlerPreview">提交预览</view>
		</view>
	</view>
</template>

<script>
import {
	getCategoryIndexData
} from "../../../api/home";
import {
	getCategoryCompetency
} from "../../../api/goods";
import {
	applySupplierSecond,
	applySupplierSecondEcho
} from "../../../api/store";
import {
	upload
} from "../../../api/common";
import storage from "@/utils/storage.js";
import UCheckbox from "../../../uview-ui/components/u-checkbox/u-checkbox.vue";

export default {
	name: '',
	components: {
		UCheckbox

	},
	computed: {
		categoryText: function () {
			// return this.curSelectedLabel[0].length == 0 ? '请选择经营类目' : `${this.curSelectedLabel[0]} / ${this.curSelectedLabel[1]} / ${this.curSelectedLabel[2]}`
			return this.curSelectedLabel[0].length == 0 ? '请选择经营类目' :
				this.curSelectedLabel[1] ? `${this.curSelectedLabel[0]} / ${this.curSelectedLabel[1]}` :
					`${this.curSelectedLabel[0]}`;
		}
	},
	data() {
		return {
			isComplete: false,
			iconDemoCompany: `${this.iconCommon}/static/v1/demo/yingyezhizhao.jpg`,

			allCategory: [], // 加载全部类目
			newCategory: [], // 待选经营类目
			curSelected: [0, 0], // 选中经营类目下标
			curSelectedValue: ['', ''], // 选中经营类目ID
			curSelectedLabel: ['', ''], // 选中经营类目文本



			curCategory: [], // 待提经营类目
			submitting: false,
			source: ""
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
					let dataItem = {
						categoryId: cur.categoryIds.join(","),
						storeCategoryCompetencyApplyDTOList: [],
						storeCategoryBrandCompetencyApplyDTOList: []
					}
					if (cur.certificate.length > 0) {
						cur.certificate.forEach(cert => {
							if (cert.file) {
								dataItem.storeCategoryCompetencyApplyDTOList.push({
									categoryCompetencyId: cert.id,
									fileUrl: cert.file,
									expireTime: cert.expireTime,
									longterm: cert.longterm
								})
							} else {
								lack = true;
							}

						})
					}
					if (cur.brands.length > 0) {
						cur.brands.forEach(brand => {
							// dataItem.storeCategoryBrandCompetencyApplyDTOList.push({
							// 	brandId: brand.brandId,
							// 	enable: brand.enable,
							// 	longterm: brand.longterm,
							// 	endTime: brand.endTime,
							// 	competencyImg: brand.competencyImg,
							// })
						})
					}
					data.push(dataItem);
				})
				/*if (lack) {
					this.$u.toast("请上传全部所需资质再提交")
					this.submitting = false;
					return;
				}*/
				uni.showLoading({})
				applySupplierSecond(data).then(res => {
					uni.hideLoading();
					this.submitting = false;
					if (res.data.code == 200) {
						uni.navigateTo({
							url: '/pages/apply/supplier/preview'
						})
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
				console.log('this.curSelectedValue', this.curSelectedValue)
				// getCategoryCompetency({ categoryId: this.curSelectedValue[2] }).then(res => {''
				getCategoryCompetency({
					categoryId: this.curSelectedValue[this.curSelectedValue.length - 1]
				}).then(res => {
					if (res.data.code == 200) {
						let arrCertificate = res.data.result.competencies;
						if (!arrCertificate) {
							arrCertificate = [];
						} else {
							arrCertificate.forEach(itm => {
								itm.file = "";
								itm.expireTime = '';
								itm.longterm = false;
							})
						}
						let brands = [];
						res.data.result.brands.forEach(item => {
							brands.push({
								brandId: item.id,
								name: item.name,
								competencyImg: '',
								enable: item.enable,
								longterm: item.longterm,
								endTime: item.endTime
							})
						})
						that.curCategory.push({
							categoryTxt: [...that.curSelectedLabel].join("/"),
							categoryIds: [...that.curSelectedValue],
							certificate: arrCertificate,
							brands: brands
						})
						// 重置当前选中类目
						for (let i = 0; i < 2; i++) {
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
			let _this = this
			let eGroup = e.currentTarget.dataset.group
			let eThumb = e.currentTarget.dataset.thumb
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 从相册选择
				success: (res) => {
					uni.showLoading({
						title: "正在上传"
					})
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
							_this.curCategory[eGroup].certificate[eThumb].file = data
								.result
						},
					});

				}
			})
		},
		endTimeChange: function (e) {
			let _this = this
			let eGroup = e.currentTarget.dataset.group
			let eThumb = e.currentTarget.dataset.thumb
			_this.curCategory[eGroup].brands[eThumb].endTime = e.detail.value
		},
		endTimeChangeCategory: function (e) {
			let _this = this
			let eGroup = e.currentTarget.dataset.group
			let eThumb = e.currentTarget.dataset.thumb
			console.log(eGroup, eThumb, "eeq", _this.curCategory[eGroup].certificate[eThumb])
			_this.curCategory[eGroup].certificate[eThumb].expireTime = e.detail.value
		},
		// 上传品牌资质
		handlerUpBrandfile: function (e) {
			let _this = this
			let eGroup = e.currentTarget.dataset.group
			let eThumb = e.currentTarget.dataset.thumb
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 从相册选择
				success: (res) => {
					uni.showLoading({
						title: "正在上传"
					})
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
							_this.curCategory[eGroup].brands[eThumb].competencyImg = data
								.result
						},
					});

				}
			})
		},


		// 确定类目选择
		pickerChange: function (e) {
			this.curSelected = e.detail.value
			let curCategory1 = this.allCategory[this.curSelected[0]]
			let curCategory2 = curCategory1.children[this.curSelected[1]]
			// let curCategory3 = curCategory2.children[this.curSelected[2]]
			// this.curSelectedValue = [curCategory1.id, curCategory2.id, curCategory3.id]
			// this.curSelectedLabel = [curCategory1.name, curCategory2.name, curCategory3.name]
			this.curSelectedValue = curCategory2 ? [curCategory1.id, curCategory2.id] : [curCategory1.id];
			this.curSelectedLabel = curCategory2 ? [curCategory1.name, curCategory2.name] : [curCategory1.name,];
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
				_this.newCategory[1] = curSelectedCategory.children.map(o => {
					return o.name
				})
				// 加载备选3级别
				// _this.newCategory[2] = curSelectedCategory.children[0].children.map(o => { return o.name })
				// 默认选择下标0的2级
				_this.curSelected.splice(1, 1, 0)
				// 默认选择下标0的3级
				//_this.curSelected.splice(2, 1, 0)
			}
			// // 变更2级
			// if (e.detail.column === 1) {
			// 	_this.curSelected.splice(1, 1, curSelectedIndex)
			// 	let curSelectedCategory = _this.allCategory[_this.curSelected[0]]
			// 	_this.newCategory[2] = curSelectedCategory.children[curSelectedIndex].children.map(o => { return o.name })
			// 	// 默认选择下标0的3级
			// 	_this.curSelected.splice(2, 1, 0)
			// }
			// 变更3级
			// if (e.detail.column === 2) {
			// 	_this.curSelected.splice(2, 1, curSelectedIndex)
			// }
		},
		// 加载全部商品类目
		loadCategoryData: function () {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			// this.allCategory.push({ name: "加载中...", id: 0, children: [{ name: "加载中...", id: 0, children: [{ name: "加载中...", id: 0, children: [] }] }] })
			this.allCategory.push({
				name: "加载中...",
				id: 0,
				children: [{
					name: "加载中...",
					id: 0,
				}]
			})
			getCategoryIndexData().then(res => {
				uni.hideLoading();
				if (res.data.code == 200) {
					this.allCategory = res.data.result;
					// 初始选中经营类目
					this.initCurCategory()
					if (this.source == 'already') {
						uni.showLoading({
							title: '加载中...',
							mask: true
						});
						applySupplierSecondEcho().then(echoRes => {
							uni.hideLoading();
							if (echoRes.data.code == 200) {
								this.curCategory = [];
								let result = echoRes.data.result;
								result.forEach(item => {
									let certificates = [];
									item.storeCategoryCompetencyApplyDTOList.forEach(
										itm => {
											certificates.push({
												id: itm.categoryCompetencyId,
												name: itm
													.categoryCompetencyName,
												file: itm.fileUrl,
												expireTime: itm.expireTime,
												longterm: itm.longterm
											})
										})
									let brands = [];
									item.storeCategoryBrandCompetencyVOList.forEach(
										itm => {
											brands.push({
												brandId: itm.brandId,
												name: itm.name,
												longterm: itm.longterm,
												endTime: itm.endTime,
												competencyImg: itm
													.competencyImg ? itm
													.competencyImg : '',
												enable: itm.enable
											})
										})
									this.curCategory.push({
										categoryTxt: item.categoryName.split(",")
											.join("/"),
										categoryIds: item.categoryId.split(","),
										certificate: certificates,
										brands: brands
									});
								})
							} else {
								this.$u.toast(echoRes.data.message);
							}
						}).catch(() => {
							uni.hideLoading();
						})
					}
				} else {
					this.$u.toast(res.data.message);
				}
			}).catch(err => {
				this.$u.toast('请求超时，请稍后重试');
			})

		},

		// 初始选中经营类目
		initCurCategory: function () {
			this.newCategory[0] = this.allCategory.map(o => {
				return o.name
			})
			this.newCategory[1] = this.allCategory[0].children.map(o => {
				return o.name
			})
			//this.newCategory[2] = this.allCategory[0].children[0].children.map(o => { return o.name })
		},
	},
	onLoad: function (options) {
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