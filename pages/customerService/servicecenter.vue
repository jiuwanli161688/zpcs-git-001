<template>
	<view class="main">
		<view class="anc">
			<image class="anc-icon" :src="`${iconCommon}/customer/announcement.png`" mode="aspectFit"></image>
			<NoticeBar :items="noticeList"></NoticeBar>
			<!-- <u-notice-bar mode="horizontal" padding="0" font-size="26" type="none" color="#333333" :volume-icon="false"
				bg-color="#FFFFFF" :list="noticeList"></u-notice-bar> -->
			<!-- <view class="right">
				<text>更多</text>
				<image src="https://zpwdsc.oss-cn-beijing.aliyuncs.com/im/image/arrow.png" mode="widthFix"></image>
			</view> -->
		</view>

		<!-- 自助服务 -->
		<view class="function-box">
			<u-grid :col="4" :border="false" class="function">
				<u-grid-item @tap="NavigateToServer('1')" bgColor="#ffffff">
					<view class="grid-text one">
						<image :src="`${iconCommon}/customer/sales-icon.png`"></image>
					</view>
					退换/售后
				</u-grid-item>
				<u-grid-item @tap="NavigateToServer('2')" bgColor="#ffffff">
					<view class="grid-text two">
						<image :src="`${iconCommon}/customer/reminder-icon.png`"></image>
					</view>
					我要催单
				</u-grid-item>
				<u-grid-item @tap="NavigateToServer('3')" bgColor="#ffffff">
					<view class="grid-text three">
						<image :src="`${iconCommon}/customer/invoice-icon.png`"></image>
					</view>
					发票服务
				</u-grid-item>
				<u-grid-item @tap="NavigateToServer('4')" bgColor="#ffffff">
					<view class="grid-text four">
						<image :src="`${iconCommon}/customer/Account-icon.png`"></image>
					</view>
					账户与安全
				</u-grid-item>
				<u-grid-item @tap="NavigateToServer('5')" bgColor="#ffffff">
					<view class="grid-text five">
						<image :src="`${iconCommon}/customer/order-icon.png`"></image>
					</view>
					修改订单
				</u-grid-item>
				<u-grid-item @tap="NavigateToServer('6')" bgColor="#ffffff">
					<view class="grid-text six">
						<!-- <image :src="`${iconCommon}/customer/dianhuakefu.png`"></image> -->
						<image :src="`${iconCommon}/customer/tel-service-icon.png`"></image>
					</view>
					电话客服
				</u-grid-item>
				<u-grid-item   @tap="NavigateToServer('7')" bgColor="#ffffff">
					<view class="grid-text seven">
						<image :src="`${iconCommon}/customer/exclusive-service-icon.png`"></image>
					</view>
					官方客服
				</u-grid-item>
				<u-grid-item   @tap="NavigateToServer('8')" bgColor="#ffffff">
					<view class="grid-text eight">
						<image :src="`${iconCommon}/customer/dispute-icon.png`"></image>
					</view>
					交易纠纷
				</u-grid-item>
			</u-grid>
		</view>
		<!-- 猜你想问 -->
		<view class="question">
			<view class="top">
				<view class="left">
					<image class="question-icon" :src="`${iconCommon}/customer/ask-icon.png`" mode="aspectFit"></image>
					<text>猜你想问</text>
				</view>
				<view class="right" @tap="goToOrder">
					<text>选择订单</text>
					<image :src="`${iconCommon}/customer/customer-service-arrow-right.png`"></image>
				</view>
			</view>
			<view class="middle" @click="clickProblemServiceItemEve">
				<view class="time">
					<view class="left">下单时间:{{ wantToAskQuestionList.orderDeliveryTime }}</view>
					<view class="right">{{ orderStatusObj[wantToAskQuestionList.orderStatus] }}</view>
				</view>
				<view class="info" v-for="(item, index) in wantToAskQuestionList.orderGoodsSkuVOList" :key="index">
					<image :src="item.thumbnail"></image>
					<view class="text">
						<text class="name">{{ item.skuName }}</text>
						<text class="price">¥{{ item.skuPrice }}</text>
					</view>
				</view>
			</view>
			<view class="bottom">
				<view class="left">
					<view class="explain">
						<view class="item" v-for="(item, index) in wantQuestionVOList" :key="index"
							@tap="toIMForQuestion(item)">
							<view>{{ item.questionName }}</view>
						</view>
					</view>
				</view>
				<view class="right" @tap="refreshQT">
					<image class="other-icon" :src="`${iconCommon}/customer/other-icon.png`" mode="aspectFit"></image>
					<text>换一换</text>
				</view>
			</view>
		</view>
		<!-- 帮助中心 -->
		<view class="help">
			<view class="help-title">
				<view class="help-text">
					<!-- <text>帮助中心</text> -->
					<image class="question-icon" :src="`${iconCommon}/customer/question-icon.png`" mode="aspectFit"></image>
					<text>常见问题</text>
				</view>
				<!-- <view class="search-container">
					<image :src="`${iconCommon}/customer/search.png`" class="search-image"
						mode="widthFix"></image>
					<input type="text" placeholder="怎么退货" class="search-input" />
				</view> -->
			</view>
			<!-- <view class="help-menu-list">
				<scroll-view class="menu-box"
				  scroll-x="true" >
					<view class="menu-item"
					  v-for="(item, index) in solutionCategoriesList"
					  :class="{ 'active': choiceSolutionCategoriesCode === item.id }"
					  @click="TabPaneClickEve(item.id)"
					  :key="index">
					  <view class="">

					  </view>
						<text>{{item.categoryName}}</text>
					</view>
				</scroll-view>
			</view> -->
			<view class="list" :class="{ 'active-list': activeListState }">
				<text v-for="(itemC, indexC) in solutionByIdList" :key="indexC" @click="clickCarouselItemEve(itemC)">{{
					itemC.title }}</text>
				<view class="bottom" v-if="solutionByIdList.length <= 0">
					<text>~暂无更多数据~</text>
				</view>
			</view>
			<view class="bottom" @click="activeListState = !activeListState" v-if="solutionByIdList.length > 0">
				<text v-if="!activeListState">点击加载更多</text>
				<text v-if="activeListState">点击收起</text>
				<image v-if="!activeListState" :src="`${iconCommon}/customer/arrow2.png`" mode="widthFix"></image>
				<image v-if="activeListState" :src="`${iconCommon}/customer/arrow.png`" mode="widthFix"></image>
			</view>
		</view>

		<view class="empty"></view>
		<!-- 底部操作栏 -->
		<view class="footer">
			<view class="footer-content">
				<view class="one" @tap="NavigateToServer('6')">
					<image :src="`${iconCommon}/customer/tel-icon.png`"></image>
					<text>电话客服</text>
				</view>
				<view class="two" @tap="NavigateToServer('7')">
					<image :src="`${iconCommon}/customer/customer-service-icon.png`"></image>
					<text>在线客服</text>
				</view>
				<view class="three" @tap="NavigateToServer('9')">
					<image :src="`${iconCommon}/customer/service-icon.png`"></image>
					<text>服务进度</text>
				</view>
			</view>
		</view>

		<u-popup ref="popup" mode="bottom" background-color="#fff">
			<view class="footer-title">
				<text>选择问题订单</text>
			</view>
			<view class="search-container">
				<image class="search-image" :src="`${iconCommon}/customer/search.png`" alt="搜索图标" />
				<input class="search-input" v-model="getQuestionOrderParams.keyWord" @blur="searchQuestionOrderEve"
					style="width: 600rpx;" placeholder="请输入商品名称/订单号" />
			</view>

			<scroll-view class="order-card-box" @scrolltolower="uploadQuestionOrderListEve" scroll-y="true"
				v-if="getQuestionOrderList.length > 0">
				<view class="order-card" v-for="(item, index) in getQuestionOrderList" :key="index"
					@tap="choiceCrtOrderEve(item)">
					<view class="time">
						<view class="left">下单时间:{{ item.createTime }}</view>
						<view class="right">{{ orderStatusObj[item.orderStatus] }}</view>
					</view>
					<view class="info goods-child-info" v-for="(childItem, childIndex) in item.goodsSkuList"
						:key="childIndex">
						<u-avatar class="avatar" :src="childItem.thumbnail" mode="scaleToFill‌‌" size="144"></u-avatar>
						<view class="text">
							<text class="name">{{ childItem.goodsName }}</text>
							<text class="price">¥{{ childItem.price }}</text>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="box" v-else style="text-align: center;">
				~暂无更多数据~
			</view>
		</u-popup>
	</view>
