<template>
	<view class="cpn" :class="{ 'cpn-mini': isEdit }">
		<view class="edit" v-if="isEdit">
			<image class="ico" :src="isCheck ? iconCheckHov : iconCheck" mode="aspectFit" @tap="handlerCheck"></image>
		</view>
		<view class="icon" :style="{ background: 'url(' + goods.icon + ')' }" @tap.stop="navigateToDetail(goods)">
			<view class="lose" v-if="goods.marketEnable == 'DOWN'">已失效</view>
		</view>
		<view class="info" @tap.stop="navigateToDetail(goods)">
			<view class="title">{{ goods.goodsName }}</view>
			<view class="price">
				<view class="num">￥{{ goods.price }}</view>
				<image @tap.stop="addCart(goods)" class="ico" :src="iconCart" mode="aspectFit" v-if="!isEdit"></image>
			</view>
		</view>
	</view>
</template>

<script>
// 编辑模式：不显示购物车、显示复选框
export default {
	name: '',
	components: {

	},
	props: {
		goods: {
			type: Object,
			default: () => { }
		},
		index: {
			type: Number,
			default: 0
		},
		isEdit: {
			type: Boolean,
			default: false
		},
		isCheck: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isComplete: false,
			iconCart: `${this.iconCommon}/static/v1/profile/icon-cart.png`,
			iconCheck: `${this.iconCommon}/static/v1/common/icon-check.png`,
			iconCheckHov: `${this.iconCommon}/static/v1/common/icon-check_hov.png`,
		}
	},
	methods: {
		// 添加购物车
		addCart(goods) {
			if (goods.marketEnable == 'UPPER') {
				uni.navigateTo({
					url: "/pages/product/goods?id=" + goods.skuId + "&goodsId=" + goods.goodsId + "&isShowPopup=true",
				});
			} else {
				uni.showToast({
					title: '该商品已失效，看看其他商品吧~',
					duration: 2000,
					icon: "none",
				});
			}
		},
		/**
		 * 跳转详情
		 */
		navigateToDetail(goods) {
			uni.navigateTo({
				url: "/pages/product/goods?id=" + goods.skuId + "&goodsId=" + goods.goodsId,
			});
		},
		// 点选商品
		handlerCheck: function (e) {
			this.$emit('checked', { index: this.$props.index })
		},
	},
	onLoad: function () {

	},
	onShow: function () {

	}
}
</script>

<style lang="scss" scoped>
.cpn {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 0 0 0 20rpx;

	.edit {
		width: 80rpx;
		height: 160rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		.ico {
			width: 32rpx;
			height: 32rpx;
		}
	}

	.icon {
		width: 160rpx;
		height: 160rpx;
		background-size: cover !important;
		background-position: 50% 50% !important;
		position: relative;

		.lose {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.5);
			/* 半透明黑色 */
			color: #fff;
			/* 文字颜色 */
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 14px;
			z-index: 1;
			/* 确保蒙层在商品图标上方 */
			color: #E22221;
		}
	}

	.info {
		width: calc(100vw - 160rpx - 20rpx);
		height: 160rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0 20rpx;

		.title {
			height: 72rpx;
			line-height: 36rpx;
			font-size: 28rpx;
			color: #333;
			word-break: break-all;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}

		.price {
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 48rpx;

			.num {
				color: #E22221;
				font-size: 28rpx;
				font-weight: 600;
			}

			.ico {
				width: 36rpx;
				height: 36rpx;
			}
		}
	}

	.info-mini {
		width: calc(100vw - 160rpx - 20rpx - 80rpx) !important;
	}
}

.cpn-mini {
	padding: 0 !important;
}
</style>
