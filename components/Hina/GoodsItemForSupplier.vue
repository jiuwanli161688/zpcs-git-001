<template>
	<view class="cpn" @tap="handlerDetail">
		<view class="bd">
			<view class="icon" :style="{ background: 'url(' + goods.original + ')' }"></view>
			<view class="info">
				<view class="tit">{{ goods.goodsName }}</view>
				<!-- <view class="num">
					<view class="lab lab-retail">销售价</view>
					<view class="rmb">{{ goods.price | unitPrice }}</view>
				</view> -->
			</view>
		</view>
		<view class="ft" v-if="!goods.delete">
			<view class="link-item link-common" v-if="goods.authFlag == 'PASS'" @tap.stop="handlerState">
				{{ goods.marketEnable == 'UPPER' ? '下架' : '上架' }}</view>
			<view class="link-item link-primary" @tap.stop="handlerDelete">删除</view>
			<view class="link-item link-secondary" @tap.stop="handlerStock">库存</view>
			<view class="link-item link-secondary" @tap.stop="handlerPrice">价格</view>
		</view>
	</view>
</template>

<script>

import { storeGoodsDelete, storeGoodsUnder, storeGoodsUp } from "../../api/store";

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
		}
	},
	data() {
		return {
			isComplete: false,

		}
	},
	methods: {
		// 触发详情
		handlerDetail: function (e) {
			if (this.goods.delete) {
				return;
			}
			this.$emit('detail', { index: this.$props.index })
		},

		// 触发上架下架
		handlerState: function (e) {
			let that = this;
			uni.showLoading({})
			if (this.goods.marketEnable == 'UPPER') {
				//下架
				storeGoodsUnder({ goodsId: this.goods.id }).then(res => {
					uni.hideLoading();
					if (res.data.code == 200) {
						this.goods.marketEnable = 'DOWN';
						this.$u.toast("操作成功");
					} else {
						that.$u.toast(res.data.message);
					}
				})
			} else {
				//上架
				storeGoodsUp({ goodsId: this.goods.id }).then(res => {
					uni.hideLoading();
					if (res.data.code == 200) {
						this.goods.marketEnable = 'UPPER';
						this.$u.toast("操作成功");
					} else {
						that.$u.toast(res.data.message);
					}
				})
			}
		},

		// 触发删除
		handlerDelete: function (e) {
			let that = this;
			uni.showModal({
				title: '确认删除吗？',
				success(res) {
					if (res.confirm) {
						storeGoodsDelete({ goodsId: that.goods.id }).then(res => {
							if (res.data.code == 200) {
								that.goods.goodsName = "已删除"
								that.goods.delete = true
								that.$emit('delete', { index: that.index });
							} else {
								that.$u.toast(res.data.message);
							}
						})
					}
				}
			})
		},

		// 触发库存
		handlerStock: function (e) {
			this.$emit('stock', { index: this.$props.index })
		},

		// 触发价格
		handlerPrice: function (e) {
			this.$emit('price', { index: this.$props.index })
		},
	}
}
</script>

<style lang="scss" scoped>
.cpn {
	background: #FFF;
	border-radius: 12rpx;
	padding: 0 20rpx;

	.bd {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 20rpx 0;
		position: relative;

		.icon {
			width: 160rpx;
			height: 160rpx;
			background-size: cover !important;
			background-position: 50% 50% !important;
		}

		.info {
			width: calc(100vw - 40rpx - 40rpx - 160rpx - 20rpx);
			height: 160rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			box-sizing: border-box;

			.tit {
				height: 72rpx;
				line-height: 36rpx;
				font-size: 28rpx;
				color: #333;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.num {
				display: flex;
				justify-content: flex-start;
				align-items: center;

				.lab {
					color: #FFF;
					font-size: 24rpx;
					padding: 4rpx 6rpx;
					border-radius: 6rpx;
					margin: 0 12rpx 0 0;
				}

				.lab-origin {
					background: #FF9B4D;
				}

				.lab-retail {
					background: #E22221;
				}

				.rmb {
					color: #E22221;
				}
			}
		}
	}

	.ft {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 96rpx;
		position: relative;

		&::after {
			position: absolute;
			content: '';
			left: 0;
			right: 0;
			top: 0;
			height: 3rpx;
			background: #E7E7E7;
		}

		.link-item {
			border: 3rpx solid #DCDEE0;
			min-width: 120rpx;
			height: 64rpx;
			border-radius: 12rpx;
			line-height: 64rpx;
			font-size: 26rpx;
			color: #323232;
			text-align: center;
			margin: 0 0 0 16rpx;
		}

		.link-primary {
			border: 3rpx solid #EE0A24;
			color: #EE0A24;
		}

		.link-secondary {
			border: 3rpx solid #FF9B4D;
			color: #FF9B4D;
		}

		.link-common {
			border: 3rpx solid #BBBBBB;
			color: #333;
		}
	}
}
</style>