</template>

<script>
import {
	getAnnouncementData,
	wantToAskQuestion,
	getQuestionOrder,
	getSolutionById,
	getCommonTypePageQuery,
	getSolutionCategories,
} from '@/api/customer.js'
import { createChatPool } from "@/api/im";
import NoticeBar from './NoticeBar.vue';
import storage from "@/utils/storage";
export default {
	components: {
		NoticeBar
	},
	data() {
		return {
			aa: true,
			noticeList: [], // 公告列表
			orderStatusObj: {
				CANCEL: '已取消',
				UNPAID: '未付款',
				PAID: '已付款',
				UNDELIVERED: '待发货',
				DELIVERED: '已发货',
				COMPLETED: '已完成/待评价',
				FINISH: '已结束',
				AFTERSALES: '退换/售后',
				STAY_PICKED_UP: '待自提',
				TAKE: '待核验',
				CANCELLED: '已关闭',
			}, // 订单状态 对象列
			wantToAskQuestionParams: {
				type: 1, // 1/首页普通订单或最近浏览商品 2/售后
				orderSn: '', // 订单编号
				pageNum: 1,
				pageSize: 4,
			}, // 猜你想问 params
			wantToAskQuestionList: [], // 猜你想问数据列表
			wantQuestionVOList: [], // 问题列表
			wantQuestionVOListTotal: 0, // 问题总数
			showQuestionIdList: [], // 记录当前展示问题 ID
			getQuestionOrderParams: {
				pageNumber: 1,
				pageSize: 10,
				keyWord: '', // 订单号/商品名称
				orderSn: '', // 订单编号
				goodsName: '', // 商品名称
			}, // 用户问题订单列表Params
			getQuestionOrderList: [], // 用户问题订单列表数据
			questionOrderPages: 0, // 用户问题订单列表数据总页

			solutionCategoriesList: [], // 常见问题菜单列表
			choiceSolutionCategoriesCode: '', // 选中菜单列
			commonTypePageQueryParams: {
				// visibleScope: 'CONSUMER',
				pageSize: 10,
				pageNum: 1,
			}, // 获取常见问题列表数据 params
			solutionByIdList: [], // 常见问题菜单的子菜单数据
			activeListState: false, // 点击加载更多状态
		}
	},
	onShow() {

	},
	onLoad() {

	},
	created() {
		this.init()
	},
	mounted() {

	},
	methods: {
		toIMForQuestion(item) {

			uni.navigateTo({
				// url: `/pages/Im/Chat?orderSn=${this.wantToAskQuestionList.sn}&storeId=${this.objOrder.storeId}&type=business&memberId=${this.objOrder.memberId}`
				url: `/pages/Im/Chat?orderSn=${this.wantToAskQuestionList.sn}&storeId=0&type=platform&memberId=${storage.getUserInfo().id}&questionName=${item.questionName}`
			});

		},
		// 初始化
		init() {
			this.getAnnouncementDataEve()
			this.getSolutionCategoriesEve()
			this.wantToAskQuestionEve()
		},
		refreshQT() {
			this.wantToAskQuestionParams.pageNum += 1
			let maxPageSize = Math.ceil(this.wantQuestionVOListTotal / this.wantToAskQuestionParams.pageSize)
			if (this.wantToAskQuestionParams.pageNum > maxPageSize) {
				this.wantToAskQuestionParams.pageNum = 1
			}
			this.wantToAskQuestionEve()
		},
		// 猜你想问 订单/商品 点击事件
		clickProblemServiceItemEve() {
			if (this.wantToAskQuestionList.dataType == 'ORDER') {
				uni.navigateTo({
					url: `/pages/profile/order/detail?orderSn=${this.wantToAskQuestionList.sn}`
				})
			}
			if (this.wantToAskQuestionList.dataType == 'GOODS') {
				uni.navigateTo({
					url: `/pages/product/goods?id=${this.wantToAskQuestionList.orderGoodsSkuVOList[0].skuId}&goodsId=${this.wantToAskQuestionList.orderGoodsSkuVOList[0].goodsId}&source=GOOD`
				})
			}
		},
		// 点击帮助中心内容查看详情
		clickCarouselItemEve(row) {
			uni.navigateTo({
				url: `/pages/customerService/customerInfoDetail?id=${row.id}`
			})
		},
		// 常见问题菜单栏 表头点击事件
		TabPaneClickEve(e) {
			this.activeListState = false
			this.choiceSolutionCategoriesCode = e
			this.getSolutionByIdEve()
		},
		// 获取常见问题菜单列
		getSolutionCategoriesEve() {
			// this.LoadingEve()
			getSolutionCategories().then(res => {
				if (res.data && res.data.code == 200) {
					this.solutionCategoriesList = res.data.data
					this.choiceSolutionCategoriesCode = this.solutionCategoriesList[0].id
					this.getSolutionByIdEve()
				}
			})
		},
		// 获取常见问题分类的 子分类
		getSolutionByIdEve() {
			//getSolutionById(this.choiceSolutionCategoriesCode).then(res => {
			getCommonTypePageQuery(this.commonTypePageQueryParams).then(res => {
				console.log('--------', res)
				if (res.data && res.data.code == 200) {
					this.solutionByIdList = res.data.data.records
				}
				uni.hideLoading()
			})
		},


		// 选择订单
		goToOrder() {
			this.$refs.popup.open();
			this.getQuestionOrderEve()
		},
		// 用户问题订单列表抽屉 选择事件
		choiceCrtOrderEve(e) {
			this.questionOrderModalState = false
			this.wantToAskQuestionParams.type = 1
			// this.wantToAskQuestionParams.orderSn = e.orderSn
			this.wantToAskQuestionParams.orderSn = e.subOrderSn
			this.wantToAskQuestionParams.pageNum = 1
			this.wantToAskQuestionEve()
			this.$refs.popup.close()
		},
		// 上拉加载用户问题订单列表
		uploadQuestionOrderListEve() {
			if (this.getQuestionOrderParams.pageNumber != this.questionOrderPages) {
				this.getQuestionOrderParams.pageNumber += 1
				this.getQuestionOrderEve()
			}
		},
		// 选择订单搜索功能
		searchQuestionOrderEve() {
			this.getQuestionOrderParams.pageNumber = 1
			this.getQuestionOrderList = []
			this.getQuestionOrderEve()
		},
		// 获取用户问题订单列表
		getQuestionOrderEve() {
			this.LoadingEve()
			getQuestionOrder(this.getQuestionOrderParams).then(res => {
				if (res.data && res.data.code == 200) {
					this.getQuestionOrderList.push(...res.data.result.records)
					this.questionOrderPages = res.data.result.pages
					uni.hideLoading()
				}
			})
		},
		// 获取猜你想问数据
		wantToAskQuestionEve() {
			this.LoadingEve()
			wantToAskQuestion(this.wantToAskQuestionParams).then(res => {
				if (res.data.success) {
					this.wantToAskQuestionList = res.data.result
					this.wantQuestionVOList = res.data.result.questionVOList
					this.wantQuestionVOListTotal = res.data.result.total
				}
				uni.hideLoading()
			})
		},
		// 获取公告数据
		getAnnouncementDataEve() {
			getAnnouncementData({ type: 'SCROLL', visibleScope: 'CONSUMER', }).then(res => {
				if (res.data && res.data.code == 200) {
					this.noticeList = res.data.data.records
				}
			})
		},
		// 路由跳转
		NavigateToServer(e) {
			let crtUrl = ''
			if (e == '1') { // 退换/售后
				crtUrl = `/pages/profile/afterSales/home`
			} else if (e == '2') { // 我要催单
				crtUrl = `/pages/profile/order/home`
			} else if (e == '3') { // 发票服务
				crtUrl = `/pages/profile/invoice/home`
			} else if (e == '4') { // 账户与安全
				crtUrl = `/pages/config/security/home`
			} else if (e == '5') { // 修改订单
				crtUrl = `/pages/profile/order/home?state=2&source=updateOrder`
			} else if (e == '6') { // 电话客服
				crtUrl = `/pages/customerService/service?title=电话客服`
			} else if (e == '7') { // 专属客服
				// crtUrl = `/pages/customerService/index`
				this.createChatPoolEve()
			} else if (e == '8') { // 交易纠纷
				crtUrl = `/pages/profile/complaint/home?tab=1`
			} else if (e == '9') { // 服务进度
				crtUrl = `/pages/customerService/serviceProgress`
			}
			if (crtUrl) {
				uni.navigateTo({
					url: crtUrl,
				})
			}
		},
		// 跳转 平台客服页面
		createChatPoolEve() {
			createChatPool().then(res => {
				if (res.data && res.data.code == 200) {
					uni.navigateTo({
						url: `/pages/Im/Chat?type=platform`
					});
				}
			})
		},
		// 加载遮罩
		LoadingEve() {
			uni.showLoading({
				title: '加载中...',
				mask: true,
			});
		},
	},
	computed: {
	},
}
</script>

