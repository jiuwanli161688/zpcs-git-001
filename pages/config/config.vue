<template>
	<view class="container">
		<view class="box-base">
			<image class="ico" :src="userAvatar" mode="aspectFill"></image>
			<view class="inf">
				<view class="name">{{ userInfo.nickName }}</view>
				<view class="grade">
					<image class="icon" :src="userGrade.gradeIcon" mode="aspectFit"></image>
					<view class="text">{{ userGrade.gradeText }}</view>
				</view>
			</view>
		</view>
		<view class="frm-comm">
			<view class="rs rs-line">
				<view class="name">用户名：</view>
				<view class="flex">
					{{ userInfo.username }}
				</view>
			</view>
			<view class="rs rs-line">
				<view class="name">服务商</view>
				<view class="flex">
					{{ userInfo.bindDistributorNumber }}
				</view>
			</view>
			<view class="rs rs-line" v-if="userInfo.type == '2'">
				<view class="name">合伙人系统手机号</view>
				<view class="flex">
					{{ userInfo.distributorZpyhUserPhone }}
				</view>
			</view>
		</view>
		<view class="lnk-wrapper">
			<view class="list">
				<view class="item" v-for="(item, index) in arrLink" :key="index">
					<text-link :text="item.text" :link="item.link" />
				</view>
			</view>
		</view>

		<view class="lnk-common lnk-secondary" @tap="quit">安全退出</view>
		<view class="lnk-common lnk-primary" @tap="cancellation" v-if="userInfo.type == '1'">注销账号</view>
		<view class="lnk-common lnk-primary" @tap="cancelDis" v-if="userInfo.type == '2'">注销分平台服务商</view>
		<view class="lnk-common lnk-primary" @tap="cancelSup" v-if="userInfo.type == '3'">注销供应商</view>
	</view>
</template>

<script>
import TextLink from "@/components/Hina/TextLink";
import { sendMobile, cancelCheck } from "../../api/login";
import myVerification from '@/components/verification/verification.vue'
import storage from '@/utils/storage.js';
import { quiteLoginOut, userInfo } from "../../utils/filters";

export default {
	name: '',
	components: {
		TextLink,
		myVerification
	},
	data() {
		return {
			isComplete: false,
			arrLink: [],
			userInfo: storage.getUserInfo(),
		}
	},
	computed: {
		userAvatar() {
			// 检查用户头像是否存在
			if (this.userInfo.face) {
				return this.userInfo.face
			} else {
				// 返回默认头像路径
				return `${this.iconCommon}/static/v1/profile/avatar.png`
			}
		},
		// 用户等级处理
		userGrade() {
			if (this.userInfo.type) {
				if (this.userInfo.type == '1') {
					return {
						gradeText: '中品维度用户',
						gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
					}
				}
				if (this.userInfo.type == '2') {
					if (this.userInfo.zpyhUserType == 1) {
						return {
							gradeText: '中品C类服务商',
							gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
						}
					} else if (this.userInfo.zpyhUserType == 2) {
						return {
							gradeText: '中品B类服务商',
							gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
						}
					} else if (this.userInfo.zpyhUserType == 3) {
						return {
							gradeText: '中品A类服务商',
							gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
						}
					} else if (this.userInfo.zpyhUserType == 4) {
						return {
							gradeText: '中品A+类服务商',
							gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
						}
					} else {
						return {
							gradeText: '分平台服务商',
							gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
						}
					}
				}
				if (this.userInfo.type == '3') {
					return {
						gradeText: '中品供应商',
						gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
					}
				}
			} else {
				return {
					gradeText: '中品维度用户',
					gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
				}
			}
		}
	},
	watch: {
	},
	methods: {
		quit: function () {
			quiteLoginOut();
		},

		cancellation: function () {
			let that = this;
			uni.showModal({
				title: "账户注销确认",
				content: "您正在申请注销中品维度商城账号，请您阅读并知悉如下内容：\n一、当前操作不是退出登录，而是注销账号，若错误操作，请点击取消\n\n二、注销后，您当前账号关联的所有内容将被全部删除，包括但不限于您的账户余额、用户权益、个人信息、购物历史等，由此造成的损失由您个人负责\n\n三、注销操作一经发生不可恢复，请您谨慎确认",
				success: (res) => {
					if (res.confirm) {
						uni.navigateTo({
							url: "/pages/config/security/cancelCheck",
						});
					}
				}
			})
		},
		//注销分平台服务商
		cancelDis: function () {
			if (this.userInfo.distributorCancelStatus == '0') {
				uni.navigateTo({
					url: "/pages/config/security/distributorCancellation",
				})
			}
			if (this.userInfo.distributorCancelStatus == '1') {
				uni.navigateTo({
					url: "/pages/config/security/cancelDisWaiting",
				})
			}

		},
		//注销供应商
		cancelSup: function () {
			if (this.userInfo.storeCancelStatus == '0') {
				uni.navigateTo({
					url: "/pages/config/security/supplierCancellation",
				})
			}
			if (this.userInfo.storeCancelStatus == '1') {
				uni.navigateTo({
					url: "/pages/config/security/cancelSupWaiting",
				})
			}
		},

	},
	onLoad: function () {
		this.arrLink.push({ text: '我的资料', link: '/pages/config/archives' })
		this.arrLink.push({ text: '我的身材', link: '/pages/config/figure' })
		this.arrLink.push({ text: '安全设置', link: '/pages/config/security/home' })
		this.arrLink.push({ text: '收件地址', link: '/pages/config/address/home' })
		this.arrLink.push({ text: '发票模板', link: '/pages/config/invoice/home' })
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

	&::before {
		position: absolute;
		content: '';
		left: 0;
		right: 0;
		top: 0;
		height: 240rpx;
		background: #E22221;
	}

	.frm-comm {
		margin-top: 80rpx;
	}

	.lnk-wrapper {
		background: #FFF;
		border-radius: 12rpx;

		.list {
			.item {
				position: relative;

				&::before {
					position: absolute;
					content: '';
					left: 24rpx;
					right: 24rpx;
					bottom: 0;
					height: 3rpx;
					background: #F0F2F5;
				}

				&:last-of-type {
					&::before {
						display: none;
					}
				}
			}
		}
	}

	.box-base {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
		z-index: 1;
		padding: 30rpx 20rpx;

		.ico {
			width: 120rpx;
			height: 120rpx;
		}

		.inf {
			padding: 0 0 0 20rpx;

			.name {
				font-size: 30rpx;
				font-weight: 600;
				line-height: 60rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #FFF;
			}

			.grade {
				display: flex;
				justify-content: center;
				align-items: center;
				background: rgba(255, 255, 255, 0.5);
				border-radius: 48rpx;
				line-height: 48rpx;
				padding: 0 20rpx 0 12rpx;

				.icon {
					width: 48rpx;
					height: 48rpx;
				}

				.text {
					color: #FFF;
					font-size: 24rpx;
				}
			}
		}
	}
}</style>
