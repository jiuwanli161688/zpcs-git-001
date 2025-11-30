<template>
	<view class="container">
		<!-- 商品信息 -->
		<view class="wrap-alone" v-if="isComplete">
			<view class="bd">
				<view class="icon" :style="{ background: 'url(' + goods.image + ')' }"></view>
				<view class="base">
					<view class="txt">{{ goods.goodsName }}</view>
					<view class="sku">
						<text class="sku-item" v-for="(sku, s) in goods.sku" :key="s">{{ sku.skuName }}</text>
					</view>
					<view class="inf">
						<view class="price">￥{{ goods.goodsPrice | unitPrice }}</view>
						<view class="count">×{{ goods.num }}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="wrap-handler" v-if="isComplete">
			<view class="wrap">
				<view class="rs-flex">
					<view class="lab">售后类型</view>
					<view class="inf chk">
						<view class="chk-item" :class="{ 'chk-item_hov': index == curTypeIndex }"
							v-for="(item, index) in arrType" :key="index" :data-index="index" @tap="handlerChangeType">
							<view class="text">{{ item.label }}</view>
							<view class="icon" :style="{ background: 'url(' + iconCheck + ')' }"
								v-if="index == curTypeIndex"></view>
						</view>
					</view>
				</view>

				<view class="rs-flex rs-line">
					<view class="lab">申请原因</view>
					<view class="inf">
						<picker mode="selector" @change="bindPickerReason" :value="curReasonIndex" :range="arrReason"
							range-key="label">
							<view class="in-picker" :class="{ 'in-picker_place': curReasonLabel.length < 0 }">{{
								curReasonLabel.length == 0 ? '请选择' : curReasonLabel }}</view>
						</picker>
					</view>
				</view>
				<view class="rs-flex rs-line">
					<view class="lab">申请数量</view>
					<view class="inf" style="display: flex; justify-content: flex-end; align-items: center;">
						<view class="">
							<u-number-box :min="1" :max="goods.num" v-model="form.num" @change="changeValue" />
						</view>
					</view>
				</view>
				<view class="rs-flex rs-line" v-if="form.serviceType == 'RETURN_GOODS'">
					<view class="lab">退款方式</view>
					<view class="inf">
						<view class="in-flex">
							<view class="txt">原路退回</view>
						</view>
					</view>
				</view>
				<view class="rs-flex rs-line" v-if="form.serviceType == 'RETURN_GOODS'">
					<view class="lab">退款金额</view>
					<view class="inf">
						<view class="in-flex">
							<view class="num">￥{{ expectRefundPrice }}元，{{ expectRefundPoints }}积分</view>
							<view class="txt">，以实际情况为准</view>
						</view>
					</view>
				</view>
				<view class="rs-name">问题描述：</view>
				<view class="rs-area">
					<textarea placeholder="请输入" class="i-area" v-model="form.problemDesc" />
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
import { getAfterSaleReason, applyReturn, getGoodsDetail, getSalesRefund } from "@/api/after-sale";
import storage from "@/utils/storage.js";
import { upload } from "@/api/common.js";
import ykAuthpup from "@/components/yk-authpup/yk-authpup";

