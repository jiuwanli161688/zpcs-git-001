<template>
	<view class="container">
		<view class="head" v-if="isComplete">
			<view class="bar" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="nav" :style="{ height: titleBarHeight + 'px' }" @tap="handlerBack">
				<image class="icon" :src="iconPrev" mode="aspectFit"></image>
				<view class="text">分平台服务商中心</view>
			</view>

			<!-- 红色头部区域 -->
			<view class="header-section">
				<view class="user-info">
					<image class="user-avatar" :src="objBase.avatar" mode="aspectFill"></image>
					<view class="user-details">
						<view class="username">{{ objBase.distributorStoreName }}</view>
						<view class="user-tags">
							<view class="tag-text tag-yellow">分平台服务商</view>
							<view class="tag-text tag-red" v-if="districtLevelAgentFlag">独家服务商</view>
							<view class="tag-text tag-orange" v-if="provinceLevelAgentFlag">省级运营中心</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 深蓝灰色待结算区域 -->
			<view class="earnings-section">
				<view class="earnings-content">
					<view class="earnings-text">待结算：<text class="earnings-icon">¥{{ totalEstimatedRevenue }}</text></view>
					<view class="earnings-link" @tap="handlerLink" data-link="/pages/dealerCenter/estimatedEarnings">全部</view>
				</view>
			</view>

			<!-- 白色卡片区域 -->
			<view class="card-section">
				<!-- 上半部分：两个指标 -->
				<view class="top-metrics">
					<view class="metric-item" @tap="handlerLink" data-link="/pages/dealerCenter/inviteUsers">
						<view class="metric-number">{{ objDealerMoney.memberCount ? objDealerMoney.memberCount : "0" }}</view>
						<view class="metric-label">APP用户数</view>
					</view>
					<view class="metric-divider"></view>
					<view class="metric-item" @tap="handlerLink" data-link="/pages/dealerCenter/inviteStore">
						<view class="metric-number">{{ objDealerMoney.providerCount ? objDealerMoney.providerCount : "0" }}</view>
						<view class="metric-label">供给厂商数</view>
					</view>
				</view>

				<!-- 下半部分：四个服务指标 -->
				<view class="bottom-metrics">
					<view class="service-metric">
						<view class="service-number">{{ objDealerMoney.accumulateSaleIncome ? objDealerMoney.accumulateSaleIncome : "0" }}</view>
						<view class="service-label">市场推广服务</view>
					</view>
					<view class="service-metric">
						<view class="service-number">{{ objDealerMoney.accumulateRecommendIncome ? objDealerMoney.accumulateRecommendIncome : "0" }}</view>
						<view class="service-label">产品征选服务</view>
					</view>
					<view class="service-metric">
						<view class="service-number">{{ objDealerMoney.accumulateDistrictIncome ? objDealerMoney.accumulateDistrictIncome : "0" }}</view>
						<view class="service-label">区域服务</view>
					</view>
					<view class="service-metric">
						<view class="service-number">{{ objDealerMoney.accumulateProvinceIncome ? objDealerMoney.accumulateProvinceIncome : "0" }}</view>
						<view class="service-label">省域服务</view>
					</view>
				</view>
			</view>
		</view>

		<view class="wrap" v-if="isComplete">
			<view class="list">
				<view class="item" v-for="(item, index) in arrOrder" :key="index" :data-link="item.link" @tap="handlerLink">
					<image class="icon" :src="item.icon" mode="aspectFit"></image>
					<view class="text">{{ item.text }}</view>
				</view>
			</view>
		</view>

		<view class="wrap" v-if="isComplete">
			<view class="list">
				<view class="item" v-for="(item, index) in arrOther" :key="index" :data-link="item.link" @tap="handlerLink">
					<image class="icon" :src="item.icon" mode="aspectFit"></image>
					<view class="text">{{ item.text }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import storage from "@/utils/storage.js";
import { getDistributorMoney, getDealerDetail, getEstimatedRevenue } from "@/api/dealerCenter.js"
export default {
	name: '',
	components: {

	},
	data() {
		return {
			userInfo: storage.getUserInfo(),
			isComplete: false,
			iconPrev: `${this.iconCommon}/static/v1/common/icon-prev.png`,
			statusBarHeight: 0, 		// 状态栏高度
			titleBarHeight: 0,    	// 导航栏高度
			navBarHeight: 0,     		// 导航栏整体高度
			objBase: {
				avatar: `${this.iconCommon}/static/v1/profile/avatar.png`,
				name: ''
			},											// 分平台服务商信息
			arrOrder: [],
			arrOther: [],
			objDealerMoney: {},     //分平台服务商收益
			districtLevelAgentFlag: false,    //区级代理标志
			provinceLevelAgentFlag: false,    //省级代理标志
			totalEstimatedRevenue: 0    //待结算
		}
	},
	methods: {
		// 加载基本信息
		loadBaseData: function () {
			this.isComplete = true
			this.objBase.name = this.userInfo.distributorName
			this.objBase.distributorStoreName = this.userInfo.distributorStoreName
			this.objBase.avatar = this.userInfo.distributorLogo ? this.userInfo.distributorLogo : `${this.iconCommon}/static/v1/profile/avatar.png`;
			getDistributorMoney().then(res => {
				if (res.data.success) {
					this.objDealerMoney = res.data.result;
				}
			})
			getDealerDetail().then(res => {
				if (res.data.success) {
					this.objBase.distributorStoreName = res.data.result.distributorStoreName;
					this.districtLevelAgentFlag = res.data.result.districtLevelAgentFlag;
					this.provinceLevelAgentFlag = res.data.result.provinceLevelAgentFlag;
				}
			})
		},
		// 加载待结算
		loadEstimatedRevenue: function () {
			getEstimatedRevenue().then(res => {
				if (res.data.success) {
					this.totalEstimatedRevenue = res.data.result.totalEstimatedRevenue;
				}
			})
		},
		// 链接跳转:注意仅限普通页面
		handlerLink: function (e) {
			let eLink = e.currentTarget.dataset.link
			uni.navigateTo({ url: eLink })
		},
		// 返回
		handlerBack() {
			uni.navigateBack({
				delta: 1
			})
		}
	},
	onLoad: function () {

		// 终端信息
		let _inf = uni.getSystemInfoSync()
		this.statusBarHeight = _inf.statusBarHeight
		this.titleBarHeight = _inf.platform == 'android' ? 48 : 44
		this.navBarHeight = this.statusBarHeight + this.titleBarHeight
		this.arrOrder.push({ text: '查看售出类订单', icon: `${this.iconCommon}/static/v1/dealer/icon-nav_02.png`, link: '/pages/dealerCenter/order?type=SOLD' })
		this.arrOrder.push({ text: '查看服务类订单', icon: `${this.iconCommon}/static/v1/dealer/icon-nav_02.png`, link: '/pages/dealerCenter/order?type=RECOMMEND' })

		this.arrOther.push({ text: '服务商信息', icon: `${this.iconCommon}/static/v1/dealer/icon-nav_01.png`, link: '/pages/dealerCenter/config' })
		this.arrOther.push({ text: '交易管理', icon: `${this.iconCommon}/static/v1/dealer/icon-nav_07.png`, link: '/pages/dealerCenter/orderQuery' })
		this.arrOther.push({ text: '售后管理', icon: `${this.iconCommon}/static/v1/dealer/icon-nav_03.png`, link: '/pages/dealerCenter/sales' })
		this.arrOther.push({ text: '结算管理', icon: `${this.iconCommon}/static/v1/dealer/icon-nav_04.png`, link: '/pages/dealerCenter/settlement' })
		// this.arrOther.push({ text: '资金管理', icon: `${this.iconCommon}/static/v1/dealer/icon-nav_06.png`, link: '/pages/dealerCenter/wallet' })

		// 加载分平台服务商信息
		this.loadBaseData()
		this.loadEstimatedRevenue()
	},
	onShow: function () {

	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F5F5F5;
	box-sizing: border-box;
	min-height: 100vh;

	.head {
		margin: 0 0 20rpx;

		.bar {
			background: #E22221;
		}

		.nav {
			background: #E22221;
			height: 88rpx;
			padding: 0 16rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.icon {
				width: 36rpx;
				height: 36rpx;
			}

			.text {
				margin: 0 0 0 16rpx;
				color: #FFF;
				font-size: 30rpx;
			}
		}

		.header-section {
			padding: 30rpx 20rpx;
			position: relative;
			height: 250rpx;

			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: #E22221;
				z-index: 0;
				height: 360rpx;
			}
			.user-info {
				display: flex;
				align-items: center;
				position: relative;
				z-index: 1;

				.user-avatar {
					width: 120rpx;
					height: 120rpx;
					margin-right: 24rpx;
				}

				.user-details {
					display: flex;
					flex-direction: column;
					justify-content: center;

					.username {
						font-weight: bold;
						font-size: 36rpx;
						color: #FFF;
					}

					.user-tags {
						display: flex;
						flex-wrap: wrap;
						margin-top: 16rpx;
						.tag-text {
							font-size: 22rpx;
							padding: 2rpx 20rpx 2rpx 16rpx;
							font-weight: 500;
							margin: 0 12rpx 0 0;
							border-radius: 60rpx 20rpx 110rpx 60rpx;
							border: 2rpx solid #FFFFFF;

						}

						.tag-yellow {
							background: linear-gradient( 270deg, #FDF8DF 0%, #FEAB18 94%);
							color: #A76B00;
						}

						.tag-red {
							background: linear-gradient( 270deg, #F2F7FA 3%, #98AEBF 96%);
							color: #404F5B;
						}

						.tag-orange {
							background: linear-gradient( 270deg, #FFEEE0 3%, #D57F3F 96%);
							color: #814212;
						}
					}
				}
			}
		}

		.earnings-section {
			background: #393D58;
			padding: 24rpx 20rpx;
			color: #FFF;
			font-size: 28rpx;
			border-radius: 16rpx 16rpx 0 0;
			margin: -60rpx 56rpx 0;
			position: relative;
			z-index: 3;
			height: 80rpx;
			display: flex;
			align-items: center;

			.earnings-content {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;

				.earnings-text {
					font-size: 30rpx;
					font-weight: 500;
					.earnings-icon{
						color: #FFEDA6;
					}
				}

				.earnings-link {
					color: #FFF;
					font-size: 26rpx;
					opacity: 0.9;
					position: relative;
					padding-right: 40rpx;

					&::after {
						position: absolute;
						content: '';
						width: 12rpx;
						height: 12rpx;
						line-height: 12rpx;
						border: 4rpx solid #d6d6d6;
						border-left: none;
						border-bottom: none;
						right: 20rpx;
						top: 50%;
						transform: rotate(45deg) translateY(-50%);
					}
				}
			}
		}

		.card-section {
			background: #FFF;
			border-radius: 20rpx;
			margin: 0 20rpx;
			padding: 30rpx 20rpx;
			position: relative;
			z-index: 2;

			.top-metrics {
				display: flex;
				justify-content: space-around;
				align-items: center;
				margin-bottom: 30rpx;
				padding-bottom: 30rpx;
				border-bottom: 1rpx solid #E8E8E8;

				.metric-item {
					text-align: center;
					flex: 1;

					.metric-number {
						font-size: 48rpx;
						font-weight: bold;
						color: #333;
						margin-bottom: 12rpx;
					}

					.metric-label {
						font-size: 26rpx;
						color: #666;
					}
				}

				.metric-divider {
					width: 2rpx;
					height: 60rpx;
					background-color: #E8E8E8;
					margin: 0 20rpx;
				}
			}

			.bottom-metrics {
				display: flex;
				justify-content: space-around;
				flex-wrap: wrap;

				.service-metric {
					text-align: center;
					flex: 1;
					min-width: 140rpx;

					.service-number {
						font-size: 42rpx;
						font-weight: bold;
						color: #333;
						margin-bottom: 12rpx;
					}

					.service-label {
						font-size: 24rpx;
						color: #666;
						line-height: 1.4;
					}
				}
			}
		}
	}

	.wrap {
		background: #FFF;
		border-radius: 12rpx;
		margin: 0 20rpx 20rpx;

		.list {
			padding: 0 20rpx;

			.item {
				position: relative;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				line-height: 96rpx;

				&::before {
					position: absolute;
					content: '';
					left: 0;
					right: 0;
					bottom: 0;
					height: 3rpx;
					background: #F1F1F1;
				}

				&::after {
					position: absolute;
					content: '';
					width: 12rpx;
					height: 12rpx;
					border: 4rpx solid #d6d6d6;
					border-left: none;
					border-bottom: none;
					right: 20rpx;
					top: 50%;
					transform: rotate(45deg) translateY(-50%);
				}

				&:last-of-type {
					&::before {
						display: none;
					}
				}

				.icon {
					width: 40rpx;
					height: 40rpx;
					margin: 0 16rpx 0 0;
				}

				.text {
					color: #333;
					font-size: 28rpx;
				}
			}
		}
	}
}
</style>
