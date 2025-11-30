<template>
	<view class="container" :style="{ backgroundImage: `url(${backgroundImg})` }">
		<view class="header-title">中品维度</view>
		<view class="home-search">
			<view class="link" @tap="toSearch">
				<image class="ico" :src="iconHomeSearch" mode="aspectFit"></image>
				<view class="txt">搜索</view>
			</view>
		</view>
		<view class="home-banner">
			<u-swiper @tap="bannerClick" @change="bannerChangeEve" :list="arrBanner" interval="5000" duration="500"
				height="300"></u-swiper>
		</view>
		<!-- 推荐分类 -->
		<view class="home-category">
			<view class="item" v-for="(item, index) in arrCategory" :key="index" @tap="hotCategoryClick(item)">
				<image class="ico" :src="item.icon" mode="aspectFit"></image>
				<view class="txt">{{ item.name }}</view>
			</view>
		</view>
		<!-- 热卖商品 -->
		<view class="home-recommend hot-home-recommend">
			<view class="hd hot-goods">
				<!-- <image :src="iconHomeRecommendL" mode="aspectFit" class="ico"></image> -->
				<view class="txt">
					<!-- iconHotSellersPriceImgUrl -->
					<!-- <text>热卖商品</text> -->
					<image class="hot-sellers-img"
						src="https://zpwdsc.oss-cn-beijing.aliyuncs.com/static/v1/home/hot_sellers.png" mode="aspectFill">
					</image>
					<text class="text-info">每一件都是品质之选</text>
				</view>
				<view class="hot-btn" @tap="lookMoreGoodsEve">
					查看更多 <text>&gt;</text>
				</view>
				<!-- <image :src="iconHomeRecommendR" mode="aspectFit" class="ico"></image> -->
			</view>
			<view class="bd">
				<view class="list">
					<view class="item" v-for="(item, index) in arrRecommend"
						@tap="hotGoodClick(item.id, item.goodsId, 'HOT')" :key="index">
						<mini-goods-item :goods="item" />
					</view>
				</view>
			</view>
		</view>
		<!-- 胶囊广告 -->
		<view class="home-image" @tap="bannerClick" v-if="iconCrossObjData.img">
			<image :src="iconCrossObjData.img" mode="widthFix" class="icon"></image>
		</view>
		<!-- 最近购买商品 未登录不显示 -->
		<!-- <view class="home-recommend" v-if="arrBuyGood.length > 0">
			<view class="hd">
				<image :src="iconHomeRecommendL" mode="aspectFit" class="ico"></image>
				<view class="txt">最近购买</view>
				<image :src="iconHomeRecommendR" mode="aspectFit" class="ico"></image>
			</view>
			<view class="bd">
				<view class="list">
					<view class="item" v-for="(item, index) in arrBuyGood" @tap="hotGoodClick(item.id, item.goodsId)"
						:key="index">
						<mini-goods-item :goods="item" />
					</view>
				</view>
			</view>
		</view> -->
		<!-- 楼层名称 -->
		<!-- <view class="home-types">
			<view v-for="(item, index) in arrFloorList" :key="index" @tap="floorClick(item.id, item.categoryId)"
				:class="currentFloor == item.id ? 'item item-hov' : 'item'">{{ item.name }}</view>
		</view> -->
		<!-- 楼层商品 -->
		<view class="home-goods">
			<view class="list">
				<!-- <view class="item" v-for="(item, index) in arrHomeGoods" @tap="recommendGoodClick(item.id, item.goodsId)" -->
				<view class="item" v-for="(item, index) in arrHomeGoods" :key="index">
					<common-goods-item :goods="item" :goodsCurrentFloor="currentFloor" />
				</view>
			</view>
		</view>
		<view v-show="recommendGoodsLoading" class="home-recommend-tip">
			正在加载，请稍后...
		</view>
		<view v-show="!haveNextRecomendPage && !recommendGoodsLoading" class="home-recommend-tip">
			暂无更多数据
		</view>
	</view>