<style lang="scss" scoped>
.main {
	padding: 24rpx;
	background-color: #F3F3F3;
}

.anc {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-radius: 16rpx;
	gap: 8rpx;
	background-color: #ffead5;
	padding: 0rpx 20rpx;

	.anc-icon {
		width: 46rpx;
		height: 30rpx;
	}

	image {
		width: 28rpx;
		height: 28rpx;
	}

	.right {
		display: flex;
		flex-direction: row;
		align-items: center;
		color: #CACACA;
		font-size: 24rpx;
		white-space: nowrap;

		image {
			width: 20rpx;
			height: 20rpx;
		}
	}
}
.function-box{
	background-color: white;
	border-radius: 16rpx;
	margin: 24rpx 0;
	overflow: hidden;
	padding: 0 20rpx;
	.function {
		font-size: 24rpx;
		margin-top: 8rpx;
		border-radius: 16rpx;
		overflow: hidden;

		image {
			width: 110rpx;
			height: 110rpx;
		}

		.grid-text {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			border-radius: 32rpx;
			margin-bottom: 8rpx;
		}

		// .one {
		// 	background: linear-gradient(180deg, #EA6636 0%, #F37548 100%);
		// }

		// .two {
		// 	background: linear-gradient(180deg, #4179F0 0%, #768DF7 100%);
		// }

		// .three {
		// 	background: linear-gradient(180deg, #F19036 0%, #F1BA46 100%);
		// }

		// .four {
		// 	background: linear-gradient(180deg, #45CE9C 0%, #80EFC6 100%);
		// }

		// .five {
		// 	background: linear-gradient(180deg, #9B8AFC 0%, #C0B4FB 100%);
		// }


		// .six {
		// 	background: linear-gradient(180deg, #45CE9C 0%, #80EFC6 100%);
		// }

		// .seven {
		// 	background: linear-gradient(180deg, #FF805A 0%, #FEA587 100%);
		// }

		// .eight {
		// 	background: linear-gradient(180deg, #4179F0 0%, #768DF7 100%);
		// }
	}
}



