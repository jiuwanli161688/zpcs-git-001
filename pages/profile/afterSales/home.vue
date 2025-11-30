<template>
	<view class="container">
		<view class="tab-comm" :style="{ top: `${envWinTopPX}px` }">
			<view class="item" :class="{ 'item-hov': curTab == index }" v-for="(item, index) in arrTab" :key="index"
				:data-index="index" @tap="handlerChange">
				<view class="text">{{ item.name }}</view>
			</view>
		</view>
		<!-- 新增：申请退换货tab内容 -->
		<view v-if="arrTab[curTab].tag === 'APPLY'">
			<view style="padding: 24rpx 24rpx 0 24rpx;">
				<u-search v-model="searchOrderSn" placeholder="请输入订单号" @search="onSearchApply" :show-action="false" bg-color="#fff" />
			</view>
			<view v-if="applyList.length === 0 && isComplete" class="box-null">
				<empty-box text="暂无可申请退换货订单" />
			</view>
			<view class="box-list">
				<view class="apply-card" v-for="(order, idx) in applyList" :key="order.orderSn">
					<view class="order-title">
						<view class="order-time">{{ order.orderTime }}</view>
						<view class="order-sn">订单号：{{ order.orderSn }}</view>
					</view>
					<view v-for="sku in order.itemList" :key="sku.skuId" class="apply-sku-row">
						<image :src="sku.goodsImage" class="sku-img" mode="aspectFill" />
						<view class="sku-info">
							<view class="sku-name">
								<view class="name-lab" v-if="sku.returnTimeliness">{{ sku.returnTimeliness }}天退货</view>
								<view class="name-lab" v-if="sku.exchangeTimeliness">{{ sku.exchangeTimeliness }}天换货</view>
								{{ sku.goodsName }}
							</view>
							<view class="sku-price-btn">
								<view class="sku-price"><span class="price-symbol">￥</span><span class="price-num">{{ sku.goodsPrice }}</span></view>
								<view class="sku-btn">
									<view class="link" v-if="sku.canApply">
										<view class="link-item link-primary" @tap="goApply(order, sku)"  :custom-style="buttonStyle">退款/售后</view>
									</view>
									<text class="reason" v-else >{{ sku.reason || '不可申请' }}</text>
								</view>
							</view>
						</view>

					</view>
				</view>
			</view>
			<view v-if="applyList.length < applyTotal && !applyLoading" style="text-align:center;padding:24rpx;color:#999;" @tap="onReachBottomApply">加载更多</view>
			<view v-if="applyLoading" style="text-align:center;padding:24rpx;color:#999;">加载中...</view>
		</view>
		<!-- 其他tab内容 -->
		<view v-else>
			<view class="box-null" v-if="isComplete && arrData.length == 0">
				<empty-box text="暂无售后申请记录" />
			</view>
			<view class="box-list">
				<view class="item" v-for="(item, index) in arrData" :key="index">
					<sales-item :index="index" :sales="item" @door="handlerDoorExpress" @self="handlerSelfExpress"
						@detail="handlerDetail" @cancel="cancelSales" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import EmptyBox from "@/components/Hina/EmptyBox";
import SalesItem from "@/components/Hina/SalesItemForUser";
import { getAfterSaleList, cancelAfterSale, getAfterSaleApplyList } from "@/api/after-sale.js";