</template>

<script>
import MiniGoodsItem from "@/components/Hina/MiniGoodsItem";
import CommonGoodsItem from "@/components/Hina/CommonGoodsItem";
import { getAdvertisement, getCategoryPopular, getFloorList, getHotSelling, getRecommendGoods, getRecentlyBuyGood } from "../../../api/home";

export default {
	name: '',
	components: {
		MiniGoodsItem,
		CommonGoodsItem
	},
	data() {
		return {
			backgroundImg: '', // 背景图路径， 随轮播图变化
			isComplete: false,
			iconHomeSearch: `${this.iconCommon}/static/v1/home/icon-search.png`,
			iconCrossObjData: {
				img: ""
			},
			iconHotSellersPriceImgUrl: `${this.iconCommon}/static/v1/home/hot_sellers_price.png`,
			iconHomeRecommendL: `${this.iconCommon}/static/v1/home/icon-home_l.png`,
			iconHomeRecommendR: `${this.iconCommon}/static/v1/home/icon-home_r.png`,
			arrBanner: [],						// 首页轮播广告
			arrCategory: [],					// 首页分类数组
			arrRecommend: [],					// 首页热卖商品列表
			arrHomeGoods: [],					// 首页楼层商品列表
			arrFloorList: [{ name: '推荐', id: 0 }, { name: "正在加载其它分类...", id: 1 }],					// 首页楼层分类列表
			currentFloor: '0',
			recommendGoodsParams: { categoryId: 0, terminal: 'MOBILE', pageNumber: 1, pageSize: 10 },
			recommendGoodsLoading: false,
			haveNextRecomendPage: true,
			arrBuyGood: [], // 最近购买商品数组
			source: '', // 商品访问来源, 首页推荐:INDEX, 通栏搜索:SEARCH, 首页热卖:HOT,下单推荐：ORDER_RECOMMEND,轮播广告：ADVERTISING；加购推荐：CARD_RECOMMEND；商详浏览 GOOD,
		}
	},
	methods: {
		// 初始化数据
		initData: function () {
			// 加载首页轮播广告
			getAdvertisement({ platform: 'MOBILE' }).then(res => {
				if (res.data.success) {
					this.arrBanner = []
					// this.backgroundImg = res.data.result.records[0].backgroundImg
					res.data.result.records.forEach(item => {
						if (item.location === 'FOCUS') {
							this.arrBanner.push({ image: item.img, ...item })
						} else if (item.location === 'LATERAL' && this.iconCrossObjData.img == '') {
							this.iconCrossObjData = item
						}
					})
					this.backgroundImg = this.arrBanner[0].backgroundImg
				}
			})
			// 加载首页分类数组
			getCategoryPopular().then(res => {
				if (res.data.success) {
					this.arrCategory = []
					res.data.result.records.forEach(item => {
						this.arrCategory.push({ ...item })
					})
				}
			})
			// 首页热卖商品列表
			getHotSelling({ limit: 15 }).then(res => {
				if (res.data.success) {
					this.arrRecommend = [];
					res.data.result.forEach(item => {
						let price = item.price + "";
						let integer = "00";
						let decimal = "00";
						if (price.indexOf(".") > -1) {
							integer = price.split(".")[0]
							decimal = price.split(".")[1]
							if (decimal.length === 1) {
								decimal += "0";
							}
						} else {
							integer = price;
						}
						this.arrRecommend.push({ id: item.id, name: item.goodsName, icon: item.thumbnail, price: item.price, counter: item.buyCount, integer: integer, decimal: decimal, goodsId: item.goodsId })
					})
				}
			})
			// 首页最近购买商品
			getRecentlyBuyGood().then(res => {
				if (res.data.success) {
					this.arrBuyGood = [];
					res.data.result.forEach(item => {
						let price = item.price + "";
						let integer = "00";
						let decimal = "00";
						if (price.indexOf(".") > -1) {
							integer = price.split(".")[0]
							decimal = price.split(".")[1]
							if (decimal.length === 1) {
								decimal += "0";
							}
						} else {
							integer = price;
						}
						this.arrBuyGood.push({ id: item.id, name: item.goodsName, icon: item.thumbnail, price: item.price, counter: item.buyCount, integer: integer, decimal: decimal, goodsId: item.goodsId })
					})
				}
			})
			//加载楼层分类
			getFloorList({ platform: 'MOBILE' }).then(res => {
				if (res.data.success) {
					this.currentFloor = 0;
					this.arrFloorList = [{ name: "推荐", id: "0", categoryId: "0" }]
					res.data.result[0].floorItems.forEach(item => {
						this.arrFloorList.push({ name: item.categoryName, id: item.id, categoryId: item.categoryId })
					})
				}
			})
			// 首页楼层商品列表
			this.initRecommendGoods();
		},
		// 查看更多
		lookMoreGoodsEve() {
			uni.navigateTo({
				url: `/pages/navigation/search/searchPage?keyword=`
			})
		},
		initRecommendGoods() {

			this.recommendGoodsLoading = true
			getRecommendGoods(this.recommendGoodsParams).then(res => {
				this.recommendGoodsLoading = false;
				if (res.data.success) {
					if (this.recommendGoodsParams.pageNumber === 1) this.arrHomeGoods = [];
					if (res.data.result.records.length != this.recommendGoodsParams.pageSize) {
						this.haveNextRecomendPage = false;
					}
					res.data.result.records.forEach(item => {
						let price = item.price + "";
						let integer = "00";
						let decimal = "00";
						if (price.indexOf(".") > -1) {
							integer = price.split(".")[0]
							decimal = price.split(".")[1]
							if (decimal.length === 1) {
								decimal += "0";
							}
						} else {
							integer = price;
						}
						this.arrHomeGoods.push({ id: item.id, goodsId: item.goodsId, icon: item.thumbnail, name: item.goodsName, buyCount: item.buyCount, price: item.price, integer: integer, decimal: decimal })
					})
				}
			})
		},
		bannerChangeEve(index) {
			this.backgroundImg = this.arrBanner[index].backgroundImg
		},
		/*轮播图点击事件*/
		bannerClick: function (index) {
			let currentBanner = {}
			if (index > 0 || index == 0) {
				currentBanner = this.arrBanner[index];
			} else {
				currentBanner = this.iconCrossObjData
			}
			this.jump(currentBanner)
		},
		jump(currentBanner) {
			if (currentBanner.methodJump == 'ROUTING') {
				uni.navigateTo({
					url: currentBanner.path
				});
			} else if (currentBanner.methodJump == 'URL') {
				uni.navigateTo({
					url: '/pages/webView/webView?src=' + currentBanner.path
				});
			}
		},
		hotGoodClick: function (id, goodsId, source) {
			uni.navigateTo({
				url: '/pages/product/goods?id=' + id + '&goodsId=' + goodsId + '&source=' + source
			});
		},
		toSearch: function () {
			uni.navigateTo({
				url: '/pages/search/search'
			});
		},
		hotCategoryClick: function (relateId) {
			const crtRelateId = relateId.relateId
			if (crtRelateId) {
				uni.setStorage({
					key: 'HotRelateId',
					data: crtRelateId,
				});
			}
			uni.reLaunch({
				url: '/pages/tabbar/category/category',
				// url: '/pages/navigation/search/searchPage?category=' + relateId.id
			});
		},
		recommendGoodClick: function (id, goodsId) {
			this.source = ""
			if (this.currentFloor == '0') {
				this.source = "INDEX"
			}
			uni.navigateTo({
				url: '/pages/product/goods?id=' + id + '&goodsId=' + goodsId + '&source=' + this.source
			});
		},
		floorClick: function (id, categoryId) {
			this.haveNextRecomendPage = true;
			this.recommendGoodsParams.pageNumber = 1;
			this.currentFloor = id;
			this.recommendGoodsParams.categoryId = categoryId;
			this.initRecommendGoods();
		},
		//触底事件
		reachBottom: function () {
			if (!this.recommendGoodsLoading && this.haveNextRecomendPage) {
				this.recommendGoodsParams.pageNumber = this.recommendGoodsParams.pageNumber + 1;
				this.initRecommendGoods();
			}
		},

	},

	mounted: function () {
		// 加载首页数据
		// #ifdef APP-PLUS
		var platform = uni.getSystemInfoSync().platform
		if (platform == 'ios') {
			uni.onNetworkStatusChange((res) => {
				if (res.isConnected) {
					this.initData()
					// 取消监听
					uni.offNetworkStatusChange((res) => {

					});
				}
			});
		} else {
			this.initData()
		}
		// #endif
		this.initData()
		// #ifdef MP-WEIXIN
		// 小程序默认分享
		uni.showShareMenu({
			withShareTicket: true
		})
		// #endif
	},

}
</script>

