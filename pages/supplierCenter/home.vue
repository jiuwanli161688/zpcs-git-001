<template>
	<view class="container">
		<view class="head" v-if="isComplete">
			<view class="bar" :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="nav" :style="{ height: titleBarHeight + 'px' }">
				<image class="icon" :src="iconPrev" @tap="back" mode="aspectFit"></image>
				<view class="text">供应商中心</view>
			</view>
			<view class="inf">
				<image class="icon" :src="userInfo.storeLogo ? userInfo.storeLogo : objBase.avatar" mode="aspectFill">
				</image>
				<view class="text">{{ userInfo.storeName }}</view>
			</view>
		</view>

		<view class="wrap" v-if="isComplete">
			<view class="list">
				<view class="item" v-for="(item, index) in arrConfig" :key="index" :data-link="item.link"
					@tap="handlerLink">
					<image class="icon" :src="item.icon" mode="aspectFit"></image>
					<view class="text">{{ item.text }}</view>
				</view>
			</view>
		</view>

		<view class="wrap" v-if="isComplete">
			<view class="list">
				<view class="item" v-for="(item, index) in arrService" :key="index" :data-link="item.link"
					@tap="handlerLink">
					<image class="icon" :src="item.icon" mode="aspectFit"></image>
					<view class="text">{{ item.text }}</view>
				</view>
			</view>
		</view>

		<view class="wrap" v-if="isComplete">
			<view class="list">
				<view class="item" v-for="(item, index) in arrSettlement" :key="index" :data-link="item.link"
					@tap="handlerLink">
					<image class="icon" :src="item.icon" mode="aspectFit"></image>
					<view class="text">{{ item.text }}</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
import storage from '@/utils/storage.js'

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
			},											// 供应商信息
			arrConfig: [],					// 配置类链接
			arrService: [],					// 服务类链接
			arrSettlement: [],			// 结算类链接
		}
	},
	methods: {
		back: function () {
			uni.navigateBack();
		},
		// 加载基本信息
		loadBaseData: function () {
			this.isComplete = true
			this.objBase.avatar = `${this.iconCommon}/static/v1/profile/avatar.png`
			this.objBase.name = '昵称3f634d'
		},

		// 链接跳转:注意仅限普通页面
		handlerLink: function (e) {
			let eLink = e.currentTarget.dataset.link
			uni.navigateTo({ url: eLink })
		},
	},
	onLoad: function () {

		// 终端信息
		let _inf = uni.getSystemInfoSync()
		this.statusBarHeight = _inf.statusBarHeight
		this.titleBarHeight = _inf.platform == 'android' ? 48 : 44
		this.navBarHeight = this.statusBarHeight + this.titleBarHeight
		this.arrConfig.push({ text: '资料管理', icon: `${this.iconCommon}/static/v1/supplier/icon-nav_01.png`, link: '/pages/supplierCenter/config' })
		this.arrConfig.push({ text: '对公账户变更', icon: `${this.iconCommon}/static/v1/supplier/icon-nav_01.png`, link: '/pages/supplierCenter/information' })
		this.arrConfig.push({ text: '基础信息变更', icon: `${this.iconCommon}/static/v1/supplier/icon-nav_01.png`, link: '/pages/supplierCenter/foundation' })
		// this.arrConfig.push({ text: '准入类目', icon: `${this.iconCommon}/static/v1/supplier/icon-nav_00.png`, link: '/pages/supplierCenter/category' })
		this.arrConfig.push({ text: '退件地址', icon: `${this.iconCommon}/static/v1/supplier/icon-nav_02.png`, link: '/pages/supplierCenter/address/home' })
		this.arrConfig.push({ text: '配送模板', icon: `${this.iconCommon}/static/v1/supplier/icon-nav_03.png`, link: '/pages/supplierCenter/shipTemplate/home' })
		// this.arrConfig.push({text: '运费模板', icon: `${this.iconCommon}/static/v1/supplier/icon-nav_03.png`, link: ''})

		this.arrService.push({ text: '商品管理', icon: `${this.iconCommon}/static/v1/supplier/icon-nav_04.png`, link: '/pages/supplierCenter/goods' })
		this.arrService.push({ text: '订单管理', icon: `${this.iconCommon}/static/v1/supplier/icon-nav_07.png`, link: '/pages/supplierCenter/order' })
		this.arrService.push({ text: '售后管理', icon: `${this.iconCommon}/static/v1/supplier/icon-nav_09.png`, link: '/pages/supplierCenter/sales' })
		this.arrService.push({ text: '投诉管理', icon: `${this.iconCommon}/static/v1/supplier/icon-nav_06.png`, link: '/pages/supplierCenter/complaint' })

		this.arrSettlement.push({ text: '结算管理', icon: `${this.iconCommon}/static/v1/supplier/icon-nav_05.png`, link: '/pages/supplierCenter/settlement' })
		this.arrSettlement.push({ text: '资金管理', icon: `${this.iconCommon}/static/v1/supplier/icon-nav_08.png`, link: '/pages/supplierCenter/wallet' })

		// 加载供应商信息
		this.loadBaseData()
	},
	onShow: function () {

	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	box-sizing: border-box;
	min-height: 100vh;

	.head {
		margin: 0 0 40rpx;

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

		.inf {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			flex-direction: column;
			position: relative;
			height: 200rpx;
			overflow: hidden;

			&::before {
				position: absolute;
				content: '';
				top: 0;
				left: -20%;
				width: 140%;
				height: 80rpx;
				background: #E22221;
				border-radius: 0 0 50% 50%;
			}

			.icon {
				position: relative;
				z-index: 1;
				width: 120rpx;
				height: 120rpx;
			}

			.text {
				position: relative;
				z-index: 1;
				line-height: 80rpx;
				font-size: 32rpx;
				color: #333;
			}
		}
	}

	.wrap {
		background: #FFF;
		border-radius: 12rpx;
		margin: 20rpx 20rpx 0;

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
