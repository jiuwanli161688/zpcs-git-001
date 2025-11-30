<template>
	<view class="container">
		<view class="logo" v-if="isComplete">
			<image class="icon" :src="iconLogo" mode="aspectFit"></image>
			<view class="text">{{ siteName }}</view>
		</view>
		<view class="list" v-if="isComplete">
			<view class="item">
				<text-link text="中品维度客服热线" :link="strPhone" :isCall="true" />
			</view>
			<view class="item" v-for="(item, index) in arrLink" :key="index">
				<text-link :text="item.text" :link="item.link" />
			</view>
		</view>
		<view style="text-align: center">
			Copyright&copy;2024-2025
		</view>
		<view style="text-align: center">
			北京中品一号维度商贸有限公司 版权所有
		</view>
		<view style="text-align: center">
			zpwdsc.com
		</view>
	</view>
</template>

<script>

import TextLink from "@/components/Hina/TextLink";
import { getSiteBase, getSiteCustomService } from "../../api/common";

export default {
	name: '',
	components: {
		TextLink
	},
	data() {
		return {
			isComplete: false,
			iconLogo: '',
			strPhone: '',
			arrLink: [],
			siteName: '',
		}
	},
	methods: {
		// 加载基本数据
		loadBaseData: function () {
			getSiteBase().then(res => {
				if (res.data.code == '200') {
					let settingValue = JSON.parse(res.data.result.settingValue);
					this.iconLogo = settingValue.buyerSideLogo;
					this.siteName = settingValue.siteName
				} else {
					uni.showToast({ title: "基础信息加载失败", icon: 'none' })
				}
			})
			getSiteCustomService().then(res => {
				if (res.data.code == '200') {
					let customService = JSON.parse(res.data.result.settingValue);
					this.strPhone = customService.phone;
				} else {
					uni.showToast({ title: "客服信息加载失败", icon: 'none' })
				}
			})
			this.isComplete = true
			// this.iconLogo = `${this.iconCommon}/static/v1/s-logo.jpg`
			// this.strPhone = '13623851992'
			// this.$api.getPlatformInfo().then(res => {
			// 	this.isComplete = true
			// 	this.strPhone = res.phone
			// }).catch(e => {
			// 	this.$u.toast('加载资料失败')
			// })
		}
	},
	onLoad: function () {
		// 加载基本数据
		this.loadBaseData()
		// 以下固定链接
		this.arrLink.push({ text: '中品维度帮助中心', link: '/pages/help/helpCenter' })
		this.arrLink.push({ text: '平台服务协议', link: '/pages/webView/webView?type=USER_AGREEMENT&title=平台服务协议' })
		this.arrLink.push({ text: '用户隐私政策', link: '/pages/webView/webView?type=PRIVACY_POLICY&title=用户隐私政策' })
		this.arrLink.push({ text: '分平台服务商入驻协议', link: '/pages/webView/webView?type=DISTRIBUTOR_REGISTER&title=分平台服务商入驻协议' })
		this.arrLink.push({ text: '供应商入驻协议', link: '/pages/webView/webView?type=STORE_REGISTER&title=供应商入驻协议' })
		// this.arrLink.push({ text: '客服中心', link: '/pages/customerService/link' })
	},
	onShow: function () {

	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;
	padding: 20rpx;

	.logo {
		background: #FFF;
		border-radius: 8rpx;
		height: 500rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		.icon {
			width: 280rpx;
			height: 280rpx;
		}

		.text {
			height: 60rpx;
			line-height: 60rpx;
			font-size: 30rpx;
			font-weight: 600;
		}
	}

	.list {
		margin: 20rpx 0 0;
		background: #FFF;
		border-radius: 8rpx;

		.item {
			position: relative;

			&::after {
				position: absolute;
				content: '';
				left: 24rpx;
				right: 24rpx;
				bottom: 0;
				background: #E7E7E7;
				height: 3rpx;
			}

			&:last-of-type {
				&::after {
					display: none;
				}
			}
		}
	}
}
</style>