<style scoped lang="scss">
.container {
	background: #FAFAFA;
	position: relative;
	background-repeat: no-repeat;
	background-position: top;
	background-size: contain;
	padding: calc(0rpx + var(--status-bar-height)) 0 0 0;


	&:before {
		position: absolute;
		content: '';
		top: 0;
		left: 0;
		right: 0;
		height: 480rpx;
		// background: linear-gradient(180deg, #E22221 0%, #FAFAFA 100%);
	}

	.header-title {
		width: 100%;
		position: relative;
		color: #fff;
		text-align: center;
		font-weight: 550;
		// background-color: #E22221;
		padding: 20rpx;
		z-index: 1111;
	}

	.home-search {
		// padding: 24rpx;
		padding: 24rpx 24rpx 0;
		position: relative;
		width: 100%;
		z-index: 1;

		.link {
			background: #FFF;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 72rpx;
			border-radius: 72rpx;

			.ico {
				width: 32rpx;
				height: 32rpx;
			}

			.txt {
				padding: 0 0 0 16rpx;
				line-height: 88rpx;
				font-size: 26rpx;
				color: #C8C9CC;
			}
		}
	}

	.home-banner {
		position: relative;
		z-index: 1;
		// padding: 0 24rpx 24rpx;
		padding: 0;
		// background-color: #E22221;
	}

	.home-category {
		position: relative;
		z-index: 1;
		// top: -30rpx;
		background: #FFF;
		margin: 0 24rpx;
		padding: 30rpx 32rpx;
		// border-top-left-radius: 16rpx;
		// border-top-right-radius: 16rpx;
		display: flex;
		flex-wrap: wrap;
		border-radius: 20rpx 20rpx 20rpx 20rpx;

		.item {
			flex: 1;
			-ms-flex: 0 0 20%;
			flex: 0 0 20%;
			max-width: 20%;
			height: 156rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;

			.ico {
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
				background-color: #fff;
				box-shadow: 0rpx 10rpx 20rpx 0rpx rgba(63, 63, 63, 0.06);
			}

			.txt {
				line-height: 48rpx;
				color: #333;
				font-size: 24rpx;
			}
		}
	}

	.home-recommend {
		.hd {
			display: flex;
			justify-content: center;
			align-items: center;

			.ico {
				width: 32rpx;
				height: 32rpx;
			}

			.txt {
				padding: 0 16rpx;
				line-height: 96rpx;
				font-size: 32rpx;
				color: #333;
				font-weight: 600;
			}
		}

		.bd {
			width: calc(100vw - 80rpx);
			margin: 0 auto;
			overflow-x: auto;

			.list {
				display: flex;
				justify-content: flex-start;

				.item {
					// width: 200rpx;
					width: 22%;
					margin: 0 0 0 24rpx;
					flex-shrink: 0;

					&:first-of-type {
						margin: 0;
					}
				}
			}
		}

		.hot-goods {
			margin-bottom: 20rpx;
			justify-content: space-between;
			align-items: flex-start;
			height: 100%;
			background-color: #fff;
			position: relative;
			padding: 1rpx;

			&:before {
				position: absolute;
				top: 1rpx;
				left: 1rpx;
				content: '';
				width: 100%;
				height: 59rpx;
				// background: linear-gradient( 180deg, #F9E5E5 0%, #FFFFFF 100%);
				// background: linear-gradient( 180deg, #F9E5E5 0%, #FEF8F8 15%, #FEF8F8 20%, #FFFFFF 100%);
				background: linear-gradient(180deg, #fcf2f2 0%, #fefbfb 50%, #FFFFFF 100%);
				z-index: 0;
			}

			.txt {
				font-size: 40rpx;
				padding: 0;
				padding-left: 20rpx;
				line-height: 66rpx;
				color: #333333;
				width: calc(100% - 240rpx);
				height: 66rpx;
				// background: linear-gradient( 180deg, #F9E5E5 0%, #FEF8F8 12%, #ffffff 20%, #FFFFFF 100%);
				display: flex;
				align-items: center;
				position: relative;

				.hot-sellers-img {
					width: 144rpx;
					height: 36rpx;
				}

				.text-info {
					height: 34rpx;
					line-height: 34rpx;
					font-size: 20rpx;
					background: linear-gradient(227deg, #E1332C 0%, #FF6D67 100%);
					color: #fff;
					font-weight: 400;
					padding: 0 20rpx;
					border-radius: 8rpx;
					margin-left: 20rpx;
					z-index: 0;
				}
			}

			.hot-btn {
				width: calc(100% - calc(100% - 240rpx));
				background-color: #FFEEEE;
				clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 100%);
				color: #666666;
				line-height: 59rpx;
				text-align: right;
				padding-right: 20rpx;
				font-size: 24rpx;
				color: #666666;

				text {
					color: #333;
					padding-left: 5rpx;
					line-height: 59rpx;
					font-size: 20rpx;
				}
			}
		}
	}

	.hot-home-recommend {
		margin: 20rpx 20rpx 0;
		overflow: hidden;
		background-color: #fff;
		border-radius: 20rpx 20rpx 20rpx 20rpx;
	}

	.home-image {
		margin: 24rpx 24rpx 0;
		// height: 200rpx;

		.icon {
			width: calc(100vw - 48rpx);
			// height: 200rpx;
		}
	}

	.home-types {
		padding: 0 24rpx;
		height: 88rpx;
		background: #FFF;
		display: flex;
		justify-content: flex-start;
		overflow-x: auto;

		.item {
			min-width: 100rpx;
			line-height: 88rpx;
			font-size: 28rpx;
			color: #969799;
			text-align: center;
			position: relative;
			flex-shrink: 0;
			margin-right: 15rpx;
		}

		.item-hov {
			font-weight: 600;
			color: #E22221;

			&::after {
				position: absolute;
				content: '';
				left: 0;
				right: 0;
				bottom: 0;
				height: 4rpx;
				border-radius: 4rpx;
				background: #E22221;
			}
		}
	}

	.home-goods {
		padding: 0 24rpx 24rpx;

		.list {
			display: flex;
			flex-wrap: wrap;
			margin: 0 -12rpx;

			.item {
				flex: 1;
				-ms-flex: 0 0 50%;
				flex: 0 0 50%;
				max-width: 70%;
				box-sizing: border-box;
				padding: 0 12rpx 0;
				margin: 24rpx 0 0;
			}
		}
	}


}

.home-recommend-tip {
	text-align: center;
	margin-bottom: 20px;
}</style>
