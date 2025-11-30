<template>
	<view class="container">
		<view class="wrap-state" v-if="isComplete">
			<image class="icon" :src="iconSalesStatus" mode="aspectFit"></image>
			<view class="text">{{ statusText }}</view>
		</view>
		<view class="lnk-common lnk-primary" @tap="next">取消账号</view>
		<view class="lnk-common lnk-primary" @tap="next">我已收到保证金，确认退出</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			iconBasePath: `${this.iconCommon}/static/v1/sales`,
			isComplete: true,
		};
	},
	computed: {
		// 售后状态
		statusText() {
			// const statusText = {
			// 	'APPLY': '申请中',
			// };
			// return statusText[this.objSales.serviceStatus] || '';
			return '商业专员审批'
		},
		iconSalesStatus() {
			// const iconSalesStatus = {

			// 'WAIT_RED_CONFIRM_REISSUE': `${this.iconBasePath}/icon-process.png`, // 等待用户确认红字确认单后补发
			// };
			// return iconSalesStatus[this.objSales.serviceStatus] || '';
			return `${this.iconBasePath}/icon-process.png`;
		},
	},
	methods: {

	}
}
</script>

<style lang="scss">
.container {
	background: #FFF;
	min-height: 100vh;
	box-sizing: border-box;
}
</style>