.question {
	border-radius: 8px;
	display: flex;
	padding: 24rpx;
	flex-direction: column;
	justify-content: center;
	background-color: #FFFFFF;
	margin-bottom: 40rpx;

	.top {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

		.left {
			display: flex;
			align-items: center;
			font-size: 36rpx;
			color: #D62C1F;
			font-weight: 600;

			.question-icon{
				width: 56rpx;
				height: 56rpx;
				margin-right: 10rpx;
			}
		}

		.right {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 22rpx;
			color: #666666;

			image {
				width: 24rpx;
				height: 24rpx;
			}
		}

	}

	.middle {
		background: #F3F3F3;
		border-radius: 16rpx;
		margin-top: 20rpx;
		padding: 20rpx 24rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 20rpx;

		.time {
			display: flex;
			justify-content: space-between;

			.left,
			.right {
				display: flex;
				align-items: center;
				font-size: 24rpx;
			}

			.left {
				color: #999999;
			}

			.right {
				color: #333333;
				margin-right: 24rpx;
			}
		}

		.info {
			margin-top: 16rpx;
			display: flex;
			gap: 16rpx;

			image {
				width: 96rpx;
				height: 96rpx;
				background-color: #FFFFFF;
			}

			.text {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				color: #333333;
				width: 100%;

				.name {
					padding-right: 8rpx;
					font-size: 28rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}

				.price {
					font-size: 26rpx;
				}
			}
		}
	}

	.bottom {
		display: flex;
		background: #FFFFFF;
		border-radius: 8rpx;
		gap: 14rpx;

		.left {
			display: flex;
			flex-wrap: wrap;
			width: 100%;

			.explain {
				width: 100%;
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 8rpx;
				margin-top: 20rpx;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					padding-bottom: 5rpx;
					font-size: 24rpx;
					color: #333333;
					background-color: #F3F3F3;
					border-radius: 8rpx;
					padding: 12rpx 0;
				}
			}
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 4rpx;

			image {
				width: 32rpx;
				height: 32rpx;
			}

			text {
				width: 72rpx;
				height: 34rpx;
				font-size: 24rpx;
				color: #D62C1F;
			}
		}
	}

}

