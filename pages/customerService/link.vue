<template>
	<view class="main">
		<button @click="goToHome">客服聊天</button>
		<button @click="goToService">客服中心</button>
		<button @click="goToOrder">订单列表</button>
		<button @click="goToAppiont">预约</button>
	</view>
</template>
  
<script>
export default {
	methods: {
		goToHome() {
			uni.navigateTo({
				url: '/pages/customerService/index',
			});
		},
		goToService() {
			uni.navigateTo({
				url: '/pages/customerService/servicecenter',
			});
		},
		goToOrder() {
			uni.navigateTo({
				url: '/pages/customerService/service',
			});
		},
		goToAppiont() {
			uni.navigateTo({
				url: '/pages/customerService/phone',
			});
		},
	},
}
</script>