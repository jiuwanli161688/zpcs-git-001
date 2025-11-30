<template>
	<view class="container">
		<image class="fail" :src="iconFailed" mode="aspectFit"></image>
		<view class="error">呼叫上门服务失败</view>
		<view class="mail lnk-common lnk-primary" data-link="/pages/profile/afterSales/selfExpress" @tap="handlerLink"
			style="width:100%">自行寄回
		</view>
		<view class="mail lnk-common lnk-primary" data-link="/pages/tabbar/home/index" @tap="handlerLink"
			style="width:100%">要不您一会再来看看？
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			iconFailed: `${this.iconCommon}/static/v1/common/icon-fail.png`,
			sn: ''
		}
	},
	methods: {
		handlerLink: function (e) {
			let eLink = e.currentTarget.dataset.link;
			if (eLink == '/pages/profile/afterSales/selfExpress') {
				uni.navigateTo({ url: `${eLink}?sn=${this.sn}` })
			} else {
				uni.reLaunch({ url: eLink })
			}


		},
	},
	onLoad: function (options) {
		this.sn = options.sn
	},
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10rpx;
}

.container .fail {
	width: 20%;
	height: 260rpx;
}
</style>