.help {
	margin-top: 16rpx;
	border-radius: 8px;
	display: flex;
	padding: 24rpx;
	flex-direction: column;
	justify-content: center;
	background-color: #FFFFFF;

	.help-title {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.help-text {
			display: flex;
			align-items: center;
			font-size: 32rpx;
			color: #333333;
			.question-icon{
				width: 56rpx;
				height: 56rpx;
				margin-right: 10rpx;
			}
			text{
				font-size: 36rpx;
				color: #D62C1F;
				font-weight: 600;

			}
		}

		.search-container {
			display: flex;
			align-items: center;
			border-radius: 8rpx;
			background-color: #f3f3f3;
			padding: 6rpx 22rpx;
			gap: 8rpx;
			width: 294rpx;

			.search-image {
				width: 28rpx;
				height: 28rpx;
			}

			.search-input {
				flex: 1;
				height: 52rpx;
				font-size: 24rpx;
				color: #CACACA;
			}
		}

	}

	.help-menu-list {
		margin-top: 18rpx;
		display: flex;
		justify-content: space-between;

		.menu-box {
			/deep/ .uni-scroll-view-content {
				display: flex;
				align-items: center;
				flex-wrap: nowrap;
			}
		}

		.menu-item {
			flex-shrink: 0;
			border-radius: 16rpx;
			background-color: #F3F3F3;
			padding: 10rpx 22rpx;
			border: 1px solid #F3F3F3;
			margin-right: 20rpx;

			text {
				flex-shrink: 0;
				font-size: 26rpx;
				color: #333333;
			}
		}

		.menu-item.active {
			border: 1px solid #FFAEAE;
			background: #FFE3E3;

			text {
				color: #C83F24;
			}
		}
	}

	.list {
		margin-top: 24rpx;
		height: 100rpx;
		overflow: hidden;

		text {
			background: #FFFFFF;
			display: block;
			padding: 16rpx 4rpx;
			border-bottom: 1rpx solid #F2F2F2;
		}
	}

	.active-list {
		height: auto;
	}

	.bottom {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 22rpx;
		color: #999999;
		font-style: normal;
		margin-top: 16rpx;
		gap: 8rpx;

		image {
			width: 24rpx;
			height: 24rpx;
		}
	}

}

