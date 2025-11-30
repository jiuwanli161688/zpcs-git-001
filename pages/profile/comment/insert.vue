<template>
	<view class="container">
		<view class="goods-list" v-if="isComplete">
			<view class="goods-item" v-for="(goodsObj, goodsIdx) in arrGoods" :key="goodsIdx">
				<!-- 商品信息 -->
				<view class="wrap-alone">
					<view class="bd">
						<view class="icon" :style="{ background: 'url(' + goodsObj.image + ')' }"></view>
						<view class="base">
							<view class="txt">{{ goodsObj.goodsName }}</view>
							<view class="sku">
								<text class="sku-item">{{ goodsObj.simpleSpecs }}</text>
							</view>
							<view class="inf">
								<view class="price">￥{{ goodsObj.price | unitPrice }}</view>
								<view class="count">×{{ goodsObj.num }}</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 评价表单 -->
				<view class="wrap-handler">
					<view class="wrap">
						<view class="rs-flex">
							<view class="lab">总体评价</view>
							<view class="inf chk">
								<view class="chk-item" :class="{ 'chk-item_hov': item.value == goodsObj.grade }"
									v-for="(item, index) in arrGrade" :key="index" :data-goods="goodsIdx"
									:data-grade="item.value" @tap="handlerChangeGrade">
									<view class="text">{{ item.label }}</view>
									<view class="icon" :style="{ background: 'url(' + iconCheck + ')' }"
										v-if="item.value == goodsObj.grade"></view>
								</view>
							</view>
						</view>
						<view class="rs-name">商品评价：</view>
						<view class="rs-area">
							<textarea placeholder="请输入" v-model="goodsObj.content" class="i-area" />
						</view>
						<view class="rs-tips">
							<image :src="iconTips" mode="aspectFit" class="icon"></image>
							<view class="text">有图有真相，建议您上传相关证明图片</view>
						</view>
						<view class="rs-file">
							<view class="item" v-for="(item, index) in goodsObj.arrThumb" :key="index" :data-thumb="index"
								:data-goods="goodsIdx" @tap="handlerUpfile">
								<view class="thumb">
									<image class="pic" mode="aspectFill" :src="item"></image>
									<image class="del-image" @tap="deleteImage(index)" @tap.stop v-if="item.length > 0"
										:src="iconFailed"></image>
								</view>
							</view>
							<view class="item" v-if="goodsObj.arrThumb.length < 9" :data-thumb="-1" :data-goods="goodsIdx"
								@tap="handlerUpfile">
								<view class="thumb">
									<image class="ico" mode="aspectFit" :src="iconCamera"></image>
								</view>
							</view>
						</view>
						<!-- 判断下是否通过审核，为通过时显示tips -->
						<view v-if="goodsObj.rejectionReason && goodsObj.auditStatusImpl == 'REJECTED'" class="tips">{{
							goodsObj.rejectionReason }}
						</view>
					</view>
				</view>
			</view>

		</view>

		<view class="goods-rate">
			<view class="name">本次购物体验</view>
			<view class="rate">
				<view class="rate-line">
					<view class="txt">商品质量</view>
					<view class="ico">
						<view class="star" v-for="(item, index) in arrScoreDescription" :data-index="index"
							@tap="handlerChangeDescription" :key="index">
							<image class="light" :src="item == 1 ? iconStarHov : iconStar" mode="aspectFit"></image>
						</view>
					</view>
					<view class="val">{{ intScoreDescription }}</view>
				</view>
				<view class="rate-line">
					<view class="txt">物流履约</view>
					<view class="ico">
						<view class="star" v-for="(item, index) in arrScoreDelivery" :data-index="index"
							@tap="handlerChangeStarDelivery" :key="index">
							<image class="light" :src="item == 1 ? iconStarHov : iconStar" mode="aspectFit"></image>
						</view>
					</view>
					<view class="val">{{ intScoreDelivery }}</view>
				</view>
				<view class="rate-line">
					<view class="txt">商家服务</view>
					<view class="ico">
						<view class="star" v-for="(item, index) in arrScoreService" :data-index="index"
							@tap="handlerChangeStarService" :key="index">
							<image class="light" :src="item == 1 ? iconStarHov : iconStar" mode="aspectFit"></image>
						</view>
					</view>
					<view class="val">{{ intScoreService }}</view>
				</view>
			</view>
			<view class="lnk-common lnk-primary" @tap="handlerSubmit">提交评价</view>
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
import { evaluationAdd, getOrderGoods, getMemberEvaluation, batchUpdate } from "@/api/members.js";

