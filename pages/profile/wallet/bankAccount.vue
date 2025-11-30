<template>
	<view class="container">
		<view class="bank-null" v-if="isComplete && arrData.length == 0">
			<empty-box v-if="isComplete && arrData.length == 0" :text="'暂无添加银行卡'" />
		</view>
		<view class="bank-list" v-if="isComplete && arrData.length > 0">
			<view class="item" v-for="(item, index) in arrData" :key="index">
				<bank-card :card='item' :index="index" @delete="handlerDelete" @default="handlerDefault(item)" />
			</view>
		</view>
		<view class="bank-link" @tap="handlerAppend">新增银行卡</view>
	</view>
</template>

<script>

import EmptyBox from "@/components/Hina/EmptyBox";
import BankCard from "@/components/Hina/BankCard";
import { getMemberBank, delMemberBank, updateDefaultMemberBank } from "@/api/members"
export default {
	name: '',
	components: {
		EmptyBox,
		BankCard
	},
	data() {
		return {
			isComplete: false,
			arrData: [],
		}
	},
	methods: {
		// 加载查询列表
		loadBaseData: function () {
			this.isComplete = true
			this.arrData = []
			getMemberBank().then((res) => {
				if (res.data.success) {
					this.arrData = res.data.result.map(item => {
						return { ...item, identifying: '001' };
					});
				}
			})
		},

		// 删除银行账户
		handlerDelete: function (e) {
			if (this.arrData.length == 1) {
				uni.showModal({
					title: '提示',
					content: '删除后将无法进行提现，请添加新的银行卡后再删除！',
					confirmText: '我知道了',
					showCancel: false,
					success: (res) => {
						if (res.confirm) {
						}
					}
				});

			} else {
				uni.showModal({
					title: '提示',
					content: '确认删除此银行卡？',
					confirmText: '确定',
					success: (res) => {
						if (res.confirm) {
							delMemberBank(e.id).then((re) => {
								if (re.data.success) {
									this.$u.toast('删除成功')
									this.loadBaseData()
								}
							})
						}
					}
				});
			}
		},
		// 设置默认银行卡
		handlerDefault(item) {
			uni.showModal({
				title: '提示',
				content: `是否将${item.bankName}尾号${item.cardNumber.slice(-4)}设为默认提现银行卡？`,
				confirmText: '确定',
				success: (res) => {
					if (res.confirm) {
						updateDefaultMemberBank({ id: item.id }).then((re) => {
							if (re.data.success) {
								this.$u.toast('设置成功')
								this.loadBaseData()
							}
						})
					}
				}
			});
		},
		// 新增银行账户
		handlerAppend: function () {
			uni.navigateTo({
				url: '/pages/profile/wallet/bankAppend'
			})
		}
	},
	onLoad: function () {
		// 加载查询列表
	},
	onShow: function () {
		this.loadBaseData()
	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;
	padding: 20rpx;

	.bank-null {}

	.bank-list {
		.item {
			margin: 0 0 24rpx;

			&:last-of-type {
				margin: 0;
			}
		}
	}

	.bank-link {
		margin: 24rpx 0 0;
		border-radius: 12rpx;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: 28rpx;
		background: #FFF;
		border: 3rpx solid #DCDEE0;
		color: #323232;
	}
}
</style>