export default {
	name: '',
	components: {
		ykAuthpup
	},
	data() {
		return {
			isComplete: false,
			iconCamera: `${this.iconCommon}/static/v1/common/icon-camera.png`,
			iconCheck: `${this.iconCommon}/static/v1/common/icon-checked.png`,
			iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,
			iconFailed: `${this.iconCommon}/static/v1/common/icon-fail.png`,
			arrThumb: [''],

			goods: {},

			arrType: [
				{ label: '退货', value: 'RETURN_GOODS' },
				{ label: '换货', value: 'EXCHANGE_GOODS' }
			],
			curTypeIndex: 0,
			curTypeLabel: '退货',

			arrReason: [],
			curReasonIndex: null,
			curReasonLabel: '',
			orderSn: '', // 订单编号
			isCanSubmit: true,//默认可点击
			form: {
				serviceType: 'RETURN_GOODS'
			},
			expectRefundPrice: 0,// 计算出的退款金额
			expectRefundPoints: 0,// 计算出的退款积分
		}
	},
	methods: {
		// 计算退款金额
		changeValue(e) {
			let value = e.value;
			// 使用正则表达式匹配以0开头的数字，并去掉开头的0
			let zero = /^0+(\d+)$/;
			if (typeof value === 'string' && value.match(zero)) {
				this.$nextTick(() => {
					this.form.num = value.replace(zero, '$1');
				})
			}
			if (value > this.goods.num) {
				this.$u.toast(`您的最大退款数量为${this.goods.num}`)
				return
			}
			// 计算单个实付（总实付/商品数量）
			let refundPrice = 0
			if (this.goods.num > 0) {
				refundPrice = this.goods.expectRefundPrice / this.goods.num
				refundPrice.toFixed(2);
			}
			// 计算单个积分
			let refundPoints = 0
			if (this.goods.num > 0) {
				refundPoints = this.goods.expectRefundPoints / this.goods.num
			}
			// 计算金额和积分
			if (value > 0 && value <= this.goods.num) {
				getSalesRefund(this.goodsSn, value).then(res => {
					if (res.data.success) {
						this.expectRefundPrice = res.data.result.returnMoney;
						this.expectRefundPoints = res.data.result.returnPoint;
					}
				})
			}
			if (value == 0) {
				this.expectRefundPrice = 0
				this.expectRefundPoints = 0
			}
		},
		// 选择售后类型
		handlerChangeType: function (e) {
			let eIndex = parseInt(e.currentTarget.dataset.index)
			this.curTypeIndex = eIndex
			this.curTypeLabel = this.arrType[this.curTypeIndex].label
			this.form.serviceType = this.arrType[this.curTypeIndex].value
		},
		/**
		* 获取申请原因
		*/
		getReasonList() {
			getAfterSaleReason().then((res) => {
				if (res.data.success) {
					res.data.result.forEach(item => {
						this.arrReason.push({ label: item.reason, value: item.id })
					});
				}
			});
		},
		// 选择申请原因
		bindPickerReason: function (e) {
			this.curReasonIndex = e.detail.value
			this.curReasonLabel = this.arrReason[this.curReasonIndex].label
			this.form.reasonId = this.arrReason[this.curReasonIndex].value
		},

		// 加载商品信息
		loadBaseData: function () {
			getGoodsDetail(this.goodsSn).then((res) => {
				if (res.data.success) {
					if (this.$store.state.isShowToast) { uni.hideLoading() };
					this.isComplete = true
					this.goods = res.data.result;
					this.form.goodsId = this.goods.goodsId
					this.form.skuId = this.goods.skuId
					this.form.num = 1
					this.changeValue({ value: this.form.num.toString() })
				}
			});

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
		// 提交售后
		handlerSubmit() {
			let form = this.form
			if (!form.serviceType) {
				this.$u.toast('请选择售后类型')
				return
			}
			if (!form.reasonId) {
				this.$u.toast('请选择申请原因')
				return
			}
			if (!form.num) {
				this.$u.toast('请输入申请数量')
				return
			}
			if (form.num > this.goods.num) {
				this.$u.toast('申请数量不能大于购买数量')
				return
			}
			// if (!form.problemDesc) {
			// 	this.$u.toast('请输入问题描述')
			// 	return
			// }
			if (!this.isCanSubmit) return
			this.isCanSubmit = false
			form.images = this.arrThumb.join(',').slice(0, -1)
			applyReturn(this.goods.sn, form).then((res) => {
				if (res.data.success) {
					this.$u.toast('提交成功')
					uni.redirectTo({
						url: '/pages/profile/afterSales/detail?afterSaleSn=' + res.data.result.sn
					})
					// uni.navigateBack()
				}
				this.isCanSubmit = true
			})
		},
		deleteImage(index) {
			this.arrThumb.splice(index, 1)
		}
	},
	onLoad: function (options) {
		this.orderSn = options.orderSn
		this.goodsSn = options.goodsSn

		// 加载拒绝原因
		this.getReasonList()
		// 加载订单信息
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
	.rs-flex{
		.lab{
			white-space: nowrap;
		}
	}
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
}
</style>