export default {
	name: "",
	components: {
		ykAuthpup
	},
	computed: {
		arrScoreDescription: function () {
			let tempArr = [1, 1, 1, 1, 1]
			for (let i = 0; i < 5; i++) {
				tempArr[i] = this.intScoreDescription > i ? 1 : 0
			}
			return tempArr
		},
		arrScoreDelivery: function () {
			let tempArr = [1, 1, 1, 1, 1]
			for (let i = 0; i < 5; i++) {
				tempArr[i] = this.intScoreDelivery > i ? 1 : 0
			}
			return tempArr
		},
		arrScoreService: function () {
			let tempArr = [1, 1, 1, 1, 1]
			for (let i = 0; i < 5; i++) {
				tempArr[i] = this.intScoreService > i ? 1 : 0
			}
			return tempArr
		},
	},
	data() {
		return {
			isComplete: false,
			iconCamera: `${this.iconCommon}/static/v1/common/icon-camera.png`,
			iconCheck: `${this.iconCommon}/static/v1/common/icon-checked.png`,
			iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,
			iconStar: `${this.iconCommon}/static/v1/common/icon-star.png`,
			iconStarHov: `${this.iconCommon}/static/v1/common/icon-star_hov.png`,
			iconFailed: `${this.iconCommon}/static/v1/common/icon-fail.png`,

			arrGrade: [
				{ label: '好评', value: 'GOOD' },
				{ label: '中评', value: 'MODERATE' },
				{ label: '差评', value: 'WORSE' }
			],

			intScoreDescription: 5,
			intScoreDelivery: 5,
			intScoreService: 5,

			arrGoods: [{
				arrThumb: [],
			}
			],
			arrImage: [],
			isCanSubmit: true,//默认可点击
			orderSn: '',// 订单编号
			type: 'add', // 是编辑还是修改

		}
	},
	methods: {
		handlerChangeGrade: function (e) {
			let eGoods = parseInt(e.currentTarget.dataset.goods)
			let eGrade = e.currentTarget.dataset.grade
			this.arrGoods[eGoods].grade = eGrade
		},

		handlerChangeDescription: function (e) {
			let eIndex = parseInt(e.currentTarget.dataset.index)
			this.intScoreDescription = eIndex + 1
		},
		handlerChangeStarDelivery: function (e) {
			let eIndex = parseInt(e.currentTarget.dataset.index)
			this.intScoreDelivery = eIndex + 1
		},
		handlerChangeStarService: function (e) {
			let eIndex = parseInt(e.currentTarget.dataset.index)
			this.intScoreService = eIndex + 1
		},

		handlerUpfile: function (e) {
			// #ifdef APP-PLUS
			if (plus.os.name == 'Android') {
				this.$refs['authpupCamera'].open(); // 调起相机权限目的弹框
			}
			// #endif
			let eGoods = parseInt(e.currentTarget.dataset.goods)
			let eThumb = parseInt(e.currentTarget.dataset.thumb)

			let _this = this
			let num = 9 - this.arrGoods[eGoods].arrThumb.length
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
									_this.arrGoods[eGoods].arrThumb.push(data.result)
									_this.arrImage = _this.arrGoods[eGoods].arrThumb
								} else {
									_this.arrGoods[eGoods].arrThumb.splice(eThumb, 1, data.result)
									_this.arrImage = _this.arrGoods[eGoods].arrThumb
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
		// 提交评价
		handlerSubmit() {
			// 判断this.arrGoods数组中的content属性是否都不为空
			const isContentNotEmpty = this.arrGoods.every(item => item.content !== '');
			if (!isContentNotEmpty) {
				// 如果有至少一个content为空
				this.$Message.warning('评价内容不能为空')
				return
			}
			if (!this.isCanSubmit) return
			this.isCanSubmit = false
			let commentList = []
			this.arrGoods.forEach(item => {
				commentList.push({
					orderItemSn: item.orderItemSn,
					goodsId: item.goodsId,
					skuId: item.skuId,
					grade: item.grade,
					content: item.content,
					id: this.type == 'update' ? item.id : undefined,
					images: item.arrThumb.join(',')
				})
			});
			let params = {
				deliveryScore: this.intScoreDelivery,
				serviceScore: this.intScoreService,
				descriptionScore: this.intScoreDescription,
				memberEvaluationNotScoreDTOList: commentList
			}

			let methods = evaluationAdd
			if (this.type == 'add') {
				methods = evaluationAdd
			} else {
				methods = batchUpdate
			}
			methods(params).then((res) => {
				if (res.data.success) {
					this.$u.toast('提交成功')
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)
				}
				this.isCanSubmit = true
			})
		},
		// 加载商品
		loadBaseData: function () {
			getOrderGoods(this.orderSn).then((res) => {
				if (res.data.success) {
					this.isComplete = true
					this.arrGoods = res.data.result.map(item => ({ ...item, arrThumb: [], grade: 'GOOD' }));
					let arr = this.arrGoods.map((item, index) => {
						return item.arrThumb[index]
					})
					this.arrImage = arr;
				}
			});
		},
		// 加载评价详情
		loadCommentData() {
			getMemberEvaluation(this.orderSn).then((res) => {
				if (res.data.success) {
					if (this.$store.state.isShowToast) { uni.hideLoading() };
					this.isComplete = true
					this.arrGoods = res.data.result.memberEvaluationNotScoreVOList;
					this.intScoreDescription = res.data.result.descriptionScore
					this.intScoreDelivery = res.data.result.deliveryScore
					this.intScoreService = res.data.result.serviceScore
					this.arrGoods.forEach(item => {
						// 处理评价图片
						if (item.images) {
							this.$set(item, 'arrThumb', item.images.split(','))
						} else {
							this.$set(item, 'arrThumb', []);
						}
						// 处理某些字段与新增时加载商品的字段不同
						item.image = item.goodsImage
					});

				}
			});
		},
		deleteImage(index) {
			this.arrImage.splice(index, 1)
		}
	},
	onLoad: function (options) {
		this.orderSn = options.orderSn
		this.type = options.type
		if (this.type == 'add') {
			this.loadBaseData()
		} else {
			this.loadCommentData()
		}

	},
	onShow: function () {

	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;

	.goods-list {
		.goods-item {
			margin: 0 0 20rpx;

			&:last-of-type {
				margin: 0;
			}

			.wrap-alone {
				.bd {
					position: relative;

					&::after {
						position: absolute;
						content: '';
						left: 0;
						right: 0;
						bottom: 0;
						height: 3rpx;
						background: #F1F1F1;
					}
				}
			}

			.wrap-handler {
				margin: 0;

				.wrap {
					padding: 0;

					.tips {
						margin: 20rpx 0 0;
						background: rgba(252, 141, 0, 0.1);
						font-size: 26rpx;
						color: #FC8D00;
						padding: 20rpx;
					}
				}

				.rs-file {

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
		}
	}

	.goods-rate {
		background: #FFF;
		padding: 0 20rpx 20rpx;
		margin: 20rpx 0 0;

		.name {
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 88rpx;
			color: #333;
			font-size: 28rpx;
			font-weight: 600;
			position: relative;
		}

		.rate {
			.rate-line {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				height: 60rpx;

				.txt {
					font-size: 26rpx;
					color: #333;
				}

				.val {
					font-size: 26rpx;
					color: #999;
				}

				.ico {
					display: flex;
					justify-content: flex-end;
					align-items: center;
					margin: 0 16rpx;
					width: 240rpx;
					height: 48rpx;

					.star {
						width: 48rpx;
						height: 48rpx;
						display: flex;
						justify-content: center;
						align-items: center;

						.light {
							width: 32rpx;
							height: 32rpx;
						}
					}
				}
			}
		}
	}
}
</style>