.empty {
	display: flex;
	height: 180rpx;
}

.footer {
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: fixed;
	left: 0;
	bottom: 0;
	background: #FFFFFF;
	width: 100%;
	box-shadow: 0 -2rpx 12rpx 0 rgba(0, 0, 0, 0.04);
	border-top-left-radius: 18rpx;
	border-top-right-radius: 18rpx;
	z-index: 99;

	.footer-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 0 24rpx 0;
		gap: 0;

		.one,
		.two,
		.three {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 18rpx 0 8rpx 0;
			transition: background 0.2s;
			border-radius: 12rpx;
			margin: 0 8rpx;
			background: #fff;
			cursor: pointer;
		}

		.one image,
		.two image,
		.three image {
			width: 80rpx;
			height: 80rpx;
			margin-bottom: 6rpx;
		}

		.one text,
		.two text,
		.three text {
			font-size: 24rpx;
			color: #333333;
			font-weight: 600;
		}
	}
}

.footer-title {
	display: flex;
	align-items: center;
	padding: 26rpx 0;

	text {
		font-weight: 500;
		font-size: 32rpx;
		color: #323233;
		margin-left: 280rpx;
	}

	image {
		width: 44rpx;
		height: 44rpx;
		margin-left: 202rpx;
	}
}

.search-container {
	margin: 24rpx 0;
	display: flex;
	align-items: center;
	border-radius: 34rpx;
	height: 68rpx;
	background-color: #f3f3f3;
	padding: 0 24rpx;

	.search-image {
		width: 26rpx;
		height: 28rpx;
		margin-right: 10rpx;
	}

	.search-input {
		font-size: 28rpx;
		color: #cacaca;
		padding: 0;
		border: none;
		outline: none;
	}
}

