<template>
	<view class="cpn">
		<view class="icon-wrapper" @tap="recommendGoodClick(goods.id, goods.goodsId)">
			<image class="icon" :src="goods.icon" mode="aspectFill"></image>
			<!-- 售罄蒙层 -->
			<view v-if="isSoldOut" class="sold-out-overlay"></view>
			<!-- 售罄图标 -->
			<view v-if="isSoldOut" class="sold-out-icon">
				<image :src="iconSoldOut" mode="aspectFit" class="sold-out-img"></image>
			</view>
		</view>
		<text class="name" @tap="recommendGoodClick(goods.id, goods.goodsId)">{{goods.name}}</text>
		<view class="info">
			<view class="text" @tap="recommendGoodClick(goods.id, goods.goodsId)">
				<text class="txt">￥</text>
				<text class="num">{{goods.integer}}</text>
				<text class="dot">.{{goods.decimal}}</text>
				<text class="sell">{{goods.buyCount}}人购买</text>
			</view>
			<view class="link" @tap="choiceCrtGoodsEve" :class="{ 'disabled': isSoldOut }">
				<u-icon name="plus-circle-fill" :color="isSoldOut ? '#999' : '#E2282F'" size="36"></u-icon>
			</view>
		</view>

		<!-- 商品规格  商品详情，以及默认参与活动的id-->
		<popupGoods :addr="delivery" ref="popupGoods" @changed="changedGoods" @closeBuy="closePopupBuy"
		  @queryCart="cartCount()" :goodsDetail="goodsDetail" :goodsSpec="goodsSpec" :isGroup="isGroup" :id="goods.id"
		  v-if="goodsDetail.id" :pointDetail="pointDetail" :wholesaleList="wholesaleList" @handleClickSku="selectSku"
		  :buyMask="buyMask" />
	</view>
</template>

<script>
import popupGoods from "@/components/m-buy/goods"; //购物车商品的模块
import * as API_trade from "@/api/trade.js";
import { getGoods, getGoodsList, getMpScene, getGoodsDistribution } from "@/api/goods.js";
import storage from "@/utils/storage.js";

export default{
	name: 'NvueGoodsItem',
	components: {
		popupGoods
	},
	props: {
		goods: {
			type: Object,
			default: () => {}
		},
		goodsCurrentFloor: {
			type: Number,
			default: null,
		},
	},
	data(){
		return {
			isComplete: false,
			iconCart: `${this.iconCommon}/static/v1/home/icon-cart.png`,
			source: '', // 类型
			buyMask: false, //添加购物车直接购买，查看已选 弹窗
			goodsDetail: {}, //商品数据
			goodsSpec: "", //规格数据
			takeDownFromSale: false, // 下架销售状态
			selectedGoods: "", //选择的商品规格昵称
			nums: 0, // 购物车数量
			isGroup: false, // 是否是拼团活动
			pointDetail: "", // 是否是积分商品
			wholesaleList: [],
			delivery: "",
			iconSoldOut: `${this.iconCommon}/static/region/sold-out.png`,

		}
	},
	computed: {
		// 判断商品是否已售罄
		isSoldOut() {
			// 优先使用 goods.quantity，如果没有则使用 goods.stock
			const stock = this.goods.quantity !== undefined ? this.goods.quantity : this.goods.stock;
			return stock === 0 || stock === '0';
		}
	},
	methods: {
		choiceCrtGoodsEve(e) {
			// 如果商品已售罄，不允许添加到购物车
			if (this.isSoldOut) {
				uni.showToast({
					title: '商品已售罄',
					icon: 'none',
					duration: 2000
				});
				return;
			}

			this.source = ""
			if (this.goodsCurrentFloor == '0') {
				this.source = "INDEX"
			}
            this.buyMask = true;

			 getGoods(this.goods.id, this.goods.goodsId,this.source).then(res => {
				// 商品已下架
				if (res.data.code == 11001) {
					this.takeDownFromSale = true
					uni.showModal({
						title: '通知',
						content:'该商品已下架！',
						icon: 'none',
						showCancel: false,
						duration: 2000
					})
					return
				}
				/**商品信息以及规格信息存储 */
				this.goodsDetail = res.data.result.data;
				this.goodsSpec = res.data.result.specs;
				this.wholesaleList = res.data.result.wholesaleList;
			 });

		},
		// 跳转商品详情
		recommendGoodClick: function (id, goodsId) {
			this.source = ""
			if (this.goodsCurrentFloor == '0') {
				this.source = "INDEX"
			}
			uni.navigateTo({
				url: '/pages/product/goods?id=' + id + '&goodsId=' + goodsId + '&source=' + this.source
			});
		},
		/**
		 * 查询购物车总数量
		 */
		cartCount() {
		  if (storage.getHasLogin()) {
			API_trade.getCarts().then((res) => {
			  if (res.data && res.data.success) {
				let cartDetail = res.data.result;
				if (cartDetail.cartList && cartDetail.cartList.length > 0) {
				  // 只统计有效商品数量（checkedSkuList中的商品）
				  let arrNums = cartDetail.cartList.map(item => {
					return item.checkedSkuList.length
				  })
				  let shopNums = 0;
				  for (let i = 0; i < arrNums.length; i++) {
					shopNums += arrNums[i]
				  }
				  this.nums = shopNums;
				  this.$store.commit('updateCartCount', shopNums);
				} else {
				  this.nums = 0;
				  this.$store.commit('updateCartCount', 0);
				}
			  } else {
				this.nums = 0;
				this.$store.commit('updateCartCount', 0);
			  }
			}).catch(() => {
			  this.nums = 0;
			  this.$store.commit('updateCartCount', 0);
			});
		  }
		},
		selectSku(idObj) {
		  // this.init(idObj.skuId, idObj.goodsId);
		},
		/**选择商品 */
		changedGoods(val) {
		  this.selectedGoods = val;
		},
		/**
		 * 商品规格子级关闭回调
		 */
		closePopupBuy(val) {
		  this.buyMask = val;
		  // this.maskFlag = false;
		},
	},
}
</script>

<style scoped>
.cpn {
	background-color: #FFFFFF;
	border-radius: 12px;
}

.icon-wrapper {
	position: relative;
	width: 100%;
	height: 0;
	border-radius: 12px;
	padding-bottom: 100%;
}

.icon {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: 12px;
}

/* 售罄蒙层 */
.sold-out-overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(216, 216, 216, 0.5);
	border-radius: 12px;
	z-index: 1;
}

/* 售罄图标 */
.sold-out-icon {
	position: absolute;
	top: 12px;
	right: 12px;
	z-index: 2;
}

.sold-out-img {
	width: 142px;
	height: 128px;
}

.name {
	margin-top: 12px;
	padding-left: 12px;
	padding-right: 12px;
	height: 72px;
	color: #333333;
	font-size: 24px;
	line-height: 36px;
}

.info {
	padding-left: 12px;
	padding-right: 12px;
	height: 72px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.text {
	color: #E22221;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.txt {
	font-size: 24px;
	font-weight: 600;
}

.num {
	font-size: 30px;
	font-weight: 600;
}

.dot {
	font-size: 24px;
	font-weight: 600;
}

.sell {
	font-size: 23px;
	color: #999999;
	margin-left: 10px;
}

.link.disabled {
	opacity: 0.5;
}
</style>
