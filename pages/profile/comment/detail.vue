<template>
	<view class="container">
		<view class="goods-list" v-if="isComplete">
			<view class="goods-item" v-for="(goodsObj, goodsIdx) in arrGoods" :key="goodsIdx">
				<!-- 审核中显示 -->
				<view v-if="goodsObj.auditStatusImpl == 'PENDING' || goodsObj.auditStatusImpl == 'FIRST_APPROVED'" class="tips">评价正在审核中...</view>
				<!-- 商品信息 -->
				<view class="wrap-alone">
					<view class="bd">
						<view class="icon" :style="{ background: 'url(' + goodsObj.goodsImage + ')' }"></view>
						<view class="base">
							<view class="txt">{{ goodsObj.goodsName }}</view>
							<view class="sku">
								<text class="sku-item">{{ goodsObj.simpleSpecs }}</text>
							</view>
							<view class="inf">
								<view class="price">￥{{ goodsObj.unitPrice | unitPrice }}</view>
								<view class="count">×{{ goodsObj.num }}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="wrap-service">
					<view class="info">
						<view class="rs">
							<view class="lab">总体评价</view>
							<view class="inf">
								<view class="txt">{{ getGrade(goodsObj.grade) }}</view>
							</view>
						</view>
						<view class="rs evaluate">
							<view class="lab">商品评价</view>
							<view class="inf">
								<view class="txt">{{ goodsObj.content }}</view>
							</view>
						</view>
						<view class="rs">
							<view class="lab">评价晒图</view>
						</view>
						<view class="ic">
							<view class="ic-item" v-for="(item, index) in goodsObj.images" :key="index" v-if="item">
								<image class="ico" :src="item" mode="aspectFill" @tap="preview(goodsObj.images, index)">
								</image>
							</view>
						</view>
					</view>
					<!-- 判断下是否通过审核，为通过时显示tips -->
					<view v-if="goodsObj.auditStatusImpl == 'REJECTED'" class="tips">{{ goodsObj.rejectionReason }}
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
							:key="index">
							<image class="light" :src="item == 1 ? iconStarHov : iconStar" mode="aspectFit"></image>
						</view>
					</view>
					<view class="val">{{ intScoreDescription }}</view>
				</view>
				<view class="rate-line">
					<view class="txt">物流履约</view>
					<view class="ico">
						<view class="star" v-for="(item, index) in arrScoreDelivery" :data-index="index" :key="index">
							<image class="light" :src="item == 1 ? iconStarHov : iconStar" mode="aspectFit"></image>
						</view>
					</view>
					<view class="val">{{ intScoreDelivery }}</view>
				</view>
				<view class="rate-line">
					<view class="txt">商家服务</view>
					<view class="ico">
						<view class="star" v-for="(item, index) in arrScoreService" :data-index="index" :key="index">
							<image class="light" :src="item == 1 ? iconStarHov : iconStar" mode="aspectFit"></image>
						</view>
					</view>
					<view class="val">{{ intScoreService }}</view>
				</view>
			</view>
		</view>
		<view style="margin: 24rpx;" class="lnk-common lnk-primary" v-if="auditStatus == 'REJECTED'" @tap="handlerUpdateComment">修改评价</view>
	</view>
</template>

<script>
import { getMemberEvaluation } from "@/api/members.js";


export default {
	name: "",
	components: {

	},

	data() {
		return {
			isComplete: false,
			iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,
			iconStar: `${this.iconCommon}/static/v1/common/icon-star.png`,
			iconStarHov: `${this.iconCommon}/static/v1/common/icon-star_hov.png`,

			intScoreDescription: 5,
			intScoreDelivery: 5,
			intScoreService: 5,
			auditStatus:'',// 审核状态
			arrGoods: [],
			orderSn: '', // 订单编号
		}
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
		getGrade() {
			return (grade) => {
				const gradeText = {
					'GOOD': '好评',
					'MODERATE': '中评',
					'WORSE': '差评'
				}
				return gradeText[grade] || ''
			}
		}
	},
	methods: {
		/**
		 * 点击图片放大或保存
		 */
		preview(urls, index) {
			uni.previewImage({
				current: index,
				urls: urls,
				longPressActions: {
					itemList: ["保存图片"],
					success: function (data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function (err) {
						console.log(err.errMsg);
					},
				},
			});
		},
		loadBaseData: function () {
			getMemberEvaluation(this.orderSn).then((res) => {
				if (res.data.success) {
					if (this.$store.state.isShowToast) { uni.hideLoading() };
					this.isComplete = true
					this.arrGoods = res.data.result.memberEvaluationNotScoreVOList;
					this.intScoreDescription = res.data.result.descriptionScore
					this.intScoreDelivery = res.data.result.deliveryScore
					this.intScoreService = res.data.result.serviceScore
					this.auditStatus = res.data.result.auditStatus
					this.arrGoods.forEach(item => {
						item.images = item.images.split(",")
					});
				}
			});
		},
		// 跳转修改评价页面
		handlerUpdateComment(){
			uni.navigateTo({
				url: '/pages/profile/comment/insert?orderSn=' + this.orderSn + '&type=update'
			})
		}
	},
	onLoad: function (options) {
		this.orderSn = options.orderSn
	},
	onShow: function () {
		this.loadBaseData()
	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;

	.wrap-tips {
		.icon {}

		.text {}
	}

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
			.tips {
					margin: 20rpx 0 0;
					background: rgba(252, 141, 0, 0.1);
					font-size: 26rpx;
					color: #FC8D00;
					padding: 20rpx;
				}
			.wrap-service {
				margin: 0;
				.info {

					.evaluate {
						display: block;

						.inf {

							.txt {

								word-wrap: break-word;
							}
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