.order-card-box {
	width: calc(100% - 30px);
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	// box-sizing: border-box;
	padding: 30rpx;
	background-color: #f1f1f4;
	min-height: 60vh;
	max-height: 60vh;
	overflow: hidden;

	.order-card {
		background: #ffffff;
		border-radius: 16rpx;
		padding: 24rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 20rpx;

		.time {
			display: flex;
			justify-content: space-between;
			margin-bottom: 16rpx;

			.left,
			.right {
				display: flex;
				align-items: center;
				font-size: 24rpx;
			}

			.left {
				color: #333333;
			}

			.right {
				color: #333333;
				margin-right: 24rpx;
			}
		}

		.info {
			display: flex;
			gap: 16rpx;

			image {
				width: 96rpx;
				height: 96rpx;
				background-color: #ffffff;
			}

			.avatar {
				padding: 0;
			}

			.text {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				color: #333333;
				width: 100%;

				.name {
					padding-right: 8rpx;
					font-size: 28rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				.price {
					font-size: 32rpx;
					color: #c83f24;
				}
			}
		}

		.goods-child-info {
			padding-top: 20rpx;
			border-top: 2px solid #ececec;
		}

		.info-first {
			border-top: 2px solid transparent;
		}
	}

	.content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx 24rpx;
		border-radius: 16rpx;
		background-color: #ffffff;

		.content-left {
			display: flex;
			align-items: center;

			image {
				background: linear-gradient(180deg, #45ce9c 0%, #80efc6 100%);
				border-radius: 50%;
				width: 32rpx;
				height: 27rpx;
				padding: 18rpx 16rpx 20rpx 16rpx;
			}

			.left-img2 {
				width: 33rpx;
				height: 36rpx;
				padding: 16rpx 18rpx;
				background: linear-gradient(180deg, #9b8afc 0%, #c0b4fb 100%);
			}

			.left-img3 {
				width: 32rpx;
				height: 36rpx;
				padding: 16rpx 18rpx;
				background: linear-gradient(180deg, #f19036 0%, #f1ba46 100%);
			}

			.text {
				text {
					display: block;
					margin-left: 24rpx;
					font-weight: 500;
					font-size: 28rpx;
					color: #323233;
				}

				text:nth-child(2) {
					margin-top: 8rpx;
					font-size: 22rpx;
					color: #999999;
				}
			}
		}

		.img2 {
			width: 32rpx;
			height: 32rpx;
		}
	}
}
</style>
