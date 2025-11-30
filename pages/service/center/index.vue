<template>
	<view class="container">
		<view class="head" v-if="isComplete">
			<view class="bar" :style="{ height: statusBarHeight + 'rpx' }"></view>
			<view class="nav" :style="{ height: titleBarHeight + 'rpx' }" @tap="handlerBack">
				<image class="icon" :src="iconPrev" mode="aspectFit"></image>
				<view class="text">服务商中心</view>
			</view>

			<!-- 红色头部区域 -->
			<view class="header-section">
				<view class="user-info">
					<image class="user-avatar" :src="objBase.avatar" mode="aspectFill"></image>
					<view class="user-details">
						<view class="username">{{ objBase.distributorStoreName }}</view>
						<view class="user-tags">
							<view class="tag-text tag-yellow">中品维度商家</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 白色卡片区域 -->
			<view class="card-section">
				<!-- 上半部分：三个指标 -->
				<view class="top-metrics">
					<view class="metric-item">
						<view class="metric-number">{{ objDealerMoney.memberCount || "0" }}</view>
						<view class="metric-label">邀约维度用户</view>
					</view>
					<view class="metric-divider"></view>
					<view class="metric-item">
						<view class="metric-number">{{ objDealerMoney.providerCount || "0" }}</view>
						<view class="metric-label">邀约供货厂家</view>
					</view>
                    <view class="metric-divider"></view>
					<view class="metric-item">
						<view class="metric-number">{{ objDealerMoney.localCount || "0" }}</view>
						<view class="metric-label">邀约本地商家</view>
					</view>
				</view>

				<!-- 下半部分：维度精品服务费 -->
                <view class="service-title-tag">维度精品服务费</view>
				<view class="bottom-metrics">
					<view class="service-metric">
						<view class="service-number">{{ objDealerMoney.marketPromotion || "0" }}</view>
						<view class="service-label">市场推广</view>
					</view>
					<view class="service-metric">
						<view class="service-number">{{ objDealerMoney.productSelection || "0" }}</view>
						<view class="service-label">产品征选</view>
					</view>
					<view class="service-metric">
						<view class="service-number">{{ objDealerMoney.districtService || "0" }}</view>
						<view class="service-label">区域服务</view>
					</view>
					<view class="service-metric">
						<view class="service-number">{{ objDealerMoney.provinceService || "0" }}</view>
						<view class="service-label">省域服务</view>
					</view>
				</view>

                <!-- 本地商圈服务费 -->
                <view class="service-title-tag service-title-tag-red">本地商圈服务费</view>
				<view class="bottom-metrics">
					<view class="service-metric">
						<view class="service-number">{{ objDealerMoney.userPromotion || "0" }}</view>
						<view class="service-label">用户推广</view>
					</view>
					<view class="service-metric">
						<view class="service-number">{{ objDealerMoney.merchantPromotion || "0" }}</view>
						<view class="service-label">商家推广</view>
					</view>
					<view class="service-metric">
						<view class="service-number">{{ objDealerMoney.countyService || "0" }}</view>
						<view class="service-label">县类服务</view>
					</view>
					<view class="service-metric">
						<view class="service-number">{{ objDealerMoney.provinceCategoryService || "0" }}</view>
						<view class="service-label">省类服务</view>
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

        <view class="wrap" v-if="isComplete">
			<view class="list">
				<view class="item" v-for="(item, index) in arrManager" :key="index" :data-link="item.link" @tap="handlerLink">
					<image class="icon" :src="item.icon" mode="aspectFit"></image>
					<view class="text">{{ item.text }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import storage from "@/utils/storage.js";
// import { getDistributorMoney, getDealerDetail } from "@/api/dealerCenter.js" // TODO: Replace with correct API
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
				name: '',
                distributorStoreName: '旺旺雪饼' // Mock data
			},
			arrOrder: [],
			arrOther: [],
            arrManager: [],
			objDealerMoney: { // Mock data based on image
                memberCount: '3,200',
                providerCount: '3,200',
                localCount: '3,200',
                marketPromotion: '300',
                productSelection: '35',
                districtService: '35',
                provinceService: '20',
                userPromotion: '300',
                merchantPromotion: '35',
                countyService: '35',
                provinceCategoryService: '20'
            },
		}
	},
	methods: {
		// 加载基本信息
		loadBaseData: function () {
			this.isComplete = true
			this.objBase.name = this.userInfo.distributorName
            // Use mock data or existing user info for now
			this.objBase.avatar = this.userInfo.distributorLogo ? this.userInfo.distributorLogo : `${this.iconCommon}/static/v1/profile/avatar.png`;
            
            // TODO: Call actual API
		},
		// 链接跳转:注意仅限普通页面
		handlerLink: function (e) {
			let eLink = e.currentTarget.dataset.link
            if(eLink) {
			    uni.navigateTo({ url: eLink })
            }
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
        let scale = 750 / _inf.windowWidth;
		this.statusBarHeight = _inf.statusBarHeight * scale
		this.titleBarHeight = (_inf.platform == 'android' ? 48 : 44) * scale
		this.navBarHeight = this.statusBarHeight + this.titleBarHeight
        
        // Group 1
		this.arrOrder.push({ text: '查看售出类订单', icon: `${this.iconCommon}/static/v1/dealer/icon-nav_02.png`, link: '' })
		this.arrOrder.push({ text: '查看服务类订单', icon: `${this.iconCommon}/static/v1/dealer/icon-nav_02.png`, link: '' })

        // Group 2
		this.arrOther.push({ text: '服务商信息', icon: `${this.iconCommon}/static/v1/dealer/icon-nav_01.png`, link: '' })
		this.arrOther.push({ text: '交易管理', icon: `${this.iconCommon}/static/v1/dealer/icon-nav_07.png`, link: '' })
		this.arrOther.push({ text: '售后管理', icon: `${this.iconCommon}/static/v1/dealer/icon-nav_03.png`, link: '' })
		this.arrOther.push({ text: '结算管理', icon: `${this.iconCommon}/static/v1/dealer/icon-nav_04.png`, link: '' })

        // Group 3
        this.arrManager.push({ text: '商家管理', icon: `${this.iconCommon}/static/v1/dealer/icon-nav_01.png`, link: '' }) // Placeholder icon
        this.arrManager.push({ text: '商圈流水', icon: `${this.iconCommon}/static/v1/dealer/icon-nav_07.png`, link: '/pages/service/transaction/flow' })
        this.arrManager.push({ text: '商圈结算', icon: `${this.iconCommon}/static/v1/dealer/icon-nav_04.png`, link: '/pages/service/settlement/index' }) // Placeholder icon

		// 加载信息
		this.loadBaseData()
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
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

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
                    border-radius: 50%;
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
            margin-top: -60rpx;

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
						font-size: 24rpx;
						color: #999;
					}
				}

				.metric-divider {
					width: 2rpx;
					height: 60rpx;
					background-color: #E8E8E8;
					margin: 0 10rpx;
				}
			}

            .service-title-tag {
                width: 156rpx;
                height: 32rpx;
                background: #E22222;
                border-radius: 0 604rpx 604rpx 0;
                opacity: 1;
                
                color: #fff;
                font-size: 20rpx;
                line-height: 32rpx;
                text-align: center;
                margin-bottom: 20rpx;
                display: block;
                margin-left: -20rpx;
            }
            .service-title-tag-red {
                background: #E22221;
            }

			.bottom-metrics {
				display: flex;
				justify-content: space-around;
				flex-wrap: wrap;
                margin-bottom: 30rpx;

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