export default {
	name: '',
	components: {
		EmptyBox,
		SalesItem
	},
	data() {
		return {
			isComplete: false,
			arrTab: [
				{ tag: 'APPLY', name: '申请退换货' },
				{ tag: 'DISPOSING', name: '处理中' },
				{ tag: 'ALL', name: '申请记录' }
			],
			curTab: 0,

			arrData: [],
			intPageCode: 1,						// 当前页面
			intResTotal: 0,						// 记录总数
			params: {
				pageNumber: 1,
				pageSize: 10,
			},
			envWinTopPX: 0,// 导航栏高度
			temp: false,     		//如果页面触底和onShow同时触发，让页面触底后触发
			searchOrderSn: '',
			applyList: [],
			applyPage: 1,
			applyTotal: 0,
			applyLoading: false,
		}
	},
	methods: {
		// 加载售后信息
		loadBaseData: function () {
			let eCode = this.arrTab[this.curTab].tag				// 查询类型
			let params = { ...this.params, tag: eCode }
			getAfterSaleList(params).then((res) => {
				this.isComplete = true
				let data = res.data.result.records;
				if (data.length > 0) {
					this.arrData.push(...data);
				}
				this.intResTotal = res.data.result.total;
				this.temp = false;
			});


		},

		// 切换查询类型
		handlerChange: function (e) {
			let eIndex = e.currentTarget.dataset.index
			this.curTab = eIndex
			this.params.pageNumber = 1
			this.arrData.splice(0, this.arrData.length)
			if (this.arrTab[eIndex].tag === 'APPLY') {
				this.loadApplyList(true)
			} else {
				this.loadBaseData()
			}
		},

		// 跳转上门取件
		handlerDoorExpress: function (e) {
			let eId = this.arrData[e.index].sn

		},
		// 跳转自行邮寄
		handlerSelfExpress: function (e) {
			let eId = this.arrData[e.index].sn
		},
		// 跳转售后详情
		handlerDetail: function (e) {
			let eId = this.arrData[e.index].sn
			uni.navigateTo({
				url: '/pages/profile/afterSales/detail?afterSaleSn=' + eId
			})

		},

		//取消售后
		cancelSales(e) {
			let eId = this.arrData[e.index].sn
			uni.showModal({
				title: "提示",
				content: "是否取消售后",
				success: (res) => {
					if (res.confirm) {
						cancelAfterSale(eId).then(res => {
							if (res.data.code == 200) {
								this.arrData.splice(e.index, 1)
								uni.navigateTo({
									url: '/pages/profile/afterSales/home'
								})
							}
						})
					}

				}
			})

		},
		// 新增：加载申请退换货订单
		loadApplyList(reset = false) {
			if (reset) {
				this.applyList = [];
				this.applyPage = 1;
			}
			this.applyLoading = true;
			const params = {
				pageNumber: this.applyPage,
				pageSize: 10,
				keywords: this.searchOrderSn
			};
			getAfterSaleApplyList(params).then((res) => {
				if (res.data && res.data.result && res.data.result.records) {
					this.applyList = this.applyList.concat(res.data.result.records);
					this.applyTotal = res.data.result.total;
				}
			}).finally(() => {
				this.applyLoading = false;
			});
		},
		// 搜索
		onSearchApply() {
			this.loadApplyList(true)
		},
		// 下拉加载
		onReachBottomApply() {
			if (this.applyList.length < this.applyTotal && !this.applyLoading) {
				this.applyPage++;
				this.loadApplyList()
			}
		},
		// 跳转去申请
		goApply(item, sku) {
			uni.navigateTo({
				url: `/pages/profile/afterSales/insert?orderSn=${item.orderSn}&goodsSn=${sku.orderItemSn}`
			})
		},
	},
	onLoad: function () {
		this.envWinTopPX = uni.getWindowInfo().windowTop
	},
	onShow: function () {
		if (!this.temp) {
			this.temp = true

			// 根据当前tab决定加载哪个数据
			if (this.arrTab[this.curTab].tag === 'APPLY') {
				this.loadApplyList(true);
			} else {
				this.arrData = []
				this.params.pageNumber = 1
				this.params.pageSize = uni.getStorageSync("pageConfig")?.afterSaleListSize || 10;
				// 加载售后信息
				this.loadBaseData()
			}
		}
	},
	onReachBottom: function () {
		if (this.arrTab[this.curTab].tag === 'APPLY') {
			this.onReachBottomApply();
		} else {
			if (this.intResTotal > this.arrData.length && !this.temp) {
				this.params.pageNumber++;
				this.temp = 1;
				this.loadBaseData();
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;
	padding: 0 0 20rpx;

	.tab-comm {
		position: sticky;
		left: 0;
		right: 0;
		top: 0;
		background: #FFF;
		height: 88rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 999;

		&::before {
			position: absolute;
			content: '';
			left: 0;
			bottom: 0;
			right: 0;
			height: 3rpx;
			background: rgba(0, 0, 0, 0.06);
		}

		.item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;

			.text {
				font-size: 28rpx;
				line-height: 88rpx;
				color: #969799;
			}
		}

		.item-hov {
			.text {
				color: #323233;
				font-weight: 600;
				position: relative;

				&::after {
					position: absolute;
					content: '';
					left: 0;
					bottom: 0;
					right: 0;
					height: 6rpx;
					background: #EE0A24;
					border-radius: 6rpx;
				}
			}
		}
	}

	.box-list {
		padding: 24rpx 20rpx 0;

		.item {
			position: relative;
			margin: 20rpx 0 0;

			&:first-of-type {
				margin: 0;
			}
		}
	}

	.apply-card {
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		box-shadow: 0 2rpx 8rpx 0 rgba(0,0,0,0.04);
		margin-bottom: 20rpx;
		.order-title {
			font-size: 24rpx;
			color: #999999;
			padding-bottom: 20rpx;
			line-height: 40rpx;
			.order-time{

			}
			.order-sn{

			}
		}
		.apply-sku-row {
			display: flex;
			align-items: flex-start;
			padding: 20rpx 0;
			border-top: 2rpx solid #F4F4F4;
			position: relative;
			&:last-child {
				padding-bottom: 0;
			}
			.sku-img {
				width: 144rpx;
				height: 144rpx;
				border-radius: 10rpx;
				background: #f5f5f5;
				margin-right: 18rpx;
			}
			.sku-info {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				min-height: 144rpx;
				.sku-name {
					font-size: 24rpx;
					color: #333333;
					font-weight: 400;
					// 超出两行显示省略号
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					.name-lab {
						background: #E22221;
						color: #fff;
						display: inline-block;
						margin: 0 8rpx 0 0;
						padding: 4rpx 8rpx;
						line-height: 36rpx;
						font-size: 24rpx;
						border-radius: 6rpx;
					}
				}
				.sku-price-btn{
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					margin-top: auto;
					.sku-price {
						font-size: 24rpx;
						color:#E22221;
						font-weight: 700;
						.price-symbol{
							font-size: 24rpx;
						}
						.price-num{
							font-size: 32rpx;
						}
					}
					.sku-btn {
						min-width: 120rpx;
						text-align: right;
						.reason{
							color:#E22221;
							font-size:24rpx;
						}
						.link {
							display: flex;
							justify-content: flex-end;
							align-items: center;

							.link-item {
								border: 3rpx solid #DCDEE0;
								border-radius: 10rpx;
								font-size: 24rpx;
								color: #323232;
								text-align: center;
								padding: 6rpx 16rpx;
							}

							.link-primary {
								border: 2rpx solid #E22221;
								color: #F10100;
							}
						}
					}
				}
			}

		}
	}
}
</style>
