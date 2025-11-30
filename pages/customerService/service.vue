<template>
	<view class="wrap">
		<view class="top">
			<view class="box">
				<view class="info">
					<text class="title">客服热线：{{ customer400Phone }}</text>
					<text class="subtitle">
            人工服务时间：{{ customerWorkTime }}
            </text>
			<text class="sub-title">
            其他时间如需帮助，您可使用自助服务。
            </text>
				</view>
			</view>
			<image class="tel-service-img" :src="`${iconCommon}/customer/tel-service-img.png`" mode="aspectFit"></image>

		</view>
		<!-- 预约申请 -->
		<view class="appointment-detail-box">
			<view class="appointment-detail">
				<view class="content" @tap="appointmentApplicationPage">
					<view class="content-left">
						<view class="text">
							<text>预约回电申请</text>
						</view>
					</view>
					<view>
						<image class="img2" :src="`${iconCommon}/customer/tel-arrow-right-icon.png`"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 菜单列 - 移出appointment-detail-box以保持sticky效果 -->
		<view class="nav-content">
			<view class="nav_box">
				<view class="item" :class="{ 'active': activeTab === 0 }" @click="setActiveTabEve(0)">
					<text class="title">订单咨询</text>
					<text class="second-text">已购买商品问题</text>
				</view>
				<view class="item" :class="{ 'active': activeTab === 1 }" @click="setActiveTabEve(1)">
					<text class="title">账户问题</text>
					<text class="second-text">账户/权益/资产</text>
				</view>
				<view class="item" :class="{ 'active': activeTab === 2 }" @click="setActiveTabEve(2)">
					<text class="title">购买问题</text>
					<text class="second-text">下单前问题咨询</text>
				</view>
			</view>
			<view class="search-container" v-if="activeTab === 0">
				<image class="search-image" :src="`${iconCommon}/customer/search.png`" alt="搜索图标"></image>
				<input class="search-input" v-model="getQuestionOrderParams.keyWord" @blur="searchQuestionOrderEve" style="width: 600rpx;" placeholder="请输入商品名称/订单号" />
			</view>
			<view class="search-container" v-if="activeTab === 2" >
				<image class="search-image" :src="`${iconCommon}/customer/search.png`" alt="搜索图标"></image>
				<input class="search-input" v-model="getUnpaidOrderParams.goodsName" @blur="searchUnpaidOrderEve" style="width: 600rpx;" placeholder="请输入商品名称" />
			</view>
		</view>
		<!-- 内容DOM -->
		<view class="list">
			<!-- 订单咨询内容 -->
			<view class="box" v-if="activeTab === 0" :class="{ 'FadeInDown': activeTab === 0 }">
				<view class="order-card" v-for="(item, index) in getQuestionOrderList" :key="index" @tap="showOrder(item)">
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
			</view>
			<!-- 账户问题内容 -->
			<view class="box" v-if="activeTab === 1" :class="{ 'FadeInDown': activeTab === 1 }">

				<view class="content" v-for="(item, index) in accountTypePageQueryList" :key="index" @tap="showAccount(item)">
					<view class="content-left">
						<image v-if="item.title == '账号相关'" :src="`${iconCommon}/customer/zhanghuanquan.png`"></image>
						<image v-if="item.title == '结算相关'" class="left-img2" style=""
							:src="`${iconCommon}/customer/dianhuakefu_white.png`">
							<!-- :src="`${iconCommon}/customer/dianhuakefu.png`"> -->
						</image>
						<image v-if="item.title == '余额相关'" class="left-img3" style="width: 32rpx; height: 36rpx"
							:src="`${iconCommon}/customer/xiugaidingdan.png`">
						</image>
						<view class="text">
							<text>{{item.title}}</text>
							<text>{{item.description}}</text>
						</view>
					</view>
					<view>
						<image class="img2" :src="`${iconCommon}/customer/arrow.png`"></image>
					</view>
				</view>
			</view>
			<!-- 购买问题内容 -->
			<view class="box" v-if="activeTab === 2" :class="{ 'FadeInDown': activeTab === 2 }">
				<view class="order-card" v-for="(item, index) in unpaidOrderList" :key="index" @tap="showShop(item)">
					<view class="info goods-child-info" v-for="(childItem, childIndex) in item.goodsSkuList"
						:key="childIndex" :class="{ 'info-first': childIndex == 0 }">
						<u-avatar class="avatar" :src="childItem.thumbnail" mode="square" size="144"></u-avatar>
						<view class="text">
							<text class="name">{{ childItem.goodsName }}</text>
							<text class="price">¥{{ childItem.price }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部抽屉 -->
		<view class="footer">
			<!-- 订单咨询 -->
			<u-popup v-model="order_show" mode="bottom" border-radius="40">
				<view class="footer-title">
					<text>选择咨询方式</text>
					<image :src="`${iconCommon}/customer/cross.png`" @tap="showOrder"></image>
				</view>
				<view class="FNlist">
					<view class="footer-content" @click="linkOnLineConsumerEve">
						<view class="footer-content-left">
							<image style="background-color: #e6734a; border-radius: 28rpx"
							:src="`${iconCommon}/static/v1/help/icon-chat.png`">
								<!-- :src="`${iconCommon}/customer/zaixiankefu.png`"> -->
							</image>
							<text>商家在线客服</text>
						</view>
						<view>
							<image class="img2" :src="`${iconCommon}/customer/arrow.png`"></image>
						</view>
					</view>
				</view>
			</u-popup>
			<!-- 账户问题 -->
			<u-popup v-model="account_show" mode="bottom" border-radius="40">
				<view class="footer-title">
					<text>选择咨询方式</text>
					<image :src="`${iconCommon}/customer/cross.png`" @tap="showAccount"></image>
				</view>
				<view class="FNlist">
					<!-- 直通平台客服 -->
					<view class="footer-content" @click="createChatPoolEve">
						<view class="footer-content-left">
							<image :src="`${iconCommon}/customer/kefu.png`"></image>
							<text>直通平台客服</text>
						</view>
						<view>
							<image class="img2" :src="`${iconCommon}/customer/arrow.png`"></image>
						</view>
					</view>
					<!-- 拨打热线电话 -->
					<view class="footer-content" @click="showCustomer400PhoneModel">
						<view class="footer-content-left">
							<image :src="`${iconCommon}/customer/rexian.png`"></image>
							<text>拨打热线电话</text>
						</view>
						<view>
							<image class="img2" :src="`${iconCommon}/customer/arrow.png`"></image>
						</view>
					</view>
					<!-- 预约客服回电 -->
					<view class="footer-content" @tap="goToPhone">
						<view class="footer-content-left">
							<image :src="`${iconCommon}/customer/yuyue.png`"></image>
							<text>预约客服回电</text>
						</view>
						<view>
							<image class="img2" :src="`${iconCommon}/customer/arrow.png`"></image>
						</view>
					</view>
				</view>
			</u-popup>
			<!-- 购买问题 -->
			<u-popup v-model="shop_show" mode="bottom" border-radius="40">
				<view class="footer-title">
					<text>选择咨询方式</text>
					<image :src="`${iconCommon}/customer/cross.png`" @tap="showShop"></image>
				</view>
				<view class="FNlist">
					<view class="footer-content" @click="linkOnLineConsumerEve">
						<view class="footer-content-left">
							<image style="background-color: #e6734a; border-radius: 28rpx"
									:src="`${iconCommon}/static/v1/help/icon-chat.png`">
								<!-- :src="`${iconCommon}/customer/zaixiankefu.png`"> -->
							</image>
							<text>商家在线客服</text>
						</view>
						<view>
							<image class="img2" :src="`${iconCommon}/customer/arrow.png`"></image>
						</view>
					</view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
import {
	getQuestionOrder,
	get400Phone,
	getUnpaidOrder,
	getProblemList,
	getCustomerWorkTime,
} from '@/api/customer.js'
import { createChatPool } from "@/api/im";
export default {
	data() {
		return {
			title: "下单时间:2025-03-26 23:57:47",
			subTitle: "已完成",
			src: `${this.iconCommon}/customer/weitu.png`,
			activeTab: 0, // 新增属性，用于存储当前选中的导航项
			order_show: false,
			account_show: false,
			shop_show: false,

			getQuestionOrderParams: {
				pageNumber: 1,
				pageSize: 10,
				keyWord: '', // 商品名称/订单号
				orderSn: '', // 订单编号
				goodsName: '', // 订单名称
			}, // 订单列表Params
			getQuestionOrderList: [], // 订单列表 数据
			questionOrderPages: 0, // 订单列表 总数
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
			customer400Phone: '', // 客服热线号码
			getUnpaidOrderParams: {
				orderSn: '', // 订单编号
				goodsName: '', // 商品名称
				startDate: '', // 起始时间
				endDate: '', // 结束时间
				pageSize: 5, // 页面容量
				pageNumber: 1, // 页码
			}, // 购买问题 params
			unpaidOrderList:[] ,// 购买问题数据列表
			unpaidOrderPages: 0, // 购买问题数据 总数
			choiceOrder: {}, // 选中购买订单

			accountTypePageQueryList: [], // 账户问题
			accountTypePageQueryParams:{
				pageSize: 10,
				pageNum: 1,
				problemType: 'ACCOUNT',
			}, // 获取账户问题params
			associationId: '', // 关联id：订单id、售后单id、其他id
			customerWorkTime: '', // 客服工作时间

		};
	},
	onLoad(option) {
		if (option.title) {
			uni.setNavigationBarTitle({
				title: option.title
			})
		}
	},
	created() {
		this.init()
	},
	mounted() { },
	onReachBottom() {
		if (this.activeTab == 0 && this.getQuestionOrderParams.pageNumber != this.questionOrderPages) {
			this.getQuestionOrderParams.pageNumber += 1
			this.getQuestionOrderEve()
		}
		if (this.activeTab == 2 && this.getUnpaidOrderParams.pageNumber != this.unpaidOrderPages) {
			this.getUnpaidOrderParams.pageNumber += 1
			this.getUnpaidOrderEve()
		}
	},
	methods: {
		// 初始化
		init() {
			this.get400PhoneEve()
			this.getCustomerWorkTimeData()
			this.getQuestionOrderEve()
			this.getAccountTypePageQueryEve()
		},
		// 获取账户问题列表
		getAccountTypePageQueryEve() {
		  // getAccountTypePageQuery(this.accountTypePageQueryParams).then(res => {
			getProblemList(this.accountTypePageQueryParams).then(res => {
			if (res.data.code == 200) {
			  this.accountTypePageQueryList = res.data.data.records
			}
		  })
		},
		// 预约申请
		appointmentApplicationPage() {
			uni.navigateTo({
				url: '/pages/customerService/phoneAppointment'
			})
		},

		// 订单咨询 咨询方式弹窗
		showOrder(e) {
			this.order_show = !this.order_show;
			if(e) {
				this.choiceOrder = {...e}
			}
		},
		// 账户问题 - 咨询方式选择
		showAccount(e) {
			this.account_show = !this.account_show;
			if(e.id) {
				this.associationId = e.id
			} else {
				this.associationId = ''
			}
			console.log('-----',this.associationId)
		},
		// 展示热线电话
		showCustomer400PhoneModel() {
			this.account_show = !this.account_show;
      uni.makePhoneCall({
        phoneNumber: this.customer400Phone
      });
			// uni.showModal({
			// 	title: '热线电话',
			// 	content: this.customer400Phone,
			// 	showCancel:false,
			// 	success: function (res) {
			// 		if (res.confirm) {
			// 		}
			// 	}
			// });
		},
		// 跳转 平台客服页面
		createChatPoolEve() {
		    createChatPool().then(res => {
		        if (res.data.code == 200) {
		            uni.navigateTo({
		                url: `/pages/Im/Chat?type=platform`
		            });
		        }
		    })
		},
		// 购买问题订单点击事件 级弹窗展示关闭
		showShop(e) {
			this.shop_show = !this.shop_show;
			if(e) {
				this.choiceOrder = {...e}
			}
		},
		//跳转 商家在线客服
		linkOnLineConsumerEve() {
			uni.navigateTo({
				url: `/pages/Im/Chat?orderSn=${this.choiceOrder.subOrderSn}&storeId=${this.choiceOrder.storeId}&type=business&memberId=${this.choiceOrder.memberId}`
			})
		},
		// 跳转 预约客服回电
		goToPhone() {
			uni.navigateTo({
				url: '/pages/customerService/phone?consultationType=ACCOUNT&associationId='+this.associationId
			})
		},
		// 获取 购买问题数据
		getUnpaidOrderEve() {
		  this.LoadingEve()
		  if(this.getUnpaidOrderParams.pageNumber == 1) {
			  this.unpaidOrderList = []
		  }
		  getUnpaidOrder(this.getUnpaidOrderParams).then(res => {
			if (res.data.code == 200) {
			  this.unpaidOrderList.push(...res.data.result.records)
			  this.unpaidOrderPages = res.data.result.pages
			}
			uni.hideLoading();
		  })
		},
		// 购买问题搜索事件
		searchUnpaidOrderEve(e) {
			this.unpaidOrderList = []
			this.getUnpaidOrderParams.pageNumber = 1
			this.getUnpaidOrderParams.goodsName = e.detail.value
			this.getUnpaidOrderEve()
		},

		// 获取用户问题订单列表
		getQuestionOrderEve() {
			this.LoadingEve()
			getQuestionOrder(this.getQuestionOrderParams).then(res => {
				if (res.data.code == 200) {
					this.getQuestionOrderList.push(...res.data.result.records)
					this.questionOrderPages = res.data.result.pages
					uni.hideLoading();
				}
			}).catch(err => {
				uni.hideLoading();
			})
		},
		searchQuestionOrderEve(e) {
			this.getQuestionOrderList = []
			this.getQuestionOrderParams.pageNumber = 1
			// this.getQuestionOrderParams.goodsName = e.detail.value
			this.getQuestionOrderEve()
		},
		// 获取客服热线
		get400PhoneEve() {
			get400Phone().then(res => {
				if(res.data.code == 200) {
					this.customer400Phone = res.data.msg
				}
			})
		},
		// 获取客服工作时间
		getCustomerWorkTimeData() {
			getCustomerWorkTime().then(res => {
				if(res.data.code == 200) {
					this.customerWorkTime = res.data.result.workStartTime + '至' + res.data.result.workEndTime
				}
			})
		},

		// 菜单栏选择事件
		setActiveTabEve(e) {
			this.activeTab = e
			if( e == 2 && this.getUnpaidOrderParams.pageNumber == 1 ) {
				this.getUnpaidOrderEve()
			}
		},

		// 加载遮罩
		LoadingEve() {
			uni.showLoading({
				title: '加载中...',
				mask: true,
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.wrap {
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100%;
	background-color: #f3f3f3;
}

.top {
	background-color: #e22221;
	// height: 350rpx;
	display: flex;
    justify-content: center;
	padding-left: 40rpx;
	.box {
		text-align: center;
		margin: 40rpx 0 0 20rpx;
		image {
			width: 218rpx;
			height: auto;
			display: block;
			position: absolute;
		}

		.info {
			display: flex;
			flex-direction: column;
			color: #ffffff;

			.title {
				font-size: 32rpx;
				font-weight: 600;
			}

			.subtitle {
				font-size: 24rpx;
				margin-top: 20rpx;
			}
			.sub-title{
				font-size: 20rpx;
				margin-top: 10rpx;
			}
		}
	}

}
.tel-service-img{
	width: 200rpx;
	height: 300rpx;
	z-index: 2;
	margin: -20rpx 0 0 20rpx;
}
.appointment-detail-box{
	position: relative;
	top: -60rpx;
	.appointment-detail {
		border-bottom: 1px solid #ECECEC;
		.content {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 32rpx 24rpx;;
			background-color: #ffffff;
			border-radius: 60rpx 60rpx 0rpx 0rpx;

			.content-left {
				display: flex;
				align-items: center;

				.text {
					text {
						display: block;
						margin-left: 24rpx;
						font-weight: 500;
						font-size: 28rpx;
						color: #323233;
					}
				}
			}

			.img2 {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}
}

.nav-content {
	background: #ffffff;
	border-radius: 0rpx 0rpx 32rpx 32rpx;
	padding: 32rpx 24rpx 24rpx 24rpx;
	display: block;
	position: sticky;
	top: 0;
	z-index: 999;
	margin-top: -60rpx;

	.nav_box {
		display: grid;
		grid-template-columns: repeat(3, 1fr);

		.item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;

			.title {
				font-size: 28rpx;
				color: #333333;
				margin-bottom: 4rpx;
			}

			.second-text {
				font-size: 22rpx;
				color: #999999;
			}

			&::after {
				margin-top: 16rpx;
				content: "";
				height: 6rpx;
				width: 80rpx;
			}
		}

		.active {


			&::after {
				margin-top: 16rpx;
				content: "";
				height: 6rpx;
				width: 80rpx;
				background-color: #c83f24;
				border-radius: 200rpx;
				/* 激活时底部线条颜色 */
			}
		}
	}

	.search-container {
		margin: 24rpx 0 0 0;
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
}

.nav-content .sticky .second-text {
	display: none;
}

.list {
	padding: 24rpx;
	min-height: calc(100vh - 140rpx);
	overflow-y: auto;

	.box {
		display: flex;
		flex-direction: column;
		gap: 24rpx;

		.order-card {
			background: #ffffff;
			border-radius: 16rpx;
			padding: 24rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;

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
}

.FadeInDown {
	animation: fadeInDown 0.5s ease-in-out;
}

@keyframes fadeInDown {
	from {
		opacity: 0;
		transform: translateY(-20px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.u-body-item {
	font-size: 28rpx;
	color: #333333;
	font-weight: 500;

	image {
		width: 140rpx;
		height: 140rpx;
		flex: 0 0 140rpx;
		border-radius: 16rpx;
	}

	.u-body-item-title {
		margin-left: 16rpx;

		text:nth-child(2) {
			font-weight: 600;
			font-size: 32rpx;
			color: #c83f24;
			margin-top: 18rpx;
			display: block;
		}
	}
}

.footer {
	display: flex;
	flex-direction: column;

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

	.FNlist {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
		padding: 24rpx;
		margin-bottom: 38rpx;

		.footer-content {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 22rpx 24rpx;
			border-radius: 16rpx;
			background-color: #f3f3f3;

			.footer-content-left {
				display: flex;
				align-items: center;

				image {
					width: 38rpx;
					height: 38rpx;
					padding: 10rpx 8rpx 8rpx 10rpx;
				}

				text {
					margin-left: 18rpx;
					font-weight: 500;
					font-size: 28rpx;
					color: #323233;
				}
			}

			.img2 {
				width: 32rpx;
				height: 32rpx;
			}
		}
	}
}
</